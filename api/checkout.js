import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Full-price map: product internal ID → Stripe price ID
const FULL_PRICE_MAP = {
  'print-1': 'price_1TUgZMDyzAs4kAuDnbdoTKhN',   // Art For All Print — $25
  'print-2': 'price_1TUgZODyzAs4kAuDqXcNPXCp',   // Gallery Collection Print — $25
  'print-3': 'price_1TUgZPDyzAs4kAuDRD32RCsI',   // Love Yours Print — $25
  'orig-1':  'price_1TUgZRDyzAs4kAuDj9J0VvAl',   // 4x36 Original — $100
  'orig-2':  'price_1TUgZSDyzAs4kAuD6Ik5urN6',   // 4x36 Mixed Media — $100
  'orig-3':  'price_1TUgZUDyzAs4kAuDX81tF9Qb',   // 4x36 Studio Original — $100
  'prem-1':  'price_1TUgZVDyzAs4kAuDpr4VKxj3',   // 24x36 Premium — $500
  'prem-2':  'price_1TUgZXDyzAs4kAuDIHJ6UsK3',   // 24x36 Signature — $500
  'prem-3':  'price_1TUgZXDyzAs4kAuDzhAwTLiM',   // 24x36 Master — $500
};

// Deposit (50%) price map: product internal ID → Stripe price ID
const DEPOSIT_PRICE_MAP = {
  'print-1': 'price_1TUgZgDyzAs4kAuDOANAP8Dh',   // Art For All Print — $12.50
  'print-2': 'price_1TUgZhDyzAs4kAuDPSVjVAba',   // Gallery Collection Print — $12.50
  'print-3': 'price_1TUgZjDyzAs4kAuDjtSsEPED',   // Love Yours Print — $12.50
  'orig-1':  'price_1TUgZkDyzAs4kAuDVjUx6ATY',   // 4x36 Original — $50
  'orig-2':  'price_1TUgZmDyzAs4kAuDh4RrfDci',   // 4x36 Mixed Media — $50
  'orig-3':  'price_1TUgZnDyzAs4kAuDRrqDWrfl',   // 4x36 Studio Original — $50
  'prem-1':  'price_1TUgZoDyzAs4kAuD3vBw3dyp',   // 24x36 Premium — $250
  'prem-2':  'price_1TUgZpDyzAs4kAuDFQKwQlRS',   // 24x36 Signature — $250
  'prem-3':  'price_1TUgZqDyzAs4kAuDMjoRkmfy',   // 24x36 Master — $250
};

// Product price lookup (in cents) for shipping calculation
const PRODUCT_PRICES = {
  'print-1': 2500,  'print-2': 2500,  'print-3': 2500,
  'orig-1': 10000,  'orig-2': 10000,  'orig-3': 10000,
  'prem-1': 50000,  'prem-2': 50000,  'prem-3': 50000,
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, paymentType } = req.body;
    // items: [{ id: 'print-1', quantity: 2 }, ...]
    // paymentType: 'full' | 'deposit'

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const priceMap = paymentType === 'deposit' ? DEPOSIT_PRICE_MAP : FULL_PRICE_MAP;

    // Validate all items have valid price IDs
    const lineItems = items.map(item => {
      const priceId = priceMap[item.id];
      if (!priceId) {
        throw new Error(`Invalid product ID: ${item.id}`);
      }
      return {
        price: priceId,
        quantity: item.quantity,
      };
    });

    // Calculate subtotal for shipping logic (always use full price for threshold)
    const subtotalCents = items.reduce((sum, item) => {
      return sum + (PRODUCT_PRICES[item.id] || 0) * item.quantity;
    }, 0);

    const subtotalDollars = subtotalCents / 100;
    const freeShipping = subtotalDollars >= 50;

    // Build shipping options
    const shippingOptions = [];

    if (freeShipping) {
      shippingOptions.push({
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'usd' },
          display_name: 'Free Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 7 },
          },
        },
      });
    } else {
      shippingOptions.push({
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 1299, currency: 'usd' },
          display_name: 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 7 },
          },
        },
      });
    }

    // Determine URLs
    const origin = req.headers.origin || req.headers.referer || process.env.SITE_URL || 'https://stashhouse-gallery.vercel.app';
    const baseUrl = origin.replace(/\/$/, '');

    const sessionParams = {
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: shippingOptions,
      success_url: `${baseUrl}?checkout=success`,
      cancel_url: `${baseUrl}?checkout=cancel`,
      metadata: {
        payment_type: paymentType || 'full',
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: err.message });
  }
}
