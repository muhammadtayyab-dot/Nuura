import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { connectDB } from '../lib/mongodb'
import Product from '../models/Product'
import { MOCK_PRODUCTS } from '../lib/mockData'
import { PRODUCT_IMAGES } from '../lib/placeholderImages'

const IMAGE_MAP: Record<string, readonly string[]> = {
  'rose-quartz-gua-sha': PRODUCT_IMAGES.guaSha,
  'led-glow-mirror': PRODUCT_IMAGES.ledMirror,
  'mini-chain-crossbody': PRODUCT_IMAGES.crossbodyBag,
  'jade-face-roller': PRODUCT_IMAGES.jadeRoller,
  'acrylic-clutch': PRODUCT_IMAGES.chainBag,
  'facial-steamer': PRODUCT_IMAGES.facialSteamer,
}

async function seed() {
  console.log('Connecting to MongoDB...')
  await connectDB()

  console.log('Clearing existing products...')
  await Product.deleteMany({})

  console.log('Seeding products...')
  for (const p of MOCK_PRODUCTS) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...doc } = p
    const images = IMAGE_MAP[p.slug] ?? doc.images
    await Product.create({ ...doc, images } as any)
    console.log(`  ✓ ${p.name}`)
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
