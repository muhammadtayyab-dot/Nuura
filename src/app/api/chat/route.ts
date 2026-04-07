import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message, products } = await req.json()

    // 1. Validate Token
    const API_KEY = process.env.GEMINI_API_KEY
    if (!API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    // 2. Build Prompt
    const systemInstruction = `You are Nuura's AI glow advisor for a Pakistani self-care brand.

CURRENT PRODUCT CATALOG (live data):
${products && products.length > 0 ? products.map((p: any) =>
  `- ${p.name}: PKR ${p.price} ${p.comparePrice ? '(was PKR ' + p.comparePrice + ')' : ''}
  - ${p.description} ${p.isNewDrop ? '[NEW]' : ''}
  ${p.inStock === false ? '[OUT OF STOCK]' : ''}`
).join('\n') : 'No products available currently.'}

STORE RULES:
- Always mention actual PKR prices from the catalog above
- If a product is out of stock, say so and suggest alternatives
- If asked about a product not in the catalog, say it is not currently available and suggest what drop season to watch for
- New drops happen every season with limited quantities
- All orders via Cash on Delivery nationwide in Pakistan
- If the catalog failed to load, say: "Let me check our latest drops for you - please visit nuura-temp.vercel.app/shop for live inventory"

PERSONALITY:
- Warm, elegant, minimal - like the brand itself
- Short responses (max 3 sentences)
- If user writes in Urdu, reply in Urdu
- If user writes in Roman Urdu, reply in Roman Urdu
- Never make up products or prices
- If unsure about anything, say "I am not sure - please check our shop page or DM us on Instagram for help"`

    // 3. Call Gemini REST API
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7,
        }
      })
    })

    if (!response.ok) {
        const errortext = await response.text()
        console.error("Gemini API Error:", errortext)
        return NextResponse.json({ error: 'Gemini API failed' }, { status: response.status || 500 })
    }

    const data = await response.json()

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am not sure - please check our shop page or DM us on Instagram for help"

    return NextResponse.json({ response: generatedText.trim() })

  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}
