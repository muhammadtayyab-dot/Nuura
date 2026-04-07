import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message, products } = await req.json()

    // 1. Validate Token
    const API_KEY = process.env.HUGGINGFACE_TOKEN
    if (!API_KEY) {
      return NextResponse.json({ error: 'HuggingFace API key not configured' }, { status: 500 })
    }

    // 2. Build Prompt
    const systemPrompt = `
     You are Nuura's AI glow advisor for a Pakistani self-care brand.
     
     CURRENT PRODUCT CATALOG (live data):
     ${products && products.length > 0 ? products.map((p: any) => 
       `- ${p.name}: PKR ${p.price} ${p.comparePrice ? '(was PKR ' + p.comparePrice + ')' : ''} 
       — ${p.description} ${p.isNewDrop ? '[NEW]' : ''} 
       ${p.inStock === false ? '[OUT OF STOCK]' : ''}`
     ).join('\n') : 'No products available currently.'}
     
     STORE RULES:
     - Always mention actual PKR prices from the catalog above
     - If a product is out of stock, say so and suggest alternatives
     - If asked about a product not in the catalog, say it is not currently available and suggest what drop season to watch for
     - New drops happen every season with limited quantities
     - All orders via Cash on Delivery nationwide in Pakistan
     - If the catalog failed to load, say: "Let me check our latest drops for you — please visit nuura-temp.vercel.app/shop for live inventory"
     
     PERSONALITY:
     - Warm, elegant, minimal — like the brand itself
     - Short responses (max 3 sentences)
     - If user writes in Urdu, reply in Urdu
     - If user writes in Roman Urdu, reply in Roman Urdu  
     - Never make up products or prices
     - If unsure about anything, say "I am not sure — please check our shop page or DM us on Instagram for help"
    `

    const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"

    let bodyPayload = {
      inputs: `<s>[INST] ${systemPrompt}\nUser: ${message} [/INST]`,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        return_full_text: false,
      }
    }

    // 3. Fetch HF with Retries for Cold Start (max 3 times, 8s gaps)
    let response
    let retries = 3
    while (retries > 0) {
      response = await fetch(HUGGINGFACE_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload)
      })

      if (response.status === 503) {
        retries--
        if (retries > 0) {
          // Wait 8 seconds before retrying
          await new Promise((resolve) => setTimeout(resolve, 8000))
          continue
        }
      }
      break
    }

    if (!response || !response.ok) {
        return NextResponse.json({ error: 'HF API failed or cold start timeout' }, { status: response?.status || 500 })
    }

    const data = await response.json()
    
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 })
    }

    const generatedText = Array.isArray(data) ? data[0]?.generated_text : (data.generated_text || "")

    return NextResponse.json({ response: generatedText.trim() || 'I am not sure — please check our shop page or DM us on Instagram for help' })

  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}