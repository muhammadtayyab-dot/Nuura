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
