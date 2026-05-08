import React, { useState } from 'react'
import { ShoppingBag, X, Trash2, Menu } from 'lucide-react'

const StashHouseGalleryStore = () => {
  // Product data
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

  // State
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Cart operations
  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id)
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Filter products
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory)

  // Category counts
  const categoryCounts = {
    all: products.length,
    prints: products.filter(p => p.category === 'prints').length,
    originals: products.filter(p => p.category === 'originals').length,
    premiums: products.filter(p => p.category === 'premiums').length
  }

  // Styles
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#fff',
      overflow: 'hidden'
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 2rem',
      borderBottom: '2px solid #000',
      backgroundColor: '#fff',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 900,
      letterSpacing: '-2px',
      lineHeight: 1.2,
      textAlign: 'center'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    bagButton: {
      position: 'relative',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: '2px solid #000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    cartBadge: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#c4ff00',
      color: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    mainContent: {
      flex: 1,
      overflowY: 'auto',
      paddingBottom: '2rem'
    },
    sidebar: {
      width: '200px',
      borderRight: '1px solid #999',
      padding: '2rem 1.5rem',
      backgroundColor: '#fff'
    },
    filterLabel: {
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '2px',
      marginBottom: '1.5rem',
      textTransform: 'uppercase',
      color: '#000'
    },
    categoryButton: {
      width: '100%',
      padding: '0.75rem',
      marginBottom: '0.75rem',
      border: '1px solid #000',
      borderRadius: '6px',
      textAlign: 'left',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: '#fff',
      color: '#000'
    },
    aboutSection: {
      marginTop: '2rem',
      fontSize: '12px',
      color: '#666',
      lineHeight: 1.6
    },
    mainSection: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    headline: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '0.5rem',
      marginBottom: '1.5rem',
      paddingBottom: '1.5rem',
      borderBottom: '2px solid #000'
    },
    headlineTitle: {
      fontSize: '48px',
      fontWeight: 900,
      letterSpacing: '-1px'
    },
    headlineCount: {
      fontSize: '48px',
      fontWeight: 900,
      color: '#c4ff00'
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '3rem'
    },
    productCard: {
      backgroundColor: '#f5f5f0',
      padding: '1rem',
      borderRadius: '6px',
      position: 'relative'
    },
    productImage: {
      aspectRatio: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
      marginBottom: '1rem',
      backgroundColor: '#fff',
      borderRadius: '4px'
    },
    productName: {
      fontSize: '13px',
      fontWeight: 700,
      marginBottom: '0.5rem'
    },
    productSku: {
      fontSize: '11px',
      color: '#666',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      marginBottom: '0.75rem'
    },
    productPrice: {
      fontSize: '16px',
      fontWeight: 700,
      marginBottom: '1rem'
    },
    addButton: {
      position: 'absolute',
      bottom: '1rem',
      right: '1rem',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#c4ff00',
      color: '#000',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s'
    },
    drawer: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '420px',
      height: '100vh',
      backgroundColor: '#fff',
      borderLeft: '3px solid #000',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      transform: showCart ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s'
    },
    drawerHeader: {
      padding: '1.5rem',
      borderBottom: '2px solid #000',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    drawerContent: {
      flex: 1,
      overflowY: 'auto',
      padding: '1.5rem'
    },
    emptyCart: {
      textAlign: 'center',
      color: '#999',
      marginTop: '2rem'
    },
    cartItem: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid #eee'
    },
    cartItemImage: {
      width: '80px',
      height: '80px',
      backgroundColor: '#f5f5f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      borderRadius: '4px',
      flexShrink: 0
    },
    cartItemInfo: {
      flex: 1
    },
    cartItemName: {
      fontSize: '13px',
      fontWeight: 700,
      marginBottom: '0.25rem'
    },
    cartItemSku: {
      fontSize: '11px',
      color: '#666',
      marginBottom: '0.25rem'
    },
    cartItemPrice: {
      fontSize: '14px',
      fontWeight: 700,
      marginBottom: '0.5rem'
    },
    qtyControls: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    },
    qtyButton: {
      width: '28px',
      height: '28px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f5f5f0',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 600
    },
    drawerFooter: {
      borderTop: '2px solid #000',
      padding: '1.5rem',
      backgroundColor: '#fff'
    },
    subtotal: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.75rem',
      fontSize: '14px',
      fontWeight: 700
    },
    paymentNote: {
      fontSize: '11px',
      color: '#666',
      lineHeight: 1.6,
      marginBottom: '1rem'
    },
    checkoutButton: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#c4ff00',
      color: '#000',
      border: '2px solid #000',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: 700,
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 150,
      display: showCheckout ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modal: {
      backgroundColor: '#fff',
      borderRadius: '0px',
      border: '3px solid #000',
      width: '500px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    modalHeader: {
      padding: '1.5rem',
      borderBottom: '2px solid #000',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalContent: {
      padding: '1.5rem'
    },
    orderItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      fontSize: '13px'
    },
    orderTotal: {
      borderTop: '2px solid #000',
      paddingTop: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: '1.5rem',
      fontSize: '16px'
    },
    orderTotalPrice: {
      fontSize: '20px',
      fontWeight: 900
    },
    paymentOptions: {
      backgroundColor: '#f5f5f0',
      padding: '1rem',
      marginBottom: '1.5rem',
      borderRadius: '6px'
    },
    paymentOptionsTitle: {
      fontWeight: 700,
      marginBottom: '1rem',
      fontSize: '13px'
    },
    paymentOptionsList: {
      fontSize: '12px',
      lineHeight: 1.8,
      color: '#333'
    },
    stripeButton: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#c4ff00',
      color: '#000',
      border: '2px solid #000',
      borderRadius: '0px',
      fontSize: '13px',
      fontWeight: 700,
      cursor: 'pointer',
      textTransform: 'uppercase',
      marginBottom: '1rem'
    },
    modalFooter: {
      textAlign: 'center',
      fontSize: '11px',
      color: '#666'
    },
    infoSection: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '3rem 2rem',
      textAlign: 'center'
    },
    infoHeadline: {
      fontSize: '28px',
      fontWeight: 900,
      marginBottom: '1.5rem'
    },
    infoCopy: {
      fontSize: '14px',
      lineHeight: 1.8,
      marginBottom: '2rem',
      maxWidth: '600px',
      margin: '0 auto 2rem'
    },
    checkmarks: {
      fontSize: '11px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: '#c4ff00'
    },
    checkmarkItem: {
      marginBottom: '0.75rem'
    },
    menuButton: {
      display: 'none',
      width: '40px',
      height: '40px',
      border: '2px solid #000',
      borderRadius: '4px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      '@media (max-width: 768px)': {
        display: 'flex'
      }
    }
  }

  return (
    <div>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          STASH<br />HOUSE
        </div>
        <div style={styles.headerRight}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ ...styles.menuButton, display: window.innerWidth <= 768 ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center' }}
          >
            <Menu size={24} />
          </button>
          <button
            onClick={() => setShowCart(true)}
            style={styles.bagButton}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f0'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && <div style={styles.cartBadge}>{cartCount}</div>}
          </button>
        </div>
      </header>

      <div style={styles.container}>
        {/* Sidebar */}
        <aside style={{
          ...styles.sidebar,
          display: window.innerWidth <= 768 && !mobileMenuOpen ? 'none' : 'block',
          position: window.innerWidth <= 768 ? 'fixed' : 'relative',
          left: 0,
          top: '80px',
          height: window.innerWidth <= 768 ? 'calc(100vh - 80px)' : 'auto',
          zIndex: 99,
          backgroundColor: '#fff',
          borderRight: window.innerWidth <= 768 ? '3px solid #000' : '1px solid #999',
          overflow: 'auto'
        }}>
          <div style={styles.filterLabel}>Filter</div>

          {[
            { label: 'ALL', key: 'all' },
            { label: '$25 PRINTS', key: 'prints' },
            { label: '$100 ORIGINALS', key: 'originals' },
            { label: '$500 PREMIUMS', key: 'premiums' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => {
                setSelectedCategory(cat.key)
                if (window.innerWidth <= 768) setMobileMenuOpen(false)
              }}
              style={{
                ...styles.categoryButton,
                backgroundColor: selectedCategory === cat.key ? '#c4ff00' : '#fff',
                color: selectedCategory === cat.key ? '#000' : '#000'
              }}
              onMouseEnter={e => {
                if (selectedCategory !== cat.key) e.currentTarget.style.backgroundColor = '#f5f5f0'
              }}
              onMouseLeave={e => {
                if (selectedCategory !== cat.key) e.currentTarget.style.backgroundColor = '#fff'
              }}
            >
              {cat.label} ({categoryCounts[cat.key]})
            </button>
          ))}

          <div style={styles.aboutSection}>
            <strong>StashHouse Gallery × Love Yours Club</strong><br />
            <br />
            Art For All. Flexible ownership. Zero compromise on quality.
          </div>
        </aside>

        {/* Main Content */}
        <main style={styles.mainContent}>
          <div style={styles.mainSection}>
            <div style={styles.headline}>
              <h1 style={styles.headlineTitle}>
                {selectedCategory === 'all' ? 'ALL' : selectedCategory.toUpperCase().replace('-', ' ')}
              </h1>
              <span style={styles.headlineCount}>{filteredProducts.length}</span>
            </div>

            <div style={styles.productGrid}>
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  style={styles.productCard}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={styles.productImage}>{product.image}</div>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <div style={styles.productSku}>{product.sku}</div>
                  <div style={styles.productPrice}>${product.price}</div>
                  <button
                    onClick={() => addToCart(product)}
                    style={styles.addButton}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <section style={styles.infoSection}>
            <h2 style={styles.infoHeadline}>Art For All</h2>
            <p style={styles.infoCopy}>
              Malcolm Xavior Seven, multidisciplinary artist and technologist. StashHouse Gallery brings ownership within reach. $25 prints. $100 originals. $500 premiums. Half deposit. 3 months flexible payment. Art and hard times.
            </p>
            <div style={styles.checkmarks}>
              <div style={styles.checkmarkItem}>✓ HALF DEPOSIT SECURES</div>
              <div style={styles.checkmarkItem}>✓ 3 MONTH PAYMENT</div>
              <div style={styles.checkmarkItem}>✓ OWNERSHIP LOCKED IN</div>
            </div>
          </section>
        </main>
      </div>

      {/* Cart Drawer */}
      <div style={styles.drawer}>
        <div style={styles.drawerHeader}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '1px' }}>SHOPPING BAG</h2>
          <button onClick={() => setShowCart(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.drawerContent}>
          {cart.length === 0 ? (
            <div style={styles.emptyCart}>Your bag is empty</div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={styles.cartItem}>
                <div style={styles.cartItemImage}>{item.image}</div>
                <div style={styles.cartItemInfo}>
                  <div style={styles.cartItemName}>{item.name}</div>
                  <div style={styles.cartItemSku}>{item.sku}</div>
                  <div style={styles.cartItemPrice}>${item.price}</div>
                  <div style={styles.qtyControls}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={styles.qtyButton}
                    >
                      −
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={styles.qtyButton}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={styles.drawerFooter}>
          <div style={styles.subtotal}>
            <span>SUBTOTAL</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <p style={styles.paymentNote}>
            50% deposit now. 50% in 3 months. Flexible terms available. Shipping + taxes calculated at checkout.
          </p>
          <button
            onClick={() => {
              setShowCart(false)
              setShowCheckout(true)
            }}
            style={styles.checkoutButton}
            disabled={cart.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.modalHeader}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '1px' }}>ORDER SUMMARY</h2>
            <button onClick={() => setShowCheckout(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          <div style={styles.modalContent}>
            {cart.map(item => (
              <div key={item.id} style={styles.orderItem}>
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div style={styles.orderTotal}>
              <span>TOTAL</span>
              <span style={styles.orderTotalPrice}>${cartTotal.toFixed(2)}</span>
            </div>

            <div style={styles.paymentOptions}>
              <div style={styles.paymentOptionsTitle}>PAYMENT OPTIONS</div>
              <div style={styles.paymentOptionsList}>
                <div style={{ marginBottom: '0.75rem' }}>• 50% deposit now, 50% due in 3 months</div>
                <div style={{ marginBottom: '0.75rem' }}>• Full payment upfront</div>
                <div>• Monthly installments (inquire)</div>
              </div>
            </div>

            <button
              onClick={() => window.open('https://buy.stripe.com', '_blank')}
              style={styles.stripeButton}
            >
              Proceed to Stripe
            </button>

            <div style={styles.modalFooter}>
              Secure checkout. Flexible payment terms. All artwork protected.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StashHouseGalleryStore
