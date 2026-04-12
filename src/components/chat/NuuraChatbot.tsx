'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, ShoppingBag, Package, Search, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Product } from '@/types'

const C = {
  forest: '#1B2E1F', cream: '#F5F0E6', gold: '#D4A853',
  goldLight: '#E8C97A', white: '#FAFAF8', offwhite: '#F0EBE3',
  ink: '#0F1A11', muted: '#6B7B6E', border: '#DDD8CF',
}

// ── Product catalog ───────────────────────────────────────────────
const PRODUCTS = [
  {
    id: '1', slug: 'rose-quartz-gua-sha', name: 'Rose Quartz Gua Sha',
    tagline: 'Sculpt. Depuff. Glow.', price: 2800, comparePrice: 3500,
    category: 'self-care', tags: ['gua sha', 'facial', 'sculpt', 'depuff', 'glow', 'massage', 'stone'],
    description: 'Authentic rose quartz for facial lifting and lymphatic drainage.',
    inStock: true, isNew: true, isBestSeller: false,
  },
  {
    id: '2', slug: 'led-glow-mirror', name: 'LED Glow Mirror',
    tagline: 'Studio lighting, anywhere.', price: 4500, comparePrice: 5500,
    category: 'self-care', tags: ['mirror', 'led', 'makeup', 'vanity', 'light', 'glow'],
    description: 'Adjustable brightness, 10x magnification, USB rechargeable.',
    inStock: true, isNew: false, isBestSeller: true,
  },
  {
    id: '3', slug: 'mini-chain-crossbody', name: 'Mini Chain Crossbody',
    tagline: 'Small bag. Big statement.', price: 3200, comparePrice: null,
    category: 'accessories', tags: ['bag', 'crossbody', 'chain', 'purse', 'handbag', 'quilted'],
    description: 'Quilted mini crossbody with gold chain strap.',
    inStock: true, isNew: true, isBestSeller: false,
  },
  {
    id: '4', slug: 'jade-face-roller', name: 'Jade Face Roller',
    tagline: 'Roll away the stress.', price: 1800, comparePrice: 2200,
    category: 'self-care', tags: ['jade', 'roller', 'facial', 'massage', 'puffiness', 'eye'],
    description: 'Dual-ended jade roller for massage and serum absorption.',
    inStock: true, isNew: false, isBestSeller: true,
  },
  {
    id: '5', slug: 'acrylic-clutch', name: 'Acrylic Box Clutch',
    tagline: 'Art you carry.', price: 2500, comparePrice: null,
    category: 'accessories', tags: ['clutch', 'acrylic', 'transparent', 'evening', 'bag', 'clear'],
    description: 'Clear acrylic with gold hardware. Statement piece.',
    inStock: true, isNew: true, isBestSeller: false,
  },
  {
    id: '6', slug: 'facial-steamer', name: 'USB Facial Steamer',
    tagline: 'Open up. Breathe in. Glow.', price: 3800, comparePrice: 4500,
    category: 'self-care', tags: ['steamer', 'facial', 'pores', 'steam', 'cleanse', 'hydration'],
    description: 'Nano ionic steamer for deep pore cleansing.',
    inStock: true, isNew: false, isBestSeller: false,
  },
  {
    id: '7', slug: 'night-cream', name: 'Night Cream',
    tagline: 'Restore. Nourish. Rejuvenate.', price: 2200, comparePrice: 3000,
    category: 'self-care', tags: ['cream', 'night', 'moisturizer', 'skincare', 'hydration', 'sleep'],
    description: 'Rich night cream with hyaluronic acid and peptides for deep hydration.',
    inStock: true, isNew: true, isBestSeller: false,
  },
]

// ── Mock orders ───────────────────────────────────────────────────
const MOCK_ORDERS: Record<string, { status: string; items: string[]; date: string; eta: string }> = {
  'NR-260101-1234': { status: 'shipped', items: ['Rose Quartz Gua Sha'], date: '2025-01-20', eta: 'Tomorrow by 8pm' },
  'NR-260102-5678': { status: 'confirmed', items: ['LED Glow Mirror', 'Jade Face Roller'], date: '2025-01-21', eta: '2-3 business days' },
  'NR-260103-9012': { status: 'delivered', items: ['Mini Chain Crossbody'], date: '2025-01-18', eta: 'Delivered' },
  'NR-260104-3456': { status: 'pending_verification', items: ['USB Facial Steamer'], date: '2025-01-22', eta: 'Awaiting payment confirmation' },
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  pending_verification: { label: 'Awaiting Payment Confirmation', color: '#B8860B', icon: '⏳' },
  confirmed: { label: 'Order Confirmed', color: '#166534', icon: '✅' },
  processing: { label: 'Being Prepared', color: '#1d4ed8', icon: '📦' },
  shipped: { label: 'Out for Delivery', color: '#6d28d9', icon: '🚚' },
  delivered: { label: 'Delivered', color: '#065f46', icon: '🎉' },
  cancelled: { label: 'Cancelled', color: '#991b1b', icon: '❌' },
}

// ── Message types ─────────────────────────────────────────────────
type MsgType = 'text' | 'products' | 'order' | 'cart' | 'quick_replies'

interface Msg {
  role: 'user' | 'bot'
  text: string
  type?: MsgType
  products?: typeof PRODUCTS
  order?: typeof MOCK_ORDERS[string] & { number: string }
  quickReplies?: string[]
  cartAction?: { action: 'added' | 'removed' | 'show'; item?: string; total?: number }
}

// ── NLP helpers ───────────────────────────────────────────────────
function extractPrice(text: string): { min: number; max: number } | null {
  const under = text.match(/under\s+(?:pkr\s*)?(\d+)/i)
  const above = text.match(/(?:above|over|more than)\s+(?:pkr\s*)?(\d+)/i)
  const between = text.match(/between\s+(?:pkr\s*)?(\d+)\s+and\s+(?:pkr\s*)?(\d+)/i)
  if (between) return { min: parseInt(between[1]), max: parseInt(between[2]) }
  if (under) return { min: 0, max: parseInt(under[1]) }
  if (above) return { min: parseInt(above[1]), max: 99999 }
  return null
}

function findProducts(query: string): typeof PRODUCTS {
  const lower = query.toLowerCase()
  const priceFilter = extractPrice(lower)

  let results = PRODUCTS.filter(p => {
    const matchesText = (
      p.name.toLowerCase().includes(lower) ||
      p.tagline.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.tags.some(t => lower.includes(t)) ||
      lower.includes(p.name.toLowerCase().split(' ')[0])
    )
    const matchesPrice = !priceFilter || (p.price >= priceFilter.min && p.price <= priceFilter.max)
    const matchesCategory =
      (lower.includes('self-care') || lower.includes('skincare') || lower.includes('beauty')) ? p.category === 'self-care' :
      (lower.includes('accessor') || lower.includes('bag') || lower.includes('clutch') || lower.includes('purse')) ? p.category === 'accessories' :
      true

    return matchesText && matchesPrice && matchesCategory
  })

  // Trending / bestseller
  if (lower.includes('best') || lower.includes('popular') || lower.includes('trending')) {
    results = PRODUCTS.filter(p => p.isBestSeller)
    if (!results.length) results = PRODUCTS.slice(0, 3)
  }

  // New arrivals
  if (lower.includes('new') || lower.includes('latest') || lower.includes('arrival')) {
    results = PRODUCTS.filter(p => p.isNew)
  }

  // All products
  if (lower.includes('all') || lower.includes('everything') || lower.includes('show me') || lower === 'products') {
    results = PRODUCTS
  }

  return results
}

function getOrderStatus(query: string): typeof MOCK_ORDERS[string] & { number: string } | null {
  const match = query.match(/NR-\d{6}-\d{4}/i)
  if (match) {
    const num = match[0].toUpperCase()
    const order = MOCK_ORDERS[num]
    if (order) return { ...order, number: num }
  }
  return null
}

// ── Main bot logic ────────────────────────────────────────────────
function processMessage(
  input: string,
  cart: { items: { product: any; quantity: number }[] },
  addItem: (product: any) => void,
  removeItem: (id: string) => void,
  clearCart: () => void
): Msg {
  const lower = input.toLowerCase().trim()

  // ── Greetings ──────────────────────────────────────────────────
  if (/^(hi|hello|hey|salam|assalam|yo|sup)/.test(lower)) {
    return {
      role: 'bot', text: "Hi! I'm Noor, your Nuura beauty assistant ✨\n\nI can help you find products, track your order, manage your cart, and answer any questions. What would you like to do?",
      type: 'quick_replies',
      quickReplies: ['Show all products', 'Best sellers', 'Track my order', 'What\'s new?'],
    }
  }

  // ── Order tracking ─────────────────────────────────────────────
  if (lower.includes('track') || lower.includes('order') || lower.includes('where is') || lower.includes('my order') || lower.includes('status')) {
    const orderData = getOrderStatus(input)
    if (orderData) {
      const statusInfo = STATUS_LABELS[orderData.status] || { label: orderData.status, color: C.muted, icon: '📦' }
      return {
        role: 'bot',
        text: `Found your order! ${statusInfo.icon}\n\nOrder #${orderData.number}\nStatus: ${statusInfo.label}\nItems: ${orderData.items.join(', ')}\nETA: ${orderData.eta}`,
        type: 'order',
        order: orderData,
      }
    }
    return {
      role: 'bot',
      text: "Please share your order number and I'll track it for you! 📦\n\nYour order number looks like: NR-XXXXXX-XXXX\n\nYou can find it in your confirmation WhatsApp message or email.",
      type: 'quick_replies',
      quickReplies: ['NR-260101-1234 (demo)', 'NR-260102-5678 (demo)', 'Contact support'],
    }
  }

  // ── Cart: view ─────────────────────────────────────────────────
  if (lower.includes('cart') || lower.includes('basket') || lower.includes('what did i add')) {
    if (cart.items.length === 0) {
      return {
        role: 'bot', text: "Your cart is empty! Let me help you find something beautiful 🌿",
        type: 'quick_replies',
        quickReplies: ['Show all products', 'Best sellers', 'Under PKR 2,000'],
      }
    }
    const total = cart.items.reduce((s, i) => s + i.product.price * i.quantity, 0)
    const itemsList = cart.items.map(i => `• ${i.product.name} ×${i.quantity} — PKR ${(i.product.price * i.quantity).toLocaleString()}`).join('\n')
    return {
      role: 'bot',
      text: `Your cart (${cart.items.length} item${cart.items.length > 1 ? 's' : ''}):\n\n${itemsList}\n\nTotal: PKR ${total.toLocaleString()}\n${total >= 5000 ? '✅ Free shipping!' : `PKR ${(5000 - total).toLocaleString()} more for free shipping`}`,
      type: 'quick_replies',
      quickReplies: ['Proceed to checkout', 'Clear cart', 'Continue shopping'],
    }
  }

  // ── Cart: remove ───────────────────────────────────────────────
  if (lower.includes('remove') || lower.includes('delete from cart') || lower.includes('take out')) {
    const product = PRODUCTS.find(p => lower.includes(p.name.toLowerCase()) || p.tags.some(t => lower.includes(t)))
    if (product) {
      // NOTE: use cart store _id
      const cartItem = cart.items.find((item) => item.product.slug === product.slug)
      if (cartItem) removeItem(cartItem.product._id)
      return { role: 'bot', text: `Removed ${product.name} from your cart. 🗑️\n\nAnything else I can help with?`, type: 'quick_replies', quickReplies: ['View cart', 'Continue shopping', 'Checkout'] }
    }
    return { role: 'bot', text: "Which item would you like to remove? Share the product name and I'll take care of it!", type: 'quick_replies', quickReplies: ['View cart'] }
  }

  // ── Cart: add ──────────────────────────────────────────────────
  if (lower.includes('add to cart') || lower.includes('add it') || lower.includes('buy') || lower.includes('purchase') || lower.includes('i want') || lower.includes('order this')) {
    const product = PRODUCTS.find(p =>
      lower.includes(p.name.toLowerCase()) ||
      lower.includes(p.slug) ||
      p.tags.some(t => lower.includes(t))
    )
    if (product && product.inStock) {
      // Create a compatible Product type for the cart store
      const mappedProduct = {
        _id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.comparePrice || undefined,
        images: ['/placeholder.png'], // Add proper mapping if available
        category: product.category,
        subCategory: product.category,
        tags: product.tags,
        stock: 10, // Assuming inStock means available
        sku: product.slug,
        status: 'active',
        featured: product.isBestSeller,
        isNew: product.isNew
      } as unknown as Product

      addItem(mappedProduct)
      return {
        role: 'bot',
        text: `Added ${product.name} to your cart! 🛍️\n\nPKR ${product.price.toLocaleString()}${product.comparePrice ? ` (was PKR ${product.comparePrice.toLocaleString()})` : ''}\n\n${product.description}`,
        type: 'quick_replies',
        quickReplies: ['View cart', 'Checkout now', 'Continue shopping'],
      }
    }
    if (product && !product.inStock) {
      return { role: 'bot', text: `${product.name} is currently out of stock 😔\n\nFollow @nuura.pk on Instagram to be notified when it's back!`, type: 'quick_replies', quickReplies: ['Show available products'] }
    }
  }

  // ── Clear cart ─────────────────────────────────────────────────
  if (lower.includes('clear cart') || lower.includes('empty cart') || lower.includes('remove all')) {
    clearCart()
    return { role: 'bot', text: "Cart cleared! Fresh start 🌿 What would you like to add?", type: 'quick_replies', quickReplies: ['Show all products', 'Best sellers'] }
  }

  // ── Checkout ───────────────────────────────────────────────────
  if (lower.includes('checkout') || lower.includes('check out') || lower.includes('proceed')) {
    if (cart.items.length === 0) return { role: 'bot', text: "Your cart is empty! Add some products first 🛍️", type: 'quick_replies', quickReplies: ['Show all products'] }
    return { role: 'bot', text: `Ready to checkout! 🎉\n\nYou have ${cart.items.length} item(s) totaling PKR ${cart.items.reduce((s, i) => s + i.product.price * i.quantity, 0).toLocaleString()}\n\nClick the button below to complete your order with Cash on Delivery, JazzCash, or EasyPaisa.`, type: 'quick_replies', quickReplies: ['Go to checkout →'] }
  }

  // ── Product search ─────────────────────────────────────────────
  const searchTriggers = ['show', 'find', 'search', 'looking for', 'need', 'want', 'recommend', 'suggest', 'what do you have', 'products', 'self-care', 'accessor', 'bag', 'skincare', 'gua sha', 'jade', 'mirror', 'steamer', 'roller', 'clutch']
  const isProductSearch = searchTriggers.some(t => lower.includes(t)) || extractPrice(lower)

  if (isProductSearch) {
    const results = findProducts(lower)
    if (results.length > 0) {
      const priceFilter = extractPrice(lower)
      let intro = `Found ${results.length} product${results.length > 1 ? 's' : ''} for you! ✨`
      if (priceFilter) intro = `Here are products ${priceFilter.max < 99999 ? `under PKR ${priceFilter.max.toLocaleString()}` : `over PKR ${priceFilter.min.toLocaleString()}`}:`
      return { role: 'bot', text: intro, type: 'products', products: results }
    }
    return { role: 'bot', text: "No products match that search 🔍\n\nTry: 'show skincare products', 'bags under PKR 3,500', or 'best sellers'", type: 'quick_replies', quickReplies: ['Show all products', 'Self-care products', 'Accessories', 'Best sellers'] }
  }

  // ── Specific product info ──────────────────────────────────────
  const mentionedProduct = PRODUCTS.find(p =>
    lower.includes(p.name.toLowerCase()) ||
    p.tags.some(t => lower.includes(t))
  )
  if (mentionedProduct) {
    const disc = mentionedProduct.comparePrice ? Math.round((1 - mentionedProduct.price / mentionedProduct.comparePrice) * 100) : 0
    return {
      role: 'bot',
      text: `**${mentionedProduct.name}**\n${mentionedProduct.tagline}\n\nPKR ${mentionedProduct.price.toLocaleString()}${mentionedProduct.comparePrice ? ` ~~PKR ${mentionedProduct.comparePrice.toLocaleString()}~~ (-${disc}%)` : ''}\n\n${mentionedProduct.description}\n\n${mentionedProduct.inStock ? '✅ In Stock' : '❌ Out of Stock'}`,
      type: 'products',
      products: [mentionedProduct],
    }
  }

  // ── Coupon / discount ──────────────────────────────────────────
  if (lower.includes('coupon') || lower.includes('discount') || lower.includes('promo') || lower.includes('code') || lower.includes('offer')) {
    return { role: 'bot', text: "🎁 Current offers:\n\n• **NUURA10** — 10% off your first order\n• **GLOW5** — PKR 500 off orders above PKR 5,000\n• Free shipping on all orders over PKR 5,000!\n\nApply your code at checkout 💫", type: 'quick_replies', quickReplies: ['Show all products', 'Go to checkout'] }
  }

  // ── Shipping ───────────────────────────────────────────────────
  if (lower.includes('ship') || lower.includes('deliver') || lower.includes('how long') || lower.includes('when will')) {
    return { role: 'bot', text: "📦 Shipping Info:\n\n• Lahore, Karachi, Islamabad: 2-3 days\n• Other cities: 3-5 days\n• Free shipping on orders over PKR 5,000\n• Standard: PKR 150-300 by city\n\nWe use TCS and Leopard Couriers for safe delivery 🚚", type: 'quick_replies', quickReplies: ['Track my order', 'COD available?', 'Payment options'] }
  }

  // ── Payment ────────────────────────────────────────────────────
  if (lower.includes('payment') || lower.includes('pay') || lower.includes('cod') || lower.includes('jazzcash') || lower.includes('easypaisa') || lower.includes('how to order')) {
    return { role: 'bot', text: "💳 Payment Options:\n\n• 💵 Cash on Delivery (most popular!)\n• 📱 JazzCash\n• 📱 EasyPaisa\n• 📱 NayaPay\n\nFor digital payments: transfer the amount, then WhatsApp us your screenshot. Confirmed within 1-2 hours! 🇵🇰", type: 'quick_replies', quickReplies: ['Place an order', 'Shipping info', 'Return policy'] }
  }

  // ── Returns ────────────────────────────────────────────────────
  if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange') || lower.includes('policy')) {
    return { role: 'bot', text: "↩️ Return Policy:\n\n• 7-day hassle-free returns\n• Item must be unused in original packaging\n• Damaged item? WhatsApp us a photo within 24 hours\n• Refunds processed in 3-5 business days\n• We replace damaged items immediately at no cost 💚", type: 'quick_replies', quickReplies: ['Contact support', 'Track my order'] }
  }

  // ── Skincare advice ────────────────────────────────────────────
  if (lower.includes('routine') || lower.includes('skincare') || lower.includes('skin care') || lower.includes('advice') || lower.includes('how to use')) {
    return {
      role: 'bot',
      text: "🌿 Morning Ritual (Nuura Edition):\n\n1. Cleanse\n2. Toner\n3. Serum\n4. Facial Oil → Gua Sha (sculpt outward!)\n5. Moisturizer\n6. SPF ☀️\n\nNight: Add Jade Roller after moisturizer. Steam 2-3x/week before serums — doubles absorption!\n\nConsistency is everything ✨",
      type: 'quick_replies',
      quickReplies: ['Show self-care products', 'Gua sha tips', 'Best for puffiness'],
    }
  }

  if (lower.includes('puffy') || lower.includes('puffiness') || lower.includes('swollen')) {
    return { role: 'bot', text: "For puffiness: 🧊\n\nStore your Jade Roller in the fridge overnight. Use the small end under eyes, large end on cheeks — always sweep outward toward ears. This drains lymphatic fluid.\n\n10 minutes = visible difference! Best done first thing in the morning 🌅", type: 'products', products: PRODUCTS.filter(p => p.slug === 'jade-face-roller') }
  }

  if (lower.includes('dark circle') || lower.includes('under eye')) {
    return { role: 'bot', text: "For dark circles 👁️\n\nThe small end of the Jade Roller is perfect for under-eye area. Keep it cold, use gentle upward pressure. Consistent use over 2-3 weeks makes a real difference!\n\nAlso: stay hydrated and get sleep 😴", type: 'products', products: PRODUCTS.filter(p => p.slug === 'jade-face-roller') }
  }

  if (lower.includes('acne') || lower.includes('pimple') || lower.includes('breakout')) {
    return { role: 'bot', text: "For acne-prone skin 🌿\n\nThe Facial Steamer is excellent — it deep cleanses pores without harsh chemicals. Use 2-3x weekly.\n\nAvoid Gua Sha on active breakouts — wait for skin to calm. Start with the Jade Roller once inflammation reduces.", type: 'products', products: PRODUCTS.filter(p => p.slug === 'facial-steamer') }
  }

  // ── Contact ────────────────────────────────────────────────────
  if (lower.includes('contact') || lower.includes('whatsapp') || lower.includes('support') || lower.includes('help') || lower.includes('human')) {
    return { role: 'bot', text: "📞 Contact Nuura:\n\n• WhatsApp: Your number here\n• Instagram: @nuura.pk\n• Response time: Under 2 hours\n• Hours: 10am–8pm daily 🇵🇰\n\nFor payment screenshots, WhatsApp is fastest!", type: 'quick_replies', quickReplies: ['Track my order', 'Return policy', 'Payment options'] }
  }

  // ── Goodbye ────────────────────────────────────────────────────
  if (/^(bye|goodbye|thanks|thank you|shukriya|ok done|finished)/.test(lower)) {
    return { role: 'bot', text: "You're welcome! Glow on ✨🌿\n\nFollow @nuura.pk for new drops and beauty tips. Come back anytime!", type: 'quick_replies', quickReplies: ['Browse products', 'Track my order'] }
  }

  // ── Default ────────────────────────────────────────────────────
  return {
    role: 'bot',
    text: "I can help you with:\n\n🔍 Finding products\n🛒 Adding to cart\n📦 Tracking orders\n💳 Payment info\n🚚 Shipping details\n↩️ Returns\n✨ Skincare tips\n\nWhat would you like?",
    type: 'quick_replies',
    quickReplies: ['Show all products', 'Track my order', 'View cart', 'Skincare advice'],
  }
}

// ── Product Card in chat ──────────────────────────────────────────
function ChatProductCard({ product, onAdd }: { product: typeof PRODUCTS[0]; onAdd: (p: typeof PRODUCTS[0]) => void }) {
  const disc = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
      <div style={{ background: product.category === 'self-care' ? '#F0EBE4' : '#EBF0F5', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'rgba(27,46,31,0.15)' }}>✦</span>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: C.ink, margin: '0 0 2px', lineHeight: 1.2 }}>{product.name}</p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: C.muted, margin: '0 0 8px' }}>{product.tagline}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: C.forest, fontWeight: 600 }}>PKR {product.price.toLocaleString()}</span>
            {product.comparePrice && (
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: C.muted, textDecoration: 'line-through', marginLeft: '6px' }}>PKR {product.comparePrice.toLocaleString()}</span>
            )}
            {disc > 0 && <span style={{ background: 'rgba(27,46,31,0.08)', color: C.forest, fontSize: '10px', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>-{disc}%</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          <a href={`/product/${product.slug}`}
            style={{ flex: 1, padding: '7px', border: `1px solid ${C.border}`, background: 'transparent', color: C.ink, fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, textDecoration: 'none', textAlign: 'center' as const, display: 'block', transition: 'all 200ms' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.forest }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.border }}>
            View
          </a>
          <button onClick={() => onAdd(product)}
            style={{ flex: 2, padding: '7px', background: C.forest, color: C.cream, border: 'none', fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'background 200ms' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = C.gold; (e.currentTarget as HTMLButtonElement).style.color = C.forest }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.forest; (e.currentTarget as HTMLButtonElement).style.color = C.cream }}>
            Add to Cart +
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Order tracker ─────────────────────────────────────────────────
function OrderTracker({ order }: { order: typeof MOCK_ORDERS[string] & { number: string } }) {
  const steps = ['confirmed', 'processing', 'shipped', 'delivered']
  const currentStep = steps.indexOf(order.status)
  const statusInfo = STATUS_LABELS[order.status] || { label: order.status, color: C.muted, icon: '📦' }

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '14px', marginTop: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: C.muted, margin: '0 0 2px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Order #{order.number}</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: C.ink, margin: 0 }}>{order.items.join(', ')}</p>
        </div>
        <span style={{ padding: '4px 10px', background: `${statusInfo.color}15`, color: statusInfo.color, fontFamily: 'var(--font-sans)', fontSize: '11px', borderRadius: '20px', whiteSpace: 'nowrap' as const }}>
          {statusInfo.icon} {statusInfo.label}
        </span>
      </div>

      {/* Timeline */}
      {order.status !== 'pending_verification' && order.status !== 'cancelled' && (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {steps.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: i <= currentStep ? C.forest : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 300ms' }}>
                <span style={{ fontSize: '10px' }}>{i < currentStep ? '✓' : i === currentStep ? '●' : '○'}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: '2px', background: i < currentStep ? C.forest : C.border, margin: '0 2px', transition: 'background 300ms' }} />
              )}
            </div>
          ))}
        </div>
      )}

      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: C.muted, margin: '10px 0 0' }}>
        📅 ETA: {order.eta}
      </p>
    </div>
  )
}

// ── Main chatbot component ────────────────────────────────────────
// DEPRECATED: Use CustomChat from @/components/shared/CustomChat instead
// This component is disabled to prevent duplicate chat button
export function NuuraChatbot_DISABLED() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [cartBump, setCartBump] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cartStore = useCartStore()

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{
        role: 'bot',
        text: "Hi! I'm Noor, your Nuura beauty assistant ✨\n\nI can help you find products, track orders, manage your cart, and give skincare advice. What would you like to do?",
        type: 'quick_replies',
        quickReplies: ['Show all products', 'Best sellers', 'Track my order', 'Skincare advice'],
      }])
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  const addToCart = useCallback((product: typeof PRODUCTS[0]) => {
    // mapped product
    const mappedProduct = {
      _id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compareAtPrice: product.comparePrice || undefined,
      images: ['/placeholder.png'],
      category: product.category,
      subCategory: product.category,
      tags: product.tags,
      stock: 10,
      sku: product.slug,
      status: 'active',
      featured: product.isBestSeller,
      isNew: product.isNew
    } as unknown as Product

    cartStore.addItem(mappedProduct)
    
    setCartBump(true)
    setTimeout(() => setCartBump(false), 600)
    setMsgs(prev => [...prev, {
      role: 'bot',
      text: `Added ${product.name} to your cart! 🛍️`,
      type: 'quick_replies',
      quickReplies: ['View cart', 'Checkout now', 'Continue shopping'],
    }])
  }, [cartStore])

  // Call Gemini API for unmatched queries
  const callChatAPI = useCallback(async (
    userMessage: string,
    history: Msg[]
  ): Promise<string | null> => {
    try {
      const messages = history.slice(-4).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
      messages.push({ role: 'user', content: userMessage })

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      })
      if (!response.ok) return null
      const data = await response.json()
      return data.response ?? null
    } catch {
      return null
    }
  }, [])

  const send = useCallback(async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || typing) return
    setInput('')

    const userMsg: Msg = { role: 'user', text: msg }
    setMsgs(prev => [...prev, userMsg])
    setTyping(true)

    const delay = 600 + Math.random() * 700
    setTimeout(async () => {
      const response = processMessage(msg, { items: cartStore.items }, cartStore.addItem, cartStore.removeItem, cartStore.clearCart)

      // Handle checkout navigation
      if (msg.toLowerCase().includes('go to checkout') || msg === 'Go to checkout →') {
        window.location.href = '/checkout'
        setTyping(false)
        return
      }

      // Handle cart bump for add actions
      if (response.type === 'quick_replies' && response.text.includes('Added')) {
        setCartBump(true)
        setTimeout(() => setCartBump(false), 600)
      }

      // If it's default response, try API
      let finalResponse = response
      if (response.type === 'quick_replies' && response.text.includes('I can help you with:')) {
        const apiResponse = await callChatAPI(msg, [...msgs, userMsg])
        if (apiResponse) {
          finalResponse = { role: 'bot', text: apiResponse, type: 'text' }
        }
      }

      setMsgs(prev => [...prev, finalResponse])
      setTyping(false)
    }, delay)
  }, [input, typing, cartStore, msgs, callChatAPI])

  const cartTotal = cartStore.totalItems()

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: 'fixed', bottom: '5.5rem', right: '1.5rem',
              width: 'min(400px, calc(100vw - 3rem))', height: '580px',
              background: C.white, border: `1px solid ${C.border}`,
              boxShadow: '0 32px 80px rgba(11,26,15,0.18)',
              zIndex: 89, display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ background: C.forest, padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={16} color={C.gold} strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-accent)', fontSize: '18px', letterSpacing: '0.15em', color: C.cream, margin: 0, textTransform: 'uppercase', lineHeight: 1 }}>Noor</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF50', display: 'block' }} />
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'rgba(212,168,83,0.8)', margin: 0 }}>Beauty Assistant · Online</p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Cart indicator */}
                {cartTotal > 0 && (
                  <motion.div
                    animate={cartBump ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212,168,83,0.15)', padding: '5px 10px', borderRadius: '20px', cursor: 'pointer' }}
                    onClick={() => send('view cart')}
                  >
                    <ShoppingBag size={13} color={C.gold} strokeWidth={1.5} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: C.gold, fontWeight: 600 }}>{cartTotal}</span>
                  </motion.div>
                )}
                <button onClick={() => setOpen(false)}
                  style={{ color: 'rgba(245,240,230,0.4)', background: 'transparent', border: 0, cursor: 'pointer', transition: 'color 200ms', padding: '4px' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = C.cream }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,230,0.4)' }}>
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {msgs.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  {/* Message bubble */}
                  <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '8px' }}>
                    {msg.role === 'bot' && (
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: C.forest, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'flex-end' }}>
                        <Sparkles size={12} color={C.gold} strokeWidth={1.5} />
                      </div>
                    )}
                    <div style={{
                      maxWidth: '82%', padding: '10px 14px',
                      background: msg.role === 'user' ? C.forest : C.offwhite,
                      color: msg.role === 'user' ? C.cream : C.ink,
                      fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.65,
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      whiteSpace: 'pre-wrap' as const,
                    }}>
                      {msg.text}
                    </div>
                  </div>

                  {/* Product cards */}
                  {msg.type === 'products' && msg.products && (
                    <div style={{ marginLeft: '36px', marginTop: '8px' }}>
                      {msg.products.map(p => (
                        <ChatProductCard key={p.id} product={p} onAdd={addToCart} />
                      ))}
                    </div>
                  )}

                  {/* Order tracker */}
                  {msg.type === 'order' && msg.order && (
                    <div style={{ marginLeft: '36px', marginTop: '4px' }}>
                      <OrderTracker order={msg.order} />
                    </div>
                  )}

                  {/* Quick replies */}
                  {msg.type === 'quick_replies' && msg.quickReplies && msg.role === 'bot' && (
                    <div style={{ marginLeft: '36px', marginTop: '8px', display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                      {msg.quickReplies.map((qr, qi) => (
                        <button key={qi} onClick={() => send(qr)}
                          style={{ padding: '6px 14px', border: `1px solid ${C.border}`, background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: '12px', color: C.ink, cursor: 'pointer', borderRadius: '20px', transition: 'all 200ms', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.gold; (e.currentTarget as HTMLButtonElement).style.color = C.forest; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,168,83,0.05)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.color = C.ink; (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}>
                          {qr} <ChevronRight size={12} strokeWidth={1.5} />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: C.forest, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={12} color={C.gold} strokeWidth={1.5} />
                  </div>
                  <div style={{ padding: '12px 16px', background: C.offwhite, borderRadius: '18px 18px 18px 4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0, 1, 2].map(j => (
                      <motion.div key={j} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, delay: j * 0.15, repeat: Infinity }}
                        style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.muted }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '0.875rem 1.25rem', borderTop: `1px solid ${C.border}`, display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0, background: C.white }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') send() }}
                placeholder="Search products, track order, ask anything..."
                style={{ flex: 1, border: `1px solid ${C.border}`, padding: '10px 16px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: C.ink, background: 'transparent', outline: 'none', borderRadius: '24px', transition: 'border-color 200ms' }}
                onFocus={e => { e.currentTarget.style.borderColor = C.gold }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border }}
              />
              <button onClick={() => send()}
                style={{ width: '42px', height: '42px', borderRadius: '50%', background: input.trim() ? C.forest : C.border, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', flexShrink: 0, transition: 'all 200ms' }}
                onMouseEnter={e => { if (input.trim()) (e.currentTarget as HTMLButtonElement).style.background = C.gold }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = input.trim() ? C.forest : C.border }}>
                <Send size={16} color={input.trim() ? C.cream : C.white} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        data-cursor="hover"
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', width: '58px', height: '58px', borderRadius: '50%', background: C.forest, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 90, boxShadow: '0 8px 32px rgba(11,26,15,0.3)' }}
      >
        {/* Cart badge on toggle */}
        <AnimatePresence>
          {cartTotal > 0 && !open && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', borderRadius: '50%', background: C.gold, color: C.forest, fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartTotal}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={22} color={C.gold} strokeWidth={1.5} /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><MessageCircle size={22} color={C.gold} strokeWidth={1.5} /></motion.div>
          }
        </AnimatePresence>
      </motion.button>
    </>
  )
}
