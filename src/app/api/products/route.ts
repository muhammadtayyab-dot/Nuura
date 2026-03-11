import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ProductModel from '@/models/Product'
import { MOCK_PRODUCTS } from '@/lib/mockData'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const newDrop = searchParams.get('newDrop')
  const limit = parseInt(searchParams.get('limit') ?? '12')

  try {
    await connectDB()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = ProductModel.find()
    if (category) query = query.where('category').equals(category)
    if (featured) query = query.where('isFeatured').equals(true)
    if (newDrop) query = query.where('isNewDrop').equals(true)
    const products = await query.limit(limit).lean()
    return NextResponse.json({ products })
  } catch {
    // DB not connected — return mock data
    let filtered = MOCK_PRODUCTS as typeof MOCK_PRODUCTS
    if (category) filtered = filtered.filter((p) => p.category === category)
    if (featured) filtered = filtered.filter((p) => p.isFeatured)
    if (newDrop) filtered = filtered.filter((p) => p.isNewDrop)
    return NextResponse.json({ products: filtered.slice(0, limit) })
  }
}
