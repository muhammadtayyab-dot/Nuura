'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface Message {
  id: string
  role: 'user' | 'ai' | 'system'
  content: string
  isTyping?: boolean
  isColdStart?: boolean
}

export default function CustomChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{
    id: 'sys-welcome',
    role: 'ai',
    content: "Hi! I'm Nuura's Custom AI Agent ??\nI can track your order, recommend products, answer FAQs, and even add items to your cart!"
  }])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Real Cart Integration
  const cartStore = useCartStore()

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Remind abandoned carts functionality (simulate if there's stuff in cart but no activity)
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (cartStore.items.length > 0 && !isOpen) {
      timeout = setTimeout(() => {
         setIsOpen(true)
         setMessages(prev => [...prev, {
           id: Date.now().toString() + 'remind',
           role: 'ai',
           content: "Don't forget! You have items waiting in your cart. Ask me to open checkout when you're ready ??"
         }])
      }, 30000) // Remind after 30 seconds
    }
    return () => clearTimeout(timeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartStore.items.length])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputValue.trim()) return

    const userText = inputValue.trim()
    setInputValue('')

    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userText }
    setMessages(prev => [...prev, newUserMsg])

    const typingId = Date.now().toString() + '-typing'
    setMessages(prev => [...prev, { id: typingId, role: 'ai', content: '', isTyping: true }])

    try {
      const res = await fetch('/api/custom-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      })

      setMessages(prev => prev.filter(m => m.id !== typingId))

      if (!res.ok) throw new Error('API Error')

      const data = await res.json()

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: data.response }])

      // Cart Action Handlers
      if (data.action) {
        setTimeout(() => {
           if (data.action.type === 'ADD_TO_CART' && data.action.product) {
              cartStore.addItem(data.action.product)
              cartStore.openCart()
              setMessages(prev => [...prev, { 
                id: Date.now().toString() + '-sys', 
                role: 'system', 
                content: `??? Added ${data.action.product.name} to cart!` 
              }])
           } else if (data.action.type === 'OPEN_CART') {
              cartStore.openCart()
           }
        }, 1000)
      }

    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== typingId))
      setMessages(prev => [...prev, {
        id: Date.now().toString(), role: 'system',
        content: 'System timeout. Please try again later.'
      }])
    }
  }

  const QUICK_REPLIES = ["Where is my order?", "Recommend a product", "Shipping FAQ", "Add a Gua Sha"]

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', bottom: '4.5rem', right: 0,
              width: 'min(calc(100vw - 2rem), 380px)',
              height: '520px',
              backgroundColor: '#FAFAF8',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden'      
            }}
          >
            {/* Header */}
            <div style={{
              backgroundColor: '#1E3A8A', color: '#F5F0E6', padding: '1.25rem 1.5rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', margin: 0, textTransform: 'uppercase' }}>NUURA INTEGRATED</h3>   
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#60A5FA', margin: 0, lineHeight: 1, paddingTop: '0.25rem' }}>AI AGENT</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 0, color: 'rgba(245,240,230,0.7)', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#FAFAF8' }}>  
              {messages.map((msg) => (
                <div key={msg.id} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : msg.role === 'system' ? 'center' : 'flex-start',
                  maxWidth: '85%',
                  whiteSpace: 'pre-line',
                }}>
                  {msg.role === 'system' ? (
                    <div style={{
                      backgroundColor: 'rgba(96,165,250,0.1)', color: '#1E3A8A', border: '1px solid rgba(96,165,250,0.2)',
                      padding: '0.75rem 1rem', borderRadius: '12px', fontFamily: 'var(--font-sans)', fontSize: '12px', textAlign: 'center'
                    }}>
                      {msg.content}
                    </div>
                  ) : msg.isTyping ? (
                    <div style={{
                      backgroundColor: '#F5F0E6', color: '#6B7B6E',
                      padding: '0.75rem 1.25rem', borderRadius: '18px 18px 18px 4px',
                      fontFamily: 'var(--font-sans)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                      Fetching records...
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: msg.role === 'user' ? '#1E3A8A' : '#F5F0E6',
                      color: msg.role === 'user' ? '#FAFAF8' : '#1A1714',       
                      padding: '0.75rem 1.25rem',
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      fontFamily: 'var(--font-sans)', fontSize: '13.5px', lineHeight: 1.5,
                      border: msg.role === 'ai' ? '1px solid rgba(30,58,138,0.05)' : 'none'
                    }}>
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '1rem', borderTop: '1px solid #E8E0D8', backgroundColor: '#FAFAF8' }}>
              <div className="no-scrollbar" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>    
                {QUICK_REPLIES.map(qr => (
                  <button key={qr} onClick={() => { setInputValue(qr); setTimeout(() => handleSend({ preventDefault: () => {} } as any), 0); }}
                    style={{
                      whiteSpace: 'nowrap', padding: '0.4rem 0.8rem', borderRadius: '20px',
                      border: '1px solid #60A5FA', backgroundColor: 'transparent',
                      color: '#1E3A8A', fontFamily: 'var(--font-sans)', fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {qr}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask for recommendations, track order..."
                  style={{
                    flex: 1, padding: '0.85rem 1rem', borderRadius: '24px',     
                    border: '1px solid #E8E0D8', backgroundColor: '#FFFFFF',    
                    fontFamily: 'var(--font-sans)', fontSize: '13px', outline: 'none',
                    color: '#1A1714'
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  style={{
                    width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                    backgroundColor: '#1E3A8A', color: '#F5F0E6',
                    border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: inputValue.trim() ? 'pointer' : 'not-allowed', opacity: inputValue.trim() ? 1 : 0.4,
                    transition: 'opacity 0.2s'
                  }}
                >
                  <Send size={16} strokeWidth={1.5} style={{ marginLeft: '-2px', marginTop: '2px' }} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px', height: '60px', borderRadius: '50%',
          backgroundColor: '#1E3A8A', color: '#FAFAF8',
          border: '1px solid #1E40AF',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',      
          cursor: 'pointer', transition: 'transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}   
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}      
      >
        {isOpen ? <X size={24} strokeWidth={1.5} /> : <Sparkles size={24} strokeWidth={1.5} color="#FFFFFF" />}
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}} />
    </div>
  )
}
