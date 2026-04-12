import { NextResponse } from 'next/server'

const NUURA_CONTEXT = `You are Noor, the AI beauty assistant for Nuura — a premium Pakistani women's e-commerce brand.

BRAND: Nuura — "Glow in your own light"
WEBSITE: nuura-temp.vercel.app
INSTAGRAM: @nuura.pk

PRODUCTS:
1. Rose Quartz Gua Sha — PKR 2,800 (was 3,500) — self-care — slug: rose-quartz-gua-sha
   Use: facial sculpting, depuffing, lymphatic drainage. Use upward strokes with facial oil.
   
2. LED Glow Mirror — PKR 4,500 (was 5,500) — self-care — slug: led-glow-mirror
   Use: makeup application, adjustable brightness, 10x magnification, USB rechargeable.
   
3. Mini Chain Crossbody — PKR 3,200 — accessories — slug: mini-chain-crossbody
   Use: daily carry, fits phone + cards + lip gloss, gold chain strap, quilted design.
   
4. Jade Face Roller — PKR 1,800 (was 2,200) — self-care — slug: jade-face-roller
   Use: puffiness, lymphatic drainage, serum absorption. Store in fridge for extra cooling.
   
5. Acrylic Box Clutch — PKR 2,500 — accessories — slug: acrylic-clutch
   Use: evening wear, statement piece, clear acrylic with gold hardware.
   
6. USB Facial Steamer — PKR 3,800 (was 4,500) — self-care — slug: facial-steamer
   Use: deep pore cleansing, before serums, 2-3x weekly. Nano ionic technology.

SHIPPING:
- Lahore/Karachi/Islamabad: 2-3 days
- Other cities: 3-5 days
- Free shipping over PKR 5,000
- Standard: PKR 150-300

PAYMENT: COD (most popular), JazzCash, EasyPaisa, NayaPay
RETURNS: 7-day hassle-free returns
CONTACT: WhatsApp or Instagram @nuura.pk

DISCOUNT CODES: NUURA10 (10% off first order), GLOW5 (PKR 500 off orders over 5,000)

RULES:
- Keep responses SHORT (2-4 sentences max)
- Be warm, friendly, like a knowledgeable friend
- When recommending products, mention the product name and price
- For product links, say: "You can view it at /product/[slug]"
- Respond in the same language as the user (Urdu or English)
- Never make up products or prices that don't exist
- For order tracking, ask for their order number (format: NR-XXXXXX-XXXX)`

const FALLBACK_RESPONSES: Record<string, string> = {
  default: "I'd love to help! Ask me about our products, skincare tips, shipping, or payments. Or type 'show products' to see our collection ✨",
  error: "I'm having a moment! Please try again or WhatsApp us @nuura.pk for instant help 🌿",
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()
    const apiKey = process.env.GEMINI_API_KEY

    // If no API key, return helpful fallback
    if (!apiKey || apiKey === 'your_gemini_key_here') {
      return NextResponse.json({
        response: FALLBACK_RESPONSES.default,
        fallback: true,
      })
    }

    // Call Gemini API
    const geminiMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: NUURA_CONTEXT }] },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? FALLBACK_RESPONSES.default

    return NextResponse.json({ response: text, fallback: false })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ response: FALLBACK_RESPONSES.error, fallback: true })
  }
}
