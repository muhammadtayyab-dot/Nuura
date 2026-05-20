'use client'

import { useEffect, useState } from 'react'

type Stats = {
  confirmedRevenue?: number
  totalOrders?: number
  pendingVerification?: number
  topProducts?: Array<{ name?: string; units?: number; revenue?: number }>
}

function formatPKR(value: unknown) {
  const numeric = typeof value === 'number' ? value : Number(String(value ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(numeric) ? `PKR ${numeric.toLocaleString()}` : 'PKR 0'
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats?days=30', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load analytics')
        const data = (await res.json()) as Stats
        if (active) setStats(data)
      } catch {
        if (active) setStats(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadStats()

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#0f1511] px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            Live store performance pulled from the existing admin stats API.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
            Loading analytics...
          </div>
        ) : stats ? (
          <div className="grid gap-4 md:grid-cols-3">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Revenue</p>
              <p className="mt-3 text-2xl font-semibold text-n-gold">
                {formatPKR(stats.confirmedRevenue ?? 0)}
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Orders</p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {stats.totalOrders ?? 0}
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Pending</p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {stats.pendingVerification ?? 0}
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Top Products</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-white/50">
                      <th className="py-2 pr-4 font-medium">Product</th>
                      <th className="py-2 pr-4 font-medium">Units</th>
                      <th className="py-2 pr-4 font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.topProducts ?? []).slice(0, 8).map((product, index) => (
                      <tr key={`${product.name ?? 'product'}-${index}`} className="border-b border-white/5">
                        <td className="py-3 pr-4 text-white/90">{product.name ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-white/70">{product.units ?? 0}</td>
                        <td className="py-3 pr-4 text-white/70">{formatPKR(product.revenue ?? 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
            Analytics could not be loaded.
          </div>
        )}
      </div>
    </main>
  )
}