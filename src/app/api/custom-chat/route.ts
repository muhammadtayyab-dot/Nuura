import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import Order from '@/models/Order'

// Simulated smart suggestions for discovery
const SMART_SUGGESTIONS = [
  "Show me best sellers",
  "Any self-care items under 3000?",
  "Track my order",
  "Recommend accessories"
]

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = body.message || ''
    const lowerMsg = message.toLowerCase()

    await connectDB()

    // 5. FAQ Automation
    if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery')) {
      return NextResponse.json({
        response: 'We offer free delivery nationwide across Pakistan. Standard shipping takes 3-5 business days. Would you like to see some products?'
      })
    }
    if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
      return NextResponse.json({
        response: 'We have a 7-day return policy. If the product is sealed and unused, you can return it for a full refund.'
      })
    }
    if (lowerMsg.includes('payment') || lowerMsg.includes('cod')) {
      return NextResponse.json({
        response: 'We accept Cash on Delivery (COD), Stripe, and bank transfers like JazzCash and EasyPaisa.'
      })
    }

    // 3. Order Tracking + Timeline
    const orderMatch = lowerMsg.match(/nr-\d{6}-\d{4}/i)
    if (orderMatch || lowerMsg.includes('track') || lowerMsg.includes('where is my order')) {
      if (orderMatch) {
         const orderId = orderMatch[0].toUpperCase()
         const order = await Order.findOne({ orderNumber: orderId })
         if (order) {
           // Simulate a tracking timeline based on current status
           const statuses = ['pending', 'processing', 'shipped', 'delivered']
           const currentIndex = statuses.indexOf(order.orderStatus) >= 0 ? statuses.indexOf(order.orderStatus) : 0

           const timeline = statuses.map((state, idx) => {
             if (idx < currentIndex) return `? ${state.toUpperCase()}`
             if (idx === currentIndex) return `? CURRENT: ${state.toUpperCase()}`
             return `? ${state.toUpperCase()}`
           }).join('\n')

           return NextResponse.json({
             response: `?? **Tracking Timeline for ${orderId}**\n\n${timeline}\n\nTotal: PKR ${order.total} | Payment: ${order.paymentStatus}`
           })
         } else {
           return NextResponse.json({
             response: `I couldn't find an order with the tracking number ${orderId}. Please double-check the number.`
           })
         }
      }
      return NextResponse.json({
        response: 'To fetch real-time order status and tracking timeline, please provide your exact order number (e.g., NR-240404-1234).'
      })
    }

    // 4. Cart & Checkout Assistance + Coupons
    if (lowerMsg.includes('checkout') || lowerMsg.match(/open.*cart/i)) {
      return NextResponse.json({
        response: 'Opening your cart now! You can proceed to checkout from there.',
        action: { type: 'OPEN_CART' }
      })
    }
    if (lowerMsg.includes('coupon') || lowerMsg.includes('discount') || lowerMsg.includes('promo')) {
      return NextResponse.json({
        response: '??? You can apply coupon code **GLOW10** at checkout for 10% off your entire order.'
      })
    }

    // Cart Removal support
    const removeMatch = lowerMsg.match(/remove ([\w\s]+)/i)
    if (removeMatch && lowerMsg.includes('cart') && !lowerMsg.includes('add')) {
      const keyword = removeMatch[1].replace('from', '').replace('cart', '').trim()
      return NextResponse.json({
        response: `To remove "${keyword}", just open your cart and click the trash icon next to the item.`,
        action: { type: 'OPEN_CART' }
      })
    }

    // Cart Add support
    const addMatch = lowerMsg.match(/add ([\w\s]+) to/i) || lowerMsg.match(/add ([\w\s]+)/i)
    if (addMatch && !lowerMsg.includes('cart')) {
      const kw = addMatch[1].trim()
      if (kw.length > 3) {
         const products = await Product.find({ name: { $regex: kw, $options: 'i' } }).lean()
         if (products.length > 0) {
            const p = products[0]
            return NextResponse.json({
              response: `Great choice! Adding the **${p.name}** (PKR ${p.price}) to your cart...`,
              action: { type: 'ADD_TO_CART', product: p }
            })
         }
      }
    }

    // 2. Product Recommendation Engine
    if (lowerMsg.includes('recommend') || lowerMsg.includes('bought') || lowerMsg.includes('trending')) {
      // Simulate "Customers also bought" or trending AI logic
      const products = await Product.find({ inStock: true }).sort({ isBestSeller: -1, createdAt: -1 }).limit(3).lean()
      if (products.length > 0) {
         return NextResponse.json({
           response: `? **Trending & "Customers Also Bought" Recommendations**:\n\n` +
                     products.map((p: any) => `- ${p.name} (PKR ${p.price})`).join('\n') +
                     `\n\nTell me to "Add [Product]" if you want any of these!`,
           suggestions: SMART_SUGGESTIONS
         })
      }
    }

    // 1. Product Discovery & Search (Natural Language Search + Filters)
    // Extract price constraints ("under X")
    let maxPrice = Number.MAX_SAFE_INTEGER
    const priceMatch = lowerMsg.match(/under (\d+)/i)
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1])
    }

    // Extract Category Filters
    let categoryFilter = null
    if (lowerMsg.includes('self-care') || lowerMsg.includes('care') || lowerMsg.includes('gua sha') || lowerMsg.includes('roller')) {
      categoryFilter = 'self-care'
    } else if (lowerMsg.includes('accessories') || lowerMsg.includes('bag') || lowerMsg.includes('clutch')) {
      categoryFilter = 'accessories'
    }

    // Execute Natural Language Search if looking for products
    if (lowerMsg.includes('show') || lowerMsg.includes('find') || lowerMsg.includes('search') || priceMatch || categoryFilter) {
      let query: any = { price: { $lte: maxPrice }, inStock: true }
      if (categoryFilter) query.category = categoryFilter

      const products = await Product.find(query).limit(4).lean()

      if (products.length > 0) {
        return NextResponse.json({
           response: `?? I found these results matching your search criteria:\n\n` +
                     products.map((p: any) => `- **${p.name}** - PKR ${p.price}`).join('\n') +
                     `\n\nWant to refine your search? Try asking for a specific category or price limit!`,
           suggestions: SMART_SUGGESTIONS
        })
      } else {
        return NextResponse.json({
           response: `Sorry, I couldn't find any products matching those exact filters. Try relaxing the price or looking in a different category!`,
           suggestions: SMART_SUGGESTIONS
        })
      }
    }

    // Default Fallback
    return NextResponse.json({
      response: "?? Hi! I'm Nuura's Custom AI Engine. \n\nI can:\n- Recommend trending products\n- Fetch real-time order tracking timelines\n- Manage your cart\n- Give smart product suggestions.\n\nHow can I assist you today?",
      suggestions: SMART_SUGGESTIONS
    })

  } catch (error) {
    console.error("Custom Chat API Error:", error)
    return NextResponse.json({ error: 'Failed to process custom AI request' }, { status: 500 })
  }
}
