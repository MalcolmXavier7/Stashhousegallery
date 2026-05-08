import React, { useState, useEffect } from 'react'
import { ShoppingBag, X, Trash2, Menu, Check, Truck, Crown, Star } from 'lucide-react'

const StashHouseGalleryStore = () => {
  const products = [
    { id: 'print-1', name: 'Art For All Print', category: 'prints', price: 25, sku: 'AFP001', image: '🎨' },
    { id: 'print-2', name: 'Gallery Collection Print', category: 'prints', price: 25, sku: 'AFP002', image: '🖼️' },
    { id: 'print-3', name: 'Love Yours Print', category: 'prints', price: 25, sku: 'AFP003', image: '💚' },
    { id: 'orig-1', name: '4x36 Original', category: 'originals', price: 100, sku: 'STH100-1', image: '🎭' },
    { id: 'orig-2', name: '4x36 Mixed Media', category: 'originals', price: 100, sku: 'STH100-2', image: '✨' },
    { id: 'orig-3', name: '4x36 Studio Original', category: 'originals', price: 100, sku: 'STH100-3', image: '🌟' },
    { id: 'prem-1', name: '24x36 Premium', category: 'premiums', price: 500, sku: 'STH500-1', image: '👑' },
    { id: 'prem-2', name: '24x36 Signature', category: 'premiums', price: 500, sku: 'STH500-2', image: '💎' },
    { id: 'prem-3', name: '24x36 Master', category: 'premiums', price: 500, sku: 'STH500-3', image: '🏆' }
  ]

  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [page, setPage] = useState('store') // 'store' | 'success' | 'membership-success'
  const [membershipLoading, setMembershipLoading] = useState(null)

  // Check URL params on load for success/cancel redirects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') === 'success') setPage('success')
    if (params.get('membership') === 'success') setPage('membership-success')
    if (params.get('checkout') === 'cancel') {
      // Clear cancel param silently
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => setCart(prev => prev.filter(item => item.id !== productId))

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) removeFromCart(productId)
    else setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item))
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const freeShipping = cartTotal >= 50
  const shippingCost = freeShipping ? 0 : 12.99
  const amountToFreeShipping = Math.max(0, 50 - cartTotal)
  const orderTotal = cartTotal + shippingCost

  const filteredProducts = selectedCategory === 'all' ? products : products.filter(p => p.category === selectedCategory)
  const categoryCounts = {
    all: products.length,
    prints: products.filter(p => p.category === 'prints').length,
    originals: products.filter(p => p.category === 'originals').length,
    premiums: products.filter(p => p.category === 'premiums').length
  }

  const handleCheckout = async (paymentType) => {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
          paymentType
        })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Checkout error: ' + (data.error || 'Unknown error'))
    } catch (err) {
      alert('Checkout error: ' + err.message)
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleMembership = async (plan) => {
    setMembershipLoading(plan)
    try {
      const res = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Error: ' + (data.error || 'Unknown error'))
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setMembershipLoading(null)
    }
  }

  // ── SUCCESS PAGE ──
  if (page === 'success') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#c4ff00', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        <Check size={40} color="#000" strokeWidth={3} />
      </div>
      <h1 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>THANK YOU</h1>
      <p style={{ fontSize: '16px', color: '#999', marginBottom: '3rem', maxWidth: '400px' }}>Your order is confirmed. We'll ship it out soon.</p>

      <div style={{ backgroundColor: '#111', border: '2px solid #c4ff00', borderRadius: '12px', padding: '2.5rem', maxWidth: '500px', width: '100%', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Crown size={24} color="#c4ff00" />
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#c4ff00', letterSpacing: '1px' }}>JOIN THE FAMILY</h2>
        </div>
        <p style={{ fontSize: '14px', color: '#ccc', lineHeight: 1.7, marginBottom: '2rem' }}>
          Become a Stash House member. Exclusive goodies, discounts, early access to drops, and more.
        </p>

        <button onClick={() => handleMembership('monthly')} disabled={membershipLoading === 'monthly'} style={{ width: '100%', padding: '1rem', backgroundColor: '#c4ff00', color: '#000', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
          {membershipLoading === 'monthly' ? 'LOADING...' : '$5.99 / MONTH'}
        </button>
        <button onClick={() => handleMembership('annual')} disabled={membershipLoading === 'annual'} style={{ width: '100%', padding: '1rem', backgroundColor: 'transparent', color: '#c4ff00', border: '2px solid #c4ff00', borderRadius: '6px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', marginBottom: '1rem', letterSpacing: '0.5px' }}>
          {membershipLoading === 'annual' ? 'LOADING...' : '$40 / YEAR — SAVE 44%'}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '12px', color: '#999' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={14} color="#c4ff00" /> Exclusive member-only drops</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={14} color="#c4ff00" /> Discounts on all artwork</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={14} color="#c4ff00" /> Monthly goodies & surprises</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={14} color="#c4ff00" /> Early access to new collections</div>
        </div>
      </div>

      <button onClick={() => { setPage('store'); window.history.replaceState({}, '', window.location.pathname) }} style={{ background: 'none', border: 'none', color: '#666', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
        Continue Shopping
      </button>
    </div>
  )

  if (page === 'membership-success') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#c4ff00', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        <Crown size={40} color="#000" />
      </div>
      <h1 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '0.5rem' }}>WELCOME TO THE FAMILY</h1>
      <p style={{ fontSize: '16px', color: '#999', marginBottom: '2rem', maxWidth: '400px' }}>You're officially a Stash House member. Your exclusive perks are on the way.</p>
      <button onClick={() => { setPage('store'); window.history.replaceState({}, '', window.location.pathname) }} style={{ padding: '1rem 2rem', backgroundColor: '#c4ff00', color: '#000', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>
        SHOP WITH MEMBER PERKS →
      </button>
    </div>
  )

  // ── MAIN STORE ──
  return (
    <div>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '2px solid #000', backgroundColor: '#fff', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.2, textAlign: 'center' }}>STASH<br />HOUSE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: window.innerWidth <= 768 ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', border: '2px solid #000', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' }}>
            <Menu size={24} />
          </button>
          <button onClick={() => setShowCart(true)} style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'transparent', transition: 'background 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f0'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <ShoppingBag size={24} />
            {cartCount > 0 && <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#c4ff00', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{cartCount}</div>}
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff', overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{ width: '200px', borderRight: '1px solid #999', padding: '2rem 1.5rem', backgroundColor: '#fff', display: window.innerWidth <= 768 && !mobileMenuOpen ? 'none' : 'block', position: window.innerWidth <= 768 ? 'fixed' : 'relative', left: 0, top: '80px', height: window.innerWidth <= 768 ? 'calc(100vh - 80px)' : 'auto', zIndex: 99, overflow: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', marginBottom: '1.5rem', textTransform: 'uppercase', color: '#000' }}>Filter</div>
          {[
            { label: 'ALL', key: 'all' },
            { label: '$25 PRINTS', key: 'prints' },
            { label: '$100 ORIGINALS', key: 'originals' },
            { label: '$500 PREMIUMS', key: 'premiums' }
          ].map(cat => (
            <button key={cat.key} onClick={() => { setSelectedCategory(cat.key); if (window.innerWidth <= 768) setMobileMenuOpen(false) }}
              style={{ width: '100%', padding: '0.75rem', marginBottom: '0.75rem', border: '1px solid #000', borderRadius: '6px', textAlign: 'left', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', backgroundColor: selectedCategory === cat.key ? '#c4ff00' : '#fff', color: '#000' }}
              onMouseEnter={e => { if (selectedCategory !== cat.key) e.currentTarget.style.backgroundColor = '#f5f5f0' }}
              onMouseLeave={e => { if (selectedCategory !== cat.key) e.currentTarget.style.backgroundColor = '#fff' }}>
              {cat.label} ({categoryCounts[cat.key]})
            </button>
          ))}
          <div style={{ marginTop: '2rem', fontSize: '12px', color: '#666', lineHeight: 1.6 }}>
            <strong>StashHouse Gallery × Love Yours Club</strong><br /><br />
            Art For All. Flexible ownership. Zero compromise on quality.
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
          <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '2px solid #000' }}>
              <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-1px' }}>{selectedCategory === 'all' ? 'ALL' : selectedCategory.toUpperCase()}</h1>
              <span style={{ fontSize: '48px', fontWeight: 900, color: '#c4ff00' }}>{filteredProducts.length}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {filteredProducts.map(product => (
                <div key={product.id} style={{ backgroundColor: '#f5f5f0', padding: '1rem', borderRadius: '6px', position: 'relative', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '1rem', backgroundColor: '#fff', borderRadius: '4px' }}>{product.image}</div>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '0.5rem' }}>{product.name}</h3>
                  <div style={{ fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{product.sku}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '1rem' }}>${product.price}</div>
                  <button onClick={() => addToCart(product)} style={{ position: 'absolute', bottom: '1rem', right: '1rem', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#c4ff00', color: '#000', border: 'none', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>+</button>
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <section style={{ backgroundColor: '#000', color: '#fff', padding: '3rem 2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '1.5rem' }}>Art For All</h2>
            <p style={{ fontSize: '14px', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Malcolm Xavior Seven, multidisciplinary artist and technologist. StashHouse Gallery brings ownership within reach. $25 prints. $100 originals. $500 premiums. Half deposit. 3 months flexible payment. Art and hard times.
            </p>
            <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#c4ff00' }}>
              <div style={{ marginBottom: '0.75rem' }}>✓ FREE SHIPPING ON ORDERS $50+</div>
              <div style={{ marginBottom: '0.75rem' }}>✓ HALF DEPOSIT SECURES</div>
              <div style={{ marginBottom: '0.75rem' }}>✓ 3 MONTH PAYMENT</div>
              <div style={{ marginBottom: '0.75rem' }}>✓ OWNERSHIP LOCKED IN</div>
            </div>
          </section>
        </main>
      </div>

      {/* Cart Drawer */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '420px', maxWidth: '100vw', height: '100vh', backgroundColor: '#fff', borderLeft: '3px solid #000', zIndex: 200, display: 'flex', flexDirection: 'column', transform: showCart ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s' }}>
        <div style={{ padding: '1.5rem', borderBottom: '2px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '1px' }}>SHOPPING BAG</h2>
          <button onClick={() => setShowCart(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>Your bag is empty</div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#f5f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', borderRadius: '4px', flexShrink: 0 }}>{item.image}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '0.25rem' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '0.25rem' }}>{item.sku}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '0.5rem' }}>${item.price}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '28px', height: '28px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f5f5f0', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>−</button>
                    <span style={{ fontSize: '13px', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '28px', height: '28px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f5f5f0', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>+</button>
                    <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer with shipping + checkout */}
        <div style={{ borderTop: '2px solid #000', padding: '1.5rem', backgroundColor: '#fff' }}>
          {/* Shipping progress */}
          {cart.length > 0 && !freeShipping && (
            <div style={{ backgroundColor: '#f5f5f0', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>
              <Truck size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Add ${amountToFreeShipping.toFixed(2)} more for FREE shipping!
            </div>
          )}
          {cart.length > 0 && freeShipping && (
            <div style={{ backgroundColor: '#e8ffa0', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '12px', fontWeight: 700, textAlign: 'center', color: '#000' }}>
              ✓ FREE SHIPPING UNLOCKED
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '13px' }}>
            <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '13px', color: freeShipping ? '#2a8a00' : '#666' }}>
            <span>Shipping</span><span>{freeShipping ? 'FREE' : '$12.99'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '16px', fontWeight: 800, borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
            <span>TOTAL</span><span>${orderTotal.toFixed(2)}</span>
          </div>

          {/* Two checkout buttons */}
          <button onClick={() => handleCheckout('full')} style={{ width: '100%', padding: '1rem', backgroundColor: '#c4ff00', color: '#000', border: '2px solid #000', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: cart.length === 0 ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', opacity: cart.length === 0 ? 0.4 : 1 }} disabled={cart.length === 0 || checkoutLoading}>
            {checkoutLoading ? 'LOADING...' : 'PAY IN FULL'}
          </button>
          <button onClick={() => handleCheckout('deposit')} style={{ width: '100%', padding: '1rem', backgroundColor: '#000', color: '#c4ff00', border: '2px solid #000', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: cart.length === 0 ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '1px', opacity: cart.length === 0 ? 0.4 : 1 }} disabled={cart.length === 0 || checkoutLoading}>
            {checkoutLoading ? 'LOADING...' : '50% DEPOSIT — PAY REST LATER'}
          </button>
          <p style={{ fontSize: '10px', color: '#999', textAlign: 'center', marginTop: '0.75rem', lineHeight: 1.5 }}>
            Deposit secures your piece. Remaining 50% due within 3 months.<br />Shipping address collected at checkout.
          </p>
        </div>
      </div>

      {/* Overlay when cart is open */}
      {showCart && <div onClick={() => setShowCart(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 150 }} />}
    </div>
  )
}

export default StashHouseGalleryStore
