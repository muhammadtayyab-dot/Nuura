 'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  MessageCircle,
  X,
  Send,
  Trash2,
  Bot,
  User,
  Loader2,
  ExternalLink,
} from 'lucide-react'

const SESSION_KEY = 'nuura_admin_chat_v2'

interface TableData {
  headers: string[]
  rows: string[][]
  note?: string
}

interface NavLink {
  label: string
  href: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  table?: TableData | null
  isLoading?: boolean
  links?: NavLink[]
  suggestions?: string[]
}

type ProcessResult = {
  text: string
  table?: TableData | null
  links?: NavLink[]
  suggestions?: string[]
  navigateTo?: string
}

function matchesAny(q: string, phrases: string[]) {
  return phrases.some((phrase) => q.includes(phrase))
}

function formatPKR(value: unknown) {
  const numeric = typeof value === 'number' ? value : Number(String(value ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(numeric) ? `PKR ${numeric.toLocaleString()}` : 'PKR 0'
}

function formatDate(value: unknown) {
  if (!value) return 'N/A'
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString()
}

async function fetchProducts() {
  const res = await fetch('/api/products?limit=100', { cache: 'no-store' })
  if (!res.ok) throw new Error('Could not load products')
  const data = await res.json()
  return (data.products ?? []) as Record<string, unknown>[]
}

async function fetchOrders(params = '') {
  const res = await fetch(`/api/orders${params ? `?${params}` : ''}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Could not load orders')
  const data = await res.json()
  return (data.orders ?? data ?? []) as Record<string, unknown>[]
}

async function fetchCustomers() {
  const res = await fetch('/api/customers', { cache: 'no-store' })
  if (!res.ok) throw new Error('Could not load customers')
  const data = await res.json()
  return (data.customers ?? data ?? []) as Record<string, unknown>[]
}

async function fetchStats(days = 30) {
  const res = await fetch(`/api/admin/stats?days=${days}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Could not load stats')
  return res.json()
}

function productsToTable(products: Record<string, unknown>[], note?: string): TableData {
  return {
    headers: ['Name', 'Price', 'Stock', 'Category', 'Status'],
    rows: products.map((product) => {
      const stockCount = Number(product.stockCount ?? 0)
      const inStock = product.inStock !== false && stockCount > 0
      return [
        String(product.name ?? 'N/A'),
        formatPKR(product.price),
        String(stockCount),
        String(product.category ?? 'N/A'),
        inStock ? 'In Stock' : 'Out of Stock',
      ]
    }),
    note: note ?? `${products.length} product${products.length === 1 ? '' : 's'}`,
  }
}

function ordersToTable(orders: Record<string, unknown>[], note?: string): TableData {
  return {
    headers: ['Order', 'Customer', 'Total', 'Status', 'Date'],
    rows: orders.map((order) => {
      const orderId = String(order.orderNumber ?? order._id ?? 'N/A')
      const customerRecord = (order.customer ?? {}) as Record<string, unknown>
      const customer = String(customerRecord.name ?? order.customerName ?? customerRecord.email ?? order.email ?? 'N/A')
      const total = formatPKR(order.total ?? order.totalAmount ?? order.amount)
      const status = String(order.orderStatus ?? order.status ?? 'N/A')
      return [orderId, customer, total, status, formatDate(order.createdAt)]
    }),
    note: note ?? `${orders.length} order${orders.length === 1 ? '' : 's'}`,
  }
}

function customersToTable(customers: Record<string, unknown>[], note?: string): TableData {
  return {
    headers: ['Name', 'Email', 'Orders', 'Spent', 'Joined'],
    rows: customers.map((customer) => [
      String(customer.name ?? 'N/A'),
      String(customer.email ?? 'N/A'),
      String(customer.orderCount ?? 0),
      formatPKR(customer.totalSpent ?? 0),
      formatDate(customer.joinDate ?? customer.createdAt),
    ]),
    note: note ?? `${customers.length} customer${customers.length === 1 ? '' : 's'}`,
  }
}

function statsToText(stats: Record<string, unknown>) {
  const revenue = formatPKR(stats.confirmedRevenue ?? stats.revenue ?? stats.totalRevenue ?? 0)
  const orderCount = Number(stats.totalOrders ?? stats.orderCount ?? stats.orders ?? 0)
  const pending = Number(stats.pendingVerification ?? stats.pendingOrders ?? 0)
  const topProducts = Array.isArray(stats.topProducts) ? stats.topProducts : []

  let text = `**Sales Summary**\n\n`
  text += `• Revenue: **${revenue}**\n`
  text += `• Orders: **${orderCount}**\n`
  text += `• Pending verification: **${pending}**`

  if (topProducts.length > 0) {
    text += `\n\n**Top Products**`
  }

  return text
}

const HELP_TEXT = `Here's what I can do:\n\n**Products**\n- show products\n- low stock\n- missing SEO\n\n**Orders**\n- show orders\n- pending orders\n- confirmed orders\n- today orders\n- this week\n\n**Reports**\n- revenue\n- stats\n- analytics\n\n**Customers**\n- show customers\n- inactive customers\n\n**Navigate**\n- go to orders\n- go to products\n- go to customers\n- go to analytics\n- go to settings`

async function processCommand(input: string): Promise<ProcessResult> {
  const q = input.toLowerCase().trim()

  if (matchesAny(q, ['go to orders', 'open orders', 'navigate orders'])) {
    return {
      text: 'Taking you to Orders...',
      links: [{ label: 'Go to Orders', href: '/admin/orders' }],
      navigateTo: '/admin/orders',
    }
  }

  if (matchesAny(q, ['go to products', 'open products', 'navigate products'])) {
    return {
      text: 'Taking you to Products...',
      links: [{ label: 'Go to Products', href: '/admin/products' }],
      navigateTo: '/admin/products',
    }
  }

  if (matchesAny(q, ['go to customers', 'open customers', 'navigate customers'])) {
    return {
      text: 'Taking you to Customers...',
      links: [{ label: 'Go to Customers', href: '/admin/customers' }],
      navigateTo: '/admin/customers',
    }
  }

  if (matchesAny(q, ['go to analytics', 'open analytics', 'navigate analytics'])) {
    return {
      text: 'Taking you to Analytics...',
      links: [{ label: 'Go to Analytics', href: '/admin/analytics' }],
      navigateTo: '/admin/analytics',
    }
  }

  if (matchesAny(q, ['go to settings', 'open settings'])) {
    return {
      text: 'Taking you to Settings...',
      links: [{ label: 'Go to Settings', href: '/admin/settings' }],
      navigateTo: '/admin/settings',
    }
  }

  if (q.includes('help') || q.includes('what can you do') || q.includes('commands')) {
    return {
      text: HELP_TEXT,
      suggestions: ['Show products', 'Low stock', 'Pending orders', 'Revenue', 'Show customers'],
    }
  }

  if (
    matchesAny(q, [
      'show products',
      'list products',
      'all products',
      'view products',
    ])
  ) {
    const products = await fetchProducts()
    if (!products.length) {
      return { text: 'No products found in your store.' }
    }
    return {
      text: `Found **${products.length} product${products.length === 1 ? '' : 's'}** in your catalog:`,
      table: productsToTable(products, `${products.length} product${products.length === 1 ? '' : 's'}`),
    }
  }

  if (matchesAny(q, ['low stock', 'stock alert', 'running low'])) {
    const products = await fetchProducts()
    const lowStock = products.filter((product) => {
      const stockCount = Number(product.stockCount ?? 0)
      const threshold = Number(product.lowStockThreshold ?? 10)
      return stockCount <= threshold
    })

    if (!lowStock.length) {
      return { text: '✅ All products are well stocked. No alerts.' }
    }

    return {
      text: `⚠️ **${lowStock.length} product${lowStock.length === 1 ? '' : 's'}** are at or below their low-stock threshold:`,
      table: productsToTable(lowStock, 'Low stock alert'),
    }
  }

  if (matchesAny(q, ['no seo', 'missing seo', 'no meta', 'missing meta'])) {
    const products = await fetchProducts()
    const missingSeo = products.filter((product) => {
      const seo = product.seo as Record<string, unknown> | undefined
      return !seo?.title
    })

    if (!missingSeo.length) {
      return { text: '✅ All products have SEO titles set.' }
    }

    return {
      text: `Found **${missingSeo.length} product${missingSeo.length === 1 ? '' : 's'}** with missing SEO:`,
      table: productsToTable(missingSeo, 'Missing SEO title'),
    }
  }

  if (matchesAny(q, ['show orders', 'list orders', 'all orders', 'view orders'])) {
    const orders = await fetchOrders('days=30')
    if (!orders.length) {
      return { text: 'No orders found.' }
    }
    return {
      text: `**${orders.length} total order${orders.length === 1 ? '' : 's'}**:`,
      table: ordersToTable(orders, `${orders.length} order${orders.length === 1 ? '' : 's'}`),
    }
  }

  if (matchesAny(q, ['pending orders', 'orders pending'])) {
    const orders = await fetchOrders('status=pending')
    const filtered = orders.filter((order) => String(order.orderStatus ?? order.status ?? '').toLowerCase() === 'pending')
    if (!filtered.length) {
      return { text: '✅ No pending orders right now.' }
    }
    return {
      text: `**${filtered.length} pending order${filtered.length === 1 ? '' : 's'}**:`,
      table: ordersToTable(filtered, 'Pending orders'),
    }
  }

  if (matchesAny(q, ['confirmed orders'])) {
    const orders = await fetchOrders('status=confirmed')
    const filtered = orders.filter((order) => String(order.orderStatus ?? order.status ?? '').toLowerCase() === 'confirmed')
    if (!filtered.length) {
      return { text: 'No confirmed orders.' }
    }
    return {
      text: `**${filtered.length} confirmed order${filtered.length === 1 ? '' : 's'}**:`,
      table: ordersToTable(filtered, 'Confirmed orders'),
    }
  }

  if (matchesAny(q, ['today orders', 'orders today'])) {
    const orders = await fetchOrders('days=1')
    const start = Date.now() - 24 * 60 * 60 * 1000
    const filtered = orders.filter((order) => {
      const createdAt = new Date(String(order.createdAt ?? '')).getTime()
      return Number.isFinite(createdAt) && createdAt >= start
    })

    if (!filtered.length) {
      return { text: 'No orders today yet.' }
    }

    return {
      text: `**${filtered.length} order${filtered.length === 1 ? '' : 's'}** today:`,
      table: ordersToTable(filtered, 'Today orders'),
    }
  }

  if (matchesAny(q, ['this week', 'week orders', 'orders this week'])) {
    const orders = await fetchOrders('days=7')
    const start = Date.now() - 7 * 24 * 60 * 60 * 1000
    const filtered = orders.filter((order) => {
      const createdAt = new Date(String(order.createdAt ?? '')).getTime()
      return Number.isFinite(createdAt) && createdAt >= start
    })

    if (!filtered.length) {
      return { text: 'No orders this week.' }
    }

    return {
      text: `**${filtered.length} order${filtered.length === 1 ? '' : 's'}** this week:`,
      table: ordersToTable(filtered, 'This week orders'),
    }
  }

  if (matchesAny(q, ['revenue', 'sales', 'earnings', 'stats', 'analytics'])) {
    const stats = await fetchStats(30)
    const topProducts = Array.isArray(stats.topProducts) ? stats.topProducts.slice(0, 5) : []
    const summaryText = statsToText(stats)

    const table: TableData | null = topProducts.length
      ? {
          headers: ['Product', 'Units', 'Revenue'],
          rows: topProducts.map((product: Record<string, unknown>) => [
            String(product.name ?? 'N/A'),
            String(product.units ?? product.count ?? 0),
            formatPKR(product.revenue ?? 0),
          ]),
          note: 'Top products from the last 30 days',
        }
      : null

    return {
      text: summaryText,
      table,
    }
  }

  if (matchesAny(q, ['no orders', 'never ordered', 'inactive customers'])) {
    const customers = await fetchCustomers()
    const inactive = customers.filter((customer) => Number(customer.orderCount ?? 0) === 0)

    if (!inactive.length) {
      return { text: '✅ All registered customers have placed at least one order.' }
    }

    return {
      text: `**${inactive.length} customer${inactive.length === 1 ? '' : 's'}** have never ordered:`,
      table: customersToTable(inactive, 'Inactive customers'),
    }
  }

  if (matchesAny(q, ['customers', 'show customers', 'list customers', 'all customers'])) {
    const customers = await fetchCustomers()
    if (!customers.length) {
      return { text: 'No registered customers yet.' }
    }
    return {
      text: `**${customers.length} registered customer${customers.length === 1 ? '' : 's'}**:`,
      table: customersToTable(customers, `${customers.length} customer${customers.length === 1 ? '' : 's'}`),
    }
  }

  return {
    text: "I didn't understand that. Type **help** to see what I can do.",
    suggestions: ['Show products', 'Low stock', 'Pending orders', 'Revenue', 'Show customers'],
  }
}

function RenderText({ text }: { text: string }) {
  const lines = text.split('\n')

  return (
    <div className="space-y-0.5">
      {lines.map((line, index) => {
        if (!line.trim()) return <br key={index} />

        const segments: React.ReactNode[] = []
        const regex = /\*\*(.+?)\*\*/g
        let lastIndex = 0
        let match: RegExpExecArray | null

        while ((match = regex.exec(line))) {
          const matchIndex = match.index
          if (matchIndex > lastIndex) {
            segments.push(line.slice(lastIndex, matchIndex))
          }
          segments.push(<strong key={`${index}-${matchIndex}`}>{match[1]}</strong>)
          lastIndex = matchIndex + match[0].length
        }

        if (lastIndex < line.length) {
          segments.push(line.slice(lastIndex))
        }

        return (
          <p key={index} className="leading-relaxed whitespace-pre-wrap">
            {segments.length ? segments : line}
          </p>
        )
      })}
    </div>
  )

}

function RenderTable({ table }: { table: TableData }) {
  return (
    <div className="mt-2">
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="bg-white/10">
              {table.headers.map((header) => (
                <th
                  key={header}
                  className="whitespace-nowrap border-b border-white/10 px-2 py-1.5 text-left font-sans uppercase tracking-wider text-white/60"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/5 transition-colors hover:bg-white/5">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="whitespace-nowrap px-2 py-1.5 text-white/80">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && <p className="mt-1 font-sans text-[9px] text-white/30">{table.note}</p>}
    </div>
  )
}

const SUGGESTIONS = ['Show products', 'Low stock', 'Pending orders', 'Revenue', 'Show customers', 'Help']

export default function AdminChatWidget() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) setMessages(JSON.parse(saved))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages))
    } catch {
      // ignore
    }
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return

      const userMsg: ChatMessage = { role: 'user', content: trimmed }
      const loadingMsg: ChatMessage = { role: 'assistant', content: '', isLoading: true }

      setMessages((prev) => [...prev, userMsg, loadingMsg])
      setInput('')
      setLoading(true)

      try {
        const result = await processCommand(trimmed)

        if (result.navigateTo) {
          setMessages((prev) =>
            prev.slice(0, -1).concat({
              role: 'assistant',
              content: result.text,
              links: result.links,
            })
          )
          setTimeout(() => router.push(result.navigateTo!), 250)
          return
        }

        setMessages((prev) =>
          prev.slice(0, -1).concat({
            role: 'assistant',
            content: result.text,
            table: result.table ?? null,
            links: result.links,
            suggestions: result.suggestions,
          })
        )
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Something went wrong.'
        setMessages((prev) =>
          prev.slice(0, -1).concat({
            role: 'assistant',
            content: `❌ ${message} Please try again.`,
            suggestions: ['Show products', 'Pending orders', 'Revenue', 'Help'],
          })
        )
      } finally {
        setLoading(false)
      }
    },
    [loading, router]
  )

  function clearChat() {
    setMessages([])
    sessionStorage.removeItem(SESSION_KEY)
  }

  return (
    <>
      <button
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-n-forest text-n-cream shadow-xl transition-all duration-200 hover:bg-n-gold hover:text-n-forest hover:scale-110 active:scale-95"
        title="Admin Assistant"
        aria-label="Open admin assistant"
      >
        {open ? <X size={20} strokeWidth={1.5} /> : <MessageCircle size={20} strokeWidth={1.5} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[600px] max-h-[calc(100vh-8rem)] w-[420px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#181d1a] shadow-2xl">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 bg-n-forest/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <Bot size={15} strokeWidth={1.5} className="text-n-gold" />
              <span className="font-sans text-xs uppercase tracking-widest text-white/90">
                Store Assistant
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="rounded p-1 text-white/30 transition-colors hover:text-white/70"
                title="Clear chat"
                aria-label="Clear chat"
              >
                <Trash2 size={13} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 text-white/30 transition-colors hover:text-white/70"
                aria-label="Close assistant"
              >
                <X size={13} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4" data-lenis-prevent>
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-n-forest/20">
                  <Bot size={24} strokeWidth={1} className="text-n-gold" />
                </div>
                <p className="mb-1 font-sans text-xs text-white/60">Store Assistant</p>
                <p className="mb-6 font-sans text-[11px] text-white/30">
                  Ask about products, orders, customers, or analytics.
                </p>
                <div className="grid w-full grid-cols-2 gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      className="rounded-lg border border-white/10 px-3 py-2 text-left font-sans text-[10px] text-white/50 transition-all hover:border-white/30 hover:bg-white/5 hover:text-white/90"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                    message.role === 'user'
                      ? 'bg-n-forest'
                      : 'border border-n-gold/30 bg-n-gold/20'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User size={13} strokeWidth={1.5} className="text-white" />
                  ) : (
                    <Bot size={13} strokeWidth={1.5} className="text-n-gold" />
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 font-sans text-[11px] leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-tr-sm bg-n-forest text-white'
                      : 'rounded-tl-sm border border-white/8 bg-white/5 text-white/90'
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-1 py-0.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:300ms]" />
                    </div>
                  ) : (
                    <>
                      <RenderText text={message.content} />

                      {message.table && <RenderTable table={message.table} />}

                      {message.links?.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="inline-flex items-center gap-1 rounded-full border border-n-gold/30 px-2.5 py-1 text-[10px] uppercase tracking-wider text-n-gold transition-colors hover:border-white/30 hover:text-white"
                            >
                              <ExternalLink size={10} strokeWidth={1.5} />
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}

                      {message.suggestions?.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => sendMessage(suggestion)}
                              className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/60 transition-colors hover:border-n-gold/30 hover:text-n-gold"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          <div className="flex-shrink-0 border-t border-white/10 px-4 py-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage(input)
                  }
                }}
                placeholder="Ask about products, orders, customers..."
                disabled={loading}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] font-sans text-white placeholder:text-white/25 focus:border-n-gold/40 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-n-forest text-white transition-all active:scale-95 hover:bg-n-gold hover:text-n-forest disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                {loading ? <Loader2 size={14} strokeWidth={1.5} className="animate-spin" /> : <Send size={14} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
