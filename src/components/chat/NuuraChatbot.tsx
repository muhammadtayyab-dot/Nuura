'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

const C = { forest: '#1B2E1F', cream: '#F5F0E6', gold: '#D4A853', white: '#FAFAF8', offwhite: '#F0EBE3', ink: '#0F1A11', muted: '#6B7B6E', border: '#DDD8CF' }

interface Message { role: 'user' | 'bot'; text: string }

const RESPONSES: Record<string, string> = {
  hello: 'Hello! Welcome to Nuura. I\'m here to help you find your perfect self-care ritual. What can I help you with today?',
  hi: 'Hi there! Welcome to Nuura. How can I help you glow today?',
  hey: 'Hey! So glad you\'re here. Can I help you find something special?',
  salam: 'Wa alaikum assalam! Welcome to Nuura. How can I help you today?',
  assalam: 'Wa alaikum assalam! Welcome to Nuura. How can I help you today?',

  'gua sha': 'Our Rose Quartz Gua Sha (PKR 2,800) is one of our bestsellers! It\'s perfect for sculpting, depuffing, and giving your skin that natural glow. Use it with facial oil in upward strokes every morning for best results.',
  'jade roller': 'The Jade Face Roller (PKR 1,800) is amazing for lymphatic drainage and reducing puffiness. Store it in the fridge for an extra cooling effect. Great for under-eye circles too!',
  'facial steamer': 'Our USB Facial Steamer (PKR 3,800) opens up your pores for deeper cleansing. Use it before applying serums and moisturizers - it dramatically improves absorption. Just 10 minutes, 2-3 times a week.',
  'led mirror': 'The LED Glow Mirror (PKR 4,500) is a game changer! Adjustable brightness, 10x magnification, USB rechargeable. Perfect for flawless makeup application even in low light.',
  crossbody: 'Our Mini Chain Crossbody (PKR 3,200) is a head-turner! Quilted design with gold chain strap. Fits your phone, cards, and lip gloss perfectly. Available in limited quantities.',
  clutch: 'The Acrylic Box Clutch (PKR 2,500) is literally art you carry. Clear acrylic with gold hardware - perfect statement piece for any outfit.',
  bag: 'We have two stunning bag options! The Mini Chain Crossbody (PKR 3,200) for everyday glam, and the Acrylic Box Clutch (PKR 2,500) for evenings. Both are in limited supply!',

  routine: 'A great skincare routine for Pakistani skin: 1) Cleanser, 2) Toner, 3) Serum, 4) Facial oil (use gua sha here!), 5) Moisturizer, 6) SPF (morning). Our gua sha and jade roller work beautifully in steps 4-5!',
  'skin care': 'For glowing skin, consistency is key! Our self-care tools complement any skincare routine. The facial steamer preps your skin, the jade roller depuffs, and the gua sha sculpts. Together they\'re a complete ritual.',
  skincare: 'Great question! Our self-care gadgets work best as part of a consistent routine. Start with the steamer to open pores, then your serums, then gua sha to seal everything in. Your skin will thank you!',
  'glowing skin': 'For that glass-skin glow: 1) Stay hydrated, 2) Use our Jade Roller morning and night, 3) Gua sha 3-4x weekly, 4) Facial steamer before heavy serums. Consistency is everything!',
  'dark circles': 'For dark circles: Keep your Jade Roller in the fridge and use the small end under your eyes every morning. Gentle upward and outward strokes. Game changer!',
  puffiness: 'For puffiness: Cold jade roller first thing in the morning is magic! Also try gua sha - start at the center and sweep outward toward your ears to drain lymphatic fluid.',
  acne: 'For acne-prone skin, the facial steamer is brilliant - it deep cleanses pores. Just don\'t use gua sha on active breakouts. Wait until skin is calm, then introduce the roller gently.',

  delivery: 'We deliver nationwide across Pakistan! COD available in all major cities. Lahore, Karachi, Islamabad: 2-3 days. Other cities: 3-5 days. We also ship internationally - DM us for rates!',
  shipping: 'Free shipping on orders over PKR 5,000! Standard delivery is PKR 150-300 depending on your city. We use TCS and Leopard Couriers for safe delivery.',
  cod: 'Yes! Cash on Delivery is available nationwide. You pay when your order arrives - no upfront risk. We also accept JazzCash, EasyPaisa, and NayaPay.',
  'cash on delivery': 'Absolutely! COD is our most popular payment method. Pay cash when your order arrives. Simple and safe!',
  jazzcash: 'Yes, we accept JazzCash! At checkout, select JazzCash and you\'ll see our account number. Send the payment and WhatsApp us the screenshot to confirm.',
  easypaisa: 'Yes, EasyPaisa works too! Select it at checkout, transfer to our account, and WhatsApp us your screenshot. Your order gets confirmed within 1-2 hours.',
  payment: 'We accept: Cash on Delivery (most popular!), JazzCash, EasyPaisa, NayaPay, and Credit/Debit cards via Stripe. All options available at checkout!',
  'how to order': 'Ordering is easy! 1) Browse our collection, 2) Add to cart, 3) Go to checkout, 4) Enter your details, 5) Choose payment method, 6) Place order! For manual payments, WhatsApp us your screenshot.',

  return: 'We offer 7-day hassle-free returns on unused items in original packaging. Just WhatsApp us with your order number and reason. We\'ll arrange pickup or guide you through the process.',
  refund: 'Refunds are processed within 3-5 business days after we receive the returned item. For COD orders, we refund via JazzCash or EasyPaisa.',
  exchange: 'Yes, exchanges are welcome within 7 days! If you received a damaged item or wrong product, we\'ll replace it immediately at no cost.',
  damaged: 'Oh no! We\'re so sorry about that. Please WhatsApp us your order number and a photo of the damaged item within 24 hours of delivery. We\'ll replace it immediately!',

  price: 'Our products range from PKR 1,800 to PKR 4,500. All prices include GST. Free shipping over PKR 5,000!',
  discount: 'Follow us on Instagram @nuura.pk for exclusive drop announcements and discount codes! We also offer bundle deals - ask me about them.',
  'new arrivals': 'Our latest drops include the Rose Quartz Gua Sha and Mini Chain Crossbody! We drop new products every season in limited quantities. Follow us to never miss a drop!',
  stock: 'Our products are limited! Once they\'re gone, they\'re gone until the next drop. I\'d recommend ordering soon to avoid missing out.',
  authentic: 'Every Nuura product is carefully sourced and quality-checked. We stand behind everything we sell - that\'s why we offer 7-day returns and a quality guarantee.',
  gift: 'Nuura products make the most beautiful gifts! We can arrange gift packaging - just mention it in the order notes. Perfect for birthdays, Eid, or just because.',
  whatsapp: 'You can reach us on WhatsApp for order updates, payment screenshots, or any questions! Our team responds within 2 hours during business hours.',
  contact: 'You can reach Nuura on Instagram @nuura.pk or WhatsApp. We\'re available 10am-8pm daily. Response time is usually under 2 hours!',
  instagram: 'Follow us @nuura.pk on Instagram for new drops, skincare tips, and behind-the-scenes content! We post routines and tutorials using our products.',
  thanks: 'You\'re so welcome! Is there anything else I can help you with?',
  'thank you': 'My pleasure! If you need anything else, I\'m here. Happy shopping!',
  bye: 'Goodbye! Come back soon and glow on!',
}

function getResponse(input: string): string {
  const lower = input.toLowerCase().trim()
  for (const [key, response] of Object.entries(RESPONSES)) {
    if (lower.includes(key)) return response
  }
  if (lower.includes('?')) {
    return 'Great question! For specific queries, please WhatsApp us directly - we respond within 2 hours. Or browse our FAQ page for quick answers. Can I help you with anything else?'
  }
  return 'I\'m not sure about that, but I\'d love to help! You can ask me about our products, shipping, returns, skincare tips, or payment methods. Or WhatsApp us directly for detailed help.'
}

export function NuuraChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! Welcome to Nuura. I\'m Noor, your beauty assistant. Ask me about our products, skincare tips, shipping, or anything else!' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: getResponse(userMsg) }])
      setTyping(false)
    }, 800 + Math.random() * 600)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'fixed', bottom: '6rem', right: '1.5rem', width: 'min(380px, calc(100vw - 3rem))', height: '520px', background: C.white, border: `1px solid ${C.border}`, boxShadow: '0 24px 64px rgba(11,26,15,0.15)', zIndex: 89, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            <div style={{ background: C.forest, padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-accent)', fontSize: '18px', letterSpacing: '0.2em', color: C.cream, margin: 0, textTransform: 'uppercase' }}>Noor</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: C.gold, margin: 0, letterSpacing: '0.1em' }}>Nuura Beauty Assistant</p>
              </div>
              <button onClick={() => setOpen(false)} style={{ color: 'rgba(245,240,230,0.6)', background: 'transparent', border: 0, cursor: 'pointer' }}>
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    background: msg.role === 'user' ? C.forest : C.offwhite,
                    color: msg.role === 'user' ? C.cream : C.ink,
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '4px', padding: '12px 14px', background: '#F0EBE3', width: 'fit-content', borderRadius: '16px 16px 16px 4px' }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.muted }} />
                  ))}
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            <div style={{ padding: '1rem 1.25rem', borderTop: `1px solid ${C.border}`, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') send() }}
                placeholder="Ask about products, shipping..."
                style={{ flex: 1, border: `1px solid ${C.border}`, padding: '10px 14px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: C.ink, background: 'transparent', outline: 'none', borderRadius: '24px' }}
              />
              <button onClick={send} style={{ width: '40px', height: '40px', borderRadius: '50%', background: C.forest, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'background 200ms' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = C.gold }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.forest }}>
                <Send size={16} color={C.cream} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', width: '56px', height: '56px', borderRadius: '50%', background: C.forest, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 90, boxShadow: '0 8px 32px rgba(11,26,15,0.25)' }}
        data-cursor="hover"
      >
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
