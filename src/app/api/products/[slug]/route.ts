import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ProductModel from '@/models/Product'
import { MOCK_PRODUCTS } from '@/lib/mockData'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params

  try {
    await connectDB()
    const product = await ProductModel.findOne({ slug }).lean()
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ product })
  } catch {
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ product })
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { slug } = await params
  try {
    await connectDB()
    const body = await request.json()

    const product = await ProductModel.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true }
    ).lean()

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ product })
  } catch (err) {
    console.error('PATCH product error:', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { slug } = await params
  try {
    await connectDB()
    const product = await ProductModel.findOneAndDelete({ slug })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE product error:', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

