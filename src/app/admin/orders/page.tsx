'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, Eye } from 'lucide-react'
import { formatPKR } from '@/lib/utils'

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  _id: string
  orderNumber: string
  customer: { name: string; email: string; phone: string }
  items: OrderItem[]
  shippingAddress: {
    fullName: string
    phone: string
    street: string
    city: string
    province: string
  }
  total: number
  subtotal: number
  shippingFee: number
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  notes?: string
  createdAt: string
}

const PAGE_SIZE = 20

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

const FILTER_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Pending Verification', value: 'pending_verification' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
]

function Pill({ text, className }: { text: string; className: string }) {
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full font-sans text-[10px] tracking-wider uppercase ${className}`}
    >
      {text.replace('_', ' ')}
    </span>
  )
}

function OrderDetailModal({
  order,
  onClose,
}: {
  order: Order
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-4 mt-20 mb-20 bg-[#FAFAF8] border border-[#DDD8CF] p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B7B6E] hover:text-[#0F1A11] transition-colors"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="mb-8">
          <p className="font-mono text-base text-[#0F1A11]">{order.orderNumber}</p>
          <p className="font-sans text-xs text-[#6B7B6E] mt-1">
            {new Date(order.createdAt).toLocaleDateString('en-PK', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <div className="flex gap-2 mt-3">
            <Pill
              text={order.paymentMethod}
              className={PAYMENT_BADGE[order.paymentMethod] ?? 'bg-[#DDD8CF] text-[#6B7B6E]'}
            />
            <Pill
              text={order.orderStatus}
              className={STATUS_BADGE[order.orderStatus] ?? 'bg-[#DDD8CF] text-[#6B7B6E]'}
            />
            <Pill
              text={order.paymentStatus}
              className={STATUS_BADGE[order.paymentStatus] ?? 'bg-[#DDD8CF] text-[#6B7B6E]'}
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="font-sans text-[10px] tracking-widest uppercase text-[#6B7B6E] mb-3">
            Customer
          </p>
          <p className="font-sans text-sm text-[#0F1A11]">{order.customer.name}</p>
          <p className="font-sans text-xs text-[#6B7B6E]">{order.customer.email}</p>
          <p className="font-sans text-xs text-[#6B7B6E]">{order.customer.phone}</p>
        </div>

        <div className="mb-6">
          <p className="font-sans text-[10px] tracking-widest uppercase text-[#6B7B6E] mb-3">
            Delivery Address
          </p>
          <p className="font-sans text-sm text-[#0F1A11]">{order.shippingAddress.street}</p>
          <p className="font-sans text-xs text-[#6B7B6E]">
            {order.shippingAddress.city}, {order.shippingAddress.province}
          </p>
          <p className="font-sans text-xs text-[#6B7B6E]">{order.shippingAddress.phone}</p>
        </div>

        <div className="mb-6">
          <p className="font-sans text-[10px] tracking-widest uppercase text-[#6B7B6E] mb-3">
            Order Items
          </p>
          <div className="flex flex-col gap-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <p className="font-sans text-sm text-[#0F1A11]">{item.name}</p>
                  <p className="font-sans text-xs text-[#6B7B6E]">Qty: {item.quantity}</p>
                </div>
                <p className="font-sans text-sm text-[#0F1A11]">
                  {formatPKR(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#DDD8CF] pt-4 flex flex-col gap-2">
          <div className="flex justify-between font-sans text-xs text-[#6B7B6E]">
            <span>Subtotal</span>
            <span>{formatPKR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between font-sans text-xs text-[#6B7B6E]">
            <span>Shipping</span>
            <span>{order.shippingFee === 0 ? 'Free' : formatPKR(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between font-sans text-sm text-[#0F1A11] mt-1">
            <span>Total</span>
            <span>{formatPKR(order.total)}</span>
          </div>
        </div>

        {order.notes && (
          <div className="mt-4">
            <p className="font-sans text-[10px] tracking-widest uppercase text-[#6B7B6E] mb-2">
              Note
            </p>
            <p className="font-sans text-xs text-[#6B7B6E] italic">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [actionId, setActionId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data.orders ?? [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  async function updateOrder(id: string, body: Record<string, string>) {
    setActionId(id)
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await fetchOrders()
    } finally {
      setActionId(null)
    }
  }

  const filtered =
    activeFilter === 'all'
      ? orders
      : orders.filter(
          (o) => o.orderStatus === activeFilter || o.paymentStatus === activeFilter
        )

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  function tabCount(value: string) {
    if (value === 'all') return orders.length
    return orders.filter(
      (o) => o.orderStatus === value || o.paymentStatus === value
    ).length
  }

  return (
    <div>
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      <div className="px-8 py-8 border-b border-[#DDD8CF]">
        <h1 className="font-sans text-xl text-[#0F1A11] font-light">Orders</h1>
      </div>

      <div className="px-8 py-4 flex gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setActiveFilter(tab.value); setPage(1) }}
            className={[
              'font-sans text-xs tracking-wider px-4 py-2 rounded-full transition-colors',
              activeFilter === tab.value
                ? 'bg-[#1B2E1F] text-[#F5F0E6]'
                : 'bg-[#FAFAF8] text-[#6B7B6E] border border-[#DDD8CF] hover:text-[#0F1A11]',
            ].join(' ')}
          >
            {tab.label}
            <span className="ml-2 opacity-60">({tabCount(tab.value)})</span>
          </button>
        ))}
      </div>

      <div className="px-8 pb-12">
        <div className="bg-[#FFFFFF] border border-[#DDD8CF] overflow-x-auto">
          {loading ? (
            <div className="px-6 py-12 text-center font-sans text-sm text-[#6B7B6E]">
              Loading...
            </div>
          ) : !paginated.length ? (
            <div className="px-6 py-12 text-center font-sans text-sm text-[#6B7B6E]">
              No orders
            </div>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-[#1B2E1F]">
                  {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(
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
                {paginated.map((order) => (
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
                      <Pill
                        text={order.paymentMethod}
                        className={PAYMENT_BADGE[order.paymentMethod] ?? 'bg-[#DDD8CF] text-[#6B7B6E]'}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Pill
                        text={order.orderStatus}
                        className={STATUS_BADGE[order.orderStatus] ?? 'bg-[#DDD8CF] text-[#6B7B6E]'}
                      />
                    </td>
                    <td className="font-sans text-xs text-[#6B7B6E] px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-[#6B7B6E] hover:text-[#0F1A11] transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} strokeWidth={1.5} />
                        </button>

                        {order.paymentStatus === 'pending_verification' && (
                          <>
                            <button
                              onClick={() =>
                                updateOrder(order._id, {
                                  orderStatus: 'confirmed',
                                  paymentStatus: 'paid',
                                })
                              }
                              disabled={actionId === order._id}
                              className="font-sans text-[10px] tracking-wider uppercase px-3 py-1 bg-[#1B2E1F] text-[#F5F0E6] border border-[#1B2E1F] hover:bg-[#D4A853] hover:border-[#D4A853] hover:text-[#1B2E1F] transition-colors disabled:opacity-50"
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
                              disabled={actionId === order._id}
                              className="font-sans text-[10px] tracking-wider uppercase px-3 py-1 bg-[#F5F0E6] text-[#6B7B6E] border border-[#DDD8CF] hover:bg-[#EEE7DA] transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {order.orderStatus === 'confirmed' && (
                          <button
                            onClick={() =>
                              updateOrder(order._id, { orderStatus: 'shipped' })
                            }
                            disabled={actionId === order._id}
                            className="font-sans text-[10px] tracking-wider uppercase px-3 py-1 bg-blue-500/20 text-blue-700 border border-blue-500/30 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                          >
                            Ship
                          </button>
                        )}

                        {order.orderStatus === 'shipped' && (
                          <button
                            onClick={() =>
                              updateOrder(order._id, { orderStatus: 'delivered' })
                            }
                            disabled={actionId === order._id}
                            className="font-sans text-[10px] tracking-wider uppercase px-3 py-1 bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                          >
                            Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex gap-2 mt-4 justify-end">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={[
                  'font-sans text-xs px-3 py-2 transition-colors',
                  p === page
                    ? 'bg-[#1B2E1F] text-[#F5F0E6]'
                    : 'bg-[#FAFAF8] text-[#6B7B6E] border border-[#DDD8CF] hover:text-[#0F1A11]',
                ].join(' ')}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
