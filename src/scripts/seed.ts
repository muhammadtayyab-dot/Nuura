import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { connectDB } from '../lib/mongodb'
import Product from '../models/Product'
import { MOCK_PRODUCTS } from '../lib/mockData'

async function seed() {
  console.log('Connecting to MongoDB...')
  await connectDB()

  console.log('Clearing existing products...')
  await Product.deleteMany({})

  console.log('Seeding products...')
  for (const p of MOCK_PRODUCTS) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...doc } = p
    await Product.create(doc as any)
    console.log(`  ✓ ${p.name}`)
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
