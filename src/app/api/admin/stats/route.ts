import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'

export async function GET() {
  try {
    await connectDB()

    const [
      totalOrders,
      pendingVerification,
      revenueAgg,
      totalProducts,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: 'pending_verification' }),
      Order.aggregate([
        {
          $match: {
            orderStatus: { $in: ['confirmed', 'shipped', 'delivered'] },
          },
        },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(10).lean(),
    ])

    const confirmedRevenue = revenueAgg[0]?.total ?? 0

    return NextResponse.json({
      totalOrders,
      pendingVerification,
      confirmedRevenue,
      totalProducts,
      recentOrders,
    })
  } catch (err) {
    console.error('Stats error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
