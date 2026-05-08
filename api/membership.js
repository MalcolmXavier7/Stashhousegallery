import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const MEMBERSHIP_PRICES = {
  monthly: 'price_1TUgZYDyzAs4kAuDYYsUJ6Xj', // $5.99/mo
  annual:  'price_1TUgZZDyzAs4kAuDc4TC6O7c',  // $40/year
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { plan } = req.body; // 'monthly' | 'annual'
    const priceId = MEMBERSHIP_PRICES[plan];

    if (!priceId) {
      return res.status(400).json({ error: 'Invalid membership plan' });
    }

    const origin = req.headers.origin || req.headers.referer || process.env.SITE_URL || 'https://stashhouse-gallery.vercel.app';
    const baseUrl = origin.replace(/\/$/, '');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}?membership=success`,
      cancel_url: `${baseUrl}?checkout=success`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Membership checkout error:', err);
    return res.status(500).json({ error: err.message });
  }
}
