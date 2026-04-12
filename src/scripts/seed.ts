import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { connectDB } from '../lib/mongodb'
import Product from '../models/Product'

const products = [
  {
    slug: 'rose-quartz-gua-sha',
    name: 'Rose Quartz Gua Sha',
    tagline: 'Sculpt. Depuff. Glow.',
    description: 'Authentic rose quartz gua sha stone for facial lifting and lymphatic drainage. Cool to the touch, smooth on skin. Use daily with facial oil in upward strokes to reduce puffiness and define jawline.',
    price: 2800,
    comparePrice: 3500,
    images: [
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=85',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85',
    ],
    category: 'self-care',
    tags: ['gua-sha', 'rose-quartz', 'facial', 'sculpt', 'depuff'],
    inStock: true,
    stockCount: 45,
    isFeatured: true,
    isNewDrop: true,
    isBestSeller: false,
  },
  {
    slug: 'led-glow-mirror',
    name: 'LED Glow Mirror',
    tagline: 'Studio lighting, anywhere.',
    description: 'Compact LED vanity mirror with adjustable brightness and 10x magnification. USB rechargeable with touch-sensitive controls. Perfect for flawless makeup application in any lighting.',
    price: 4500,
    comparePrice: 5500,
    images: [
      'https://images.unsplash.com/photo-1583241800698-e8ab01830a22?w=800&q=85',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=85',
    ],
    category: 'self-care',
    tags: ['mirror', 'led', 'makeup', 'vanity', 'light'],
    inStock: true,
    stockCount: 23,
    isFeatured: true,
    isNewDrop: false,
    isBestSeller: true,
  },
  {
    slug: 'mini-chain-crossbody',
    name: 'Mini Chain Crossbody',
    tagline: 'Small bag. Big statement.',
    description: 'Quilted mini crossbody bag with gold chain strap. Fits your phone, cards, and lip gloss. Goes from morning coffee to evening dinner without missing a beat.',
    price: 3200,
    comparePrice: null,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85',
    ],
    category: 'accessories',
    tags: ['bag', 'crossbody', 'chain', 'quilted', 'handbag'],
    inStock: true,
    stockCount: 18,
    isFeatured: true,
    isNewDrop: true,
    isBestSeller: false,
  },
  {
    slug: 'jade-face-roller',
    name: 'Jade Face Roller',
    tagline: 'Roll away the stress.',
    description: 'Dual-ended jade roller for facial massage and serum absorption. Large end for cheeks and forehead, small end for under-eye area. Store in fridge for extra cooling effect.',
    price: 1800,
    comparePrice: 2200,
    images: [
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=85',
      'https://images.unsplash.com/photo-1556228720-da8ead62f0f0?w=800&q=85',
    ],
    category: 'self-care',
    tags: ['jade', 'roller', 'facial', 'massage', 'puffiness'],
    inStock: true,
    stockCount: 60,
    isFeatured: false,
    isNewDrop: false,
    isBestSeller: true,
  },
  {
    slug: 'acrylic-clutch',
    name: 'Acrylic Box Clutch',
    tagline: 'Art you carry.',
    description: 'Clear acrylic clutch with gold hardware. A statement piece that turns heads. Spacious enough for evening essentials — phone, cards, lip gloss.',
    price: 2500,
    comparePrice: null,
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=85',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=85',
    ],
    category: 'accessories',
    tags: ['clutch', 'acrylic', 'transparent', 'evening', 'clear'],
    inStock: true,
    stockCount: 12,
    isFeatured: false,
    isNewDrop: true,
    isBestSeller: false,
  },
  {
    slug: 'facial-steamer',
    name: 'USB Facial Steamer',
    tagline: 'Open up. Breathe in. Glow.',
    description: 'Nano ionic facial steamer for deep pore cleansing and intense hydration. Use before serums to maximize absorption. Portable USB-powered design fits any bathroom.',
    price: 3800,
    comparePrice: 4500,
    images: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=85',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85',
    ],
    category: 'self-care',
    tags: ['steamer', 'facial', 'pores', 'hydration', 'cleanse'],
    inStock: true,
    stockCount: 35,
    isFeatured: false,
    isNewDrop: false,
    isBestSeller: false,
  },
  {
    slug: 'night-cream',
    name: 'Night Cream',
    tagline: 'Restore. Nourish. Rejuvenate.',
    description: 'Rich, luxurious night cream with hyaluronic acid and peptides. Deeply moisturizes while you sleep. Wake up to plump, glowing skin.',
    price: 2200,
    comparePrice: 3000,
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=85',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85',
    ],
    category: 'self-care',
    tags: ['cream', 'night', 'moisturizer', 'skincare', 'hydration'],
    inStock: true,
    stockCount: 40,
    isFeatured: false,
    isNewDrop: true,
    isBestSeller: false,
  },
]

async function seed() {
  console.log('Connecting to MongoDB...')
  await connectDB()

  console.log('Clearing existing products...')
  await Product.deleteMany({})

  console.log('Seeding products...')
  for (const p of products) {
    await Product.create(p as any)
    console.log(`  ✓ ${p.name}`)
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
