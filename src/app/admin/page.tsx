'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatPKR } from '@/lib/utils'

interface OrderRow {
  _id: string
  orderNumber: string
  customer: { name: string; email: string }
  items: unknown[]
  total: number
  paymentMethod: string
  orderStatus: string
  paymentStatus: string
  createdAt: string
}

interface Stats {
  totalOrders: number
  pendingVerification: number
  confirmedRevenue: number
  totalProducts: number
  recentOrders: OrderRow[]
}

const PAYMENT_BADGE: Record<string, string> = {
  cod: 'bg-blue-500/20 text-blue-700',
  jazzcash: 'bg-red-500/20 text-red-700',
  easypaisa: 'bg-green-500/20 text-green-700',
  nayapay: 'bg-purple-500/20 text-purple-700',
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-700',
  pending_verification: 'bg-amber-500/20 text-amber-700',
  confirmed: 'bg-green-500/20 text-green-700',
  processing: 'bg-blue-500/20 text-blue-700',
  shipped: 'bg-blue-500/20 text-blue-700',
  delivered: 'bg-emerald-500/20 text-emerald-700',
  cancelled: 'bg-red-500/20 text-red-700',
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full font-sans text-[10px] tracking-wider uppercase ${STATUS_BADGE[status] ?? 'bg-[#DDD8CF] text-[#6B7B6E]'}`}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

function PaymentPill({ method }: { method: string }) {
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full font-sans text-[10px] tracking-wider uppercase ${PAYMENT_BADGE[method] ?? 'bg-[#DDD8CF] text-[#6B7B6E]'}`}
    >
      {method}
    </span>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      setStats(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  async function updateOrder(id: string, body: Record<string, string>) {
    setApprovingId(id)
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await fetchStats()
    } finally {
      setApprovingId(null)
    }
  }

  const today = new Date().toLocaleDateString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const pendingOrders =
    stats?.recentOrders?.filter((o) => o.paymentStatus === 'pending_verification') ?? []

  return (
    <div>
      <div className="px-8 py-8 border-b border-[#DDD8CF]">
        <h1 className="font-sans text-xl text-[#0F1A11] font-light">Dashboard</h1>
        <p className="font-sans text-xs text-[#6B7B6E] mt-1">{today}</p>
      </div>

      <div className="px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Orders',
            value: loading ? '-' : String(stats?.totalOrders ?? 0),
            sub: 'All time',
          },
          {
            label: 'Pending Verification',
            value: loading ? '-' : String(stats?.pendingVerification ?? 0),
            sub: 'Awaiting approval',
          },
          {
            label: 'Confirmed Revenue',
            value: loading ? '-' : formatPKR(stats?.confirmedRevenue ?? 0),
            sub: 'Confirmed & shipped',
          },
          {
            label: 'Products',
            value: loading ? '-' : String(stats?.totalProducts ?? 0),
            sub: 'Live in store',
          },
        ].map((s) => (
          <div key={s.label} className="bg-[#FFFFFF] p-6 border border-[#DDD8CF]">
            <p className="font-sans text-[10px] tracking-widest uppercase text-[#6B7B6E]">
              {s.label}
            </p>
            <p className="font-sans text-3xl text-[#0F1A11] font-light mt-2">{s.value}</p>
            <p className="font-sans text-xs text-[#6B7B6E] mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {pendingOrders.length > 0 && (
        <div className="px-8 mb-6">
          <p className="font-sans text-sm text-amber-700 mb-4">
            Needs Your Attention ({pendingOrders.length})
          </p>
          <div className="flex flex-col gap-3">
            {pendingOrders.map((order) => (
              <div
                key={order._id}
                className="bg-[#FFFFFF] border border-amber-500/40 px-6 py-4 flex items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-xs text-[#0F1A11]">{order.orderNumber}</p>
                  <p className="font-sans text-sm text-[#6B7B6E]">{order.customer.name}</p>
                  <div className="flex gap-2 mt-1">
                    <PaymentPill method={order.paymentMethod} />
                    <StatusPill status={order.paymentStatus} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateOrder(order._id, {
                        orderStatus: 'confirmed',
                        paymentStatus: 'paid',
                      })
                    }
                    disabled={approvingId === order._id}
                    className="bg-[#1B2E1F] text-[#F5F0E6] border border-[#1B2E1F] font-sans text-xs tracking-wider uppercase px-4 py-2 hover:bg-[#D4A853] hover:border-[#D4A853] hover:text-[#1B2E1F] transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      updateOrder(order._id, {
                        orderStatus: 'cancelled',
                        paymentStatus: 'failed',
                      })
                    }
                    disabled={approvingId === order._id}
                    className="bg-[#F5F0E6] text-[#6B7B6E] border border-[#DDD8CF] font-sans text-xs tracking-wider uppercase px-4 py-2 hover:bg-[#EEE7DA] transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-8 mt-2 pb-12">
        <div className="flex items-center justify-between mb-4">
          <p className="font-sans text-sm text-[#6B7B6E]">Recent Orders</p>
          <Link
            href="/admin/orders"
            className="font-sans text-xs text-[#6B7B6E] hover:text-[#0F1A11] transition-colors"
          >
            View All -&gt;
          </Link>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DDD8CF] overflow-x-auto">
          {loading ? (
            <div className="px-6 py-12 text-center font-sans text-sm text-[#6B7B6E]">
              Loading...
            </div>
          ) : !stats?.recentOrders?.length ? (
            <div className="px-6 py-12 text-center font-sans text-sm text-[#6B7B6E]">
              No orders yet
            </div>
          ) : (
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-[#1B2E1F]">
                  {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date'].map(
                    (h) => (
                      <th
                        key={h}
                        className="font-sans text-[10px] tracking-widest uppercase text-[#F5F0E6] px-6 py-4 text-left"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-[#DDD8CF] last:border-0 hover:bg-[#F5F0E6]/40 transition-colors"
                  >
                    <td className="font-mono text-xs text-[#0F1A11] px-6 py-4">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-sans text-sm text-[#0F1A11]">{order.customer.name}</p>
                      <p className="font-sans text-xs text-[#6B7B6E]">{order.customer.email}</p>
                    </td>
                    <td className="font-sans text-sm text-[#6B7B6E] px-6 py-4">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="font-sans text-sm text-[#0F1A11] px-6 py-4">
                      {formatPKR(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <PaymentPill method={order.paymentMethod} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={order.orderStatus} />
                    </td>
                    <td className="font-sans text-xs text-[#6B7B6E] px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
