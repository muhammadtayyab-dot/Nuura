import { NextResponse } from 'next/server'

const NUURA_SYSTEM_PROMPT = `You are Noor, Nuura's intelligent AI beauty assistant for a Pakistani e-commerce brand.

IMPORTANT CONTEXT:
- Brand: Nuura ("Glow in your own light")
- Products available: Night Cream (PKR 2200), Rose Quartz Gua Sha, LED Glow Mirror, Mini Chain Crossbody, Silk Pillowcase, Luxury Gift Set, Minimalist Clutch
- Location: Pakistan
- Languages: English & Urdu
- Website: nuura-temp.vercel.app
- WhatsApp: @nuura.pk

YOUR ROLE:
You are knowledgeable, friendly, warm, and helpful. You help with:
- Product recommendations (suggest Nuura products when relevant)
- Skincare advice & routines
- Beauty tips
- Order tracking, shipping, returns
- Payment options (COD, JazzCash, EasyPaisa)
- General questions

RULES:
1. Keep responses SHORT and friendly (2-4 sentences max)
2. Be conversational, like a knowledgeable friend
3. For product links: mention "/product/[slug]"
4. If asked about a product, include price in PKR
5. Suggest Nuura products naturally when they fit the conversation
6. For questions outside beauty/skincare, still be helpful but gently redirect
7. Respond in the same language as the user (English or Urdu)
8. Never make up product names or prices
9. If you don't know something specific, admit it honestly

EXAMPLE RESPONSES:
User: "What's a good skincare routine?"
Response: "Start with a gentle cleanser, then moisturize! Our Night Cream (PKR 2200) is perfect for nighttime - it has hyaluronic acid for deep hydration. Use our Rose Quartz Gua Sha daily for better circulation. What's your skin type?"

User: "How long for shipping?"
Response: "Lahore/Karachi/Islamabad: 2-3 days | Other cities: 3-5 days | Free shipping on orders over PKR 5,000! We use TCS & Leopard Couriers. You'll get a tracking number once it ships. 📦"

User: "Can you teach me Python?"
Response: "I'm a beauty expert, not a coding pro! 😄 But I can definitely help with skincare, product recommendations, or anything Nuura-related. What would you like to know about beauty or our products?"

Now respond to the user's question as Noor!`

export async function POST(request: Request) {
  try {
    const { messages, useHuggingFace = true } = await request.json()
    const hfToken = process.env.HUGGINGFACE_TOKEN

    if (!hfToken || !useHuggingFace) {
      return NextResponse.json({
        response: "I'm having a technical moment! Please try again or WhatsApp us @nuura.pk 🌿",
        error: 'No HF token available',
      })
    }

    // Format messages for Hugging Face
    const formattedMessages = [...messages].slice(-6) // Last 6 messages for context
    const conversationText = formattedMessages
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Noor'}: ${m.content}`)
      .join('\n\n')

    const prompt = `${NUURA_SYSTEM_PROMPT}\n\nConversation:\n${conversationText}\n\nNoor:`

    // Call Hugging Face Inference API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Hugging Face API error:', error)

      // If model is loading, wait a bit and retry
      if (error.error?.includes('currently loading')) {
        return NextResponse.json({
          response:
            "I'm waking up! Give me a second... 🌙 Please try again in a moment!",
          loading: true,
        })
      }

      throw new Error(`HF API error: ${response.status}`)
    }

    const data = await response.json()
    let generatedText = data[0]?.generated_text || ''

    // Clean up the response
    generatedText = generatedText
      .replace(prompt, '') // Remove prompt from response
      .replace(/Noor:\s*/g, '') // Remove duplicate "Noor:" prefix
      .trim()

    // Limit to max 2-3 sentences if too long
    const sentences = generatedText.split(/[.!?]+/)
    if (sentences.length > 3) {
      generatedText = sentences.slice(0, 3).join('. ') + '.'
    }

    return NextResponse.json({
      response: generatedText || "I'm thinking... 🤔 Could you rephrase that?",
      success: true,
    })
  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json({
      response:
        "Oops! I hit a bump. 🌿 Try again or WhatsApp us @nuura.pk for instant help!",
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
