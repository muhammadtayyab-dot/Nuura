import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(req: Request) {
  try {
    const { message, products } = await req.json()
    const lowerMsg = message.toLowerCase()

    // 1. Order Tracking Pipeline
    const orderMatch = message.match(/NR-\d{6}-\d{4}/i)
    if (orderMatch) {
      await connectDB()
      const order = await Order.findOne({ orderNumber: orderMatch[0].toUpperCase() }).lean()
      if (order) {
        return NextResponse.json({ 
          intent: 'order_tracking',
          message: `Order **${order.orderNumber}** Status:\n\nStatus: **${(order.orderStatus as string).toUpperCase()}**\nTotal: PKR ${order.total}\nPayment: ${(order.paymentStatus as string).toUpperCase()}`,
          data: null
        })
      }
      return NextResponse.json({ 
        intent: 'order_tracking', 
        message: `I couldn't find an order with number ${orderMatch[0]}. Please check the number and try again.` 
      })
    }
    
    if (lowerMsg.includes('track') || lowerMsg.includes('where is my order') || lowerMsg.includes('status')) {
      return NextResponse.json({
        intent: 'prompt_order_id',
        message: "I can instantly track your order! Please type your order number (e.g., NR-250101-1234)."
      })
    }

    // 2. Cart Assistance (Add to Cart logic)
    if (lowerMsg.includes('add') || lowerMsg.includes('buy') || lowerMsg.includes('cart')) {
       // Look for a product name match in the message
       const matchedProduct = products?.find((p: any) => lowerMsg.includes(p.name.toLowerCase().split(' ')[0]))
       if (matchedProduct) {
         return NextResponse.json({
            intent: 'add_to_cart',
            message: `I found the **${matchedProduct.name}**! Want me to add it directly to your cart?`,
            data: [matchedProduct]
         })
       }
       return NextResponse.json({
            intent: 'cart_general',
            message: "I can add items to your cart for you! Just say 'add [product name] to cart'."
       })
    }

    // 3. Product Search & Discovery
    if (lowerMsg.includes('under') || lowerMsg.includes('price') || lowerMsg.includes('cheap')) {
      const priceMatch = message.match(/\d+/)
      if (priceMatch && products) {
        const budget = parseInt(priceMatch[0])
        const affordable = products.filter((p: any) => p.price <= budget)
        if (affordable.length > 0) {
          return NextResponse.json({
            intent: 'product_search',
            message: `Here are our best products under PKR ${budget}:`,
            data: affordable.slice(0, 2)
          })
        }
      }
    }

    if (lowerMsg.includes('search') || lowerMsg.includes('find') || lowerMsg.includes('show me') || lowerMsg.includes('looking for')) {
      const keywords = lowerMsg.replace(/(search|find|show me|looking for|a|the|some)/g, '').trim().split(' ').filter((k: string) => k.length > 2)
      
      let matched = []
      if (keywords.length > 0) {
        matched = products?.filter((p: any) => keywords.some((k: string) => p.name.toLowerCase().includes(k) || p.tags?.includes(k))) || []
      }
      
      if (matched && matched.length > 0) {
         return NextResponse.json({
            intent: 'product_search',
            message: `I found these products matching your search:`,
            data: matched.slice(0, 2)
         })
      }
    }

    // 4. Recommendation Engine
    if (lowerMsg.includes('recommend') || lowerMsg.includes('trending') || lowerMsg.includes('popular') || lowerMsg.includes('best') || lowerMsg.includes('suggest')) {
      const trending = products?.filter((p: any) => p.isFeatured || p.isBestSeller) || products
      return NextResponse.json({
         intent: 'recommendation',
         message: "Based on what our current customers love, here are the top trending glow items:",
         data: trending.slice(0, 2)
      })
    }

    // 5. FAQ Automation
    if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery')) {
      return NextResponse.json({ intent: 'faq', message: "We offer Nationwide shipping across Pakistan! Orders typically take 3-5 business days to arrive." })
    }
    if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
      return NextResponse.json({ intent: 'faq', message: "You can return any sealed/unused products within 7 days. If a product arrives damaged, we'll replace it for free!" })
    }
    if (lowerMsg.includes('payment') || lowerMsg.includes('cod') || lowerMsg.includes('card')) {
      return NextResponse.json({ intent: 'faq', message: "We primarily accept Cash on Delivery (COD) for your convenience, as well as digital payments like JazzCash, Nayapay, and Stripe." })
    }
    if (lowerMsg.includes('coupon') || lowerMsg.includes('discount') || lowerMsg.includes('promo')) {
      return NextResponse.json({ intent: 'faq', message: "Use the code GLOWUP10 at checkout for 10% off your first order! ??" })
    }

    // Custom Greeting for own bot
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('salam')) {
       return NextResponse.json({ 
        intent: 'greeting', 
        message: "Hello! I'm your Custom Nuura Assistant. I can instantly track orders, search products, add items to your cart, or answer FAQs. What can I help you with?" 
      })
    }

    // Fallback
    return NextResponse.json({ 
      intent: 'fallback',
      message: "I am Nuura's Custom Native AI! Try asking me to:\n- 'Track order NR-25...'\n- 'Recommend trending products'\n- 'Show me items under 3000'\n- 'Add Jade Roller to cart'"
    })

  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ error: 'Failed to process custom chat logic' }, { status: 500 })
  }
}
