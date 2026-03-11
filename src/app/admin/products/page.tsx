'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { X, Plus, Edit2 } from 'lucide-react'
import { formatPKR } from '@/lib/utils'

interface Product {
  _id: string
  slug: string
  name: string
  tagline: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  tags: string[]
  inStock: boolean
  stockCount: number
  isFeatured: boolean
  isNewDrop: boolean
  isBestSeller: boolean
}

const BLANK_FORM = {
  name: '',
  tagline: '',
  description: '',
  price: '',
  comparePrice: '',
  category: 'self-care',
  stockCount: '',
  tags: '',
  images: '',
  isFeatured: false,
  isNewDrop: false,
  isBestSeller: false,
  inStock: true,
}

type FormState = typeof BLANK_FORM

function ProductModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null
  onClose: () => void
  onSaved: () => void
}) {
  const editing = product !== null
  const [form, setForm] = useState<FormState>(
    editing
      ? {
          name: product.name,
          tagline: product.tagline,
          description: product.description,
          price: String(product.price),
          comparePrice: product.comparePrice ? String(product.comparePrice) : '',
          category: product.category,
          stockCount: String(product.stockCount),
          tags: product.tags.join(', '),
          images: product.images.join('\n'),
          isFeatured: product.isFeatured,
          isNewDrop: product.isNewDrop,
          isBestSeller: product.isBestSeller,
          inStock: product.inStock,
        }
      : BLANK_FORM
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function field(key: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const body = {
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        category: form.category,
        stockCount: Number(form.stockCount),
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        images: form.images
          .split('\n')
          .map((u) => u.trim())
          .filter(Boolean),
        isFeatured: form.isFeatured,
        isNewDrop: form.isNewDrop,
        isBestSeller: form.isBestSeller,
        inStock: form.inStock,
      }

      const url = editing ? `/api/products/${product.slug}` : '/api/products'
      const method = editing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to save product')
        return
      }
      onSaved()
    } catch {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const inputCls =
    'bg-[#1A1A1A] border border-white/10 text-white placeholder-white/20 px-4 py-2.5 w-full focus:outline-none focus:border-white/30 font-sans text-sm transition-colors'

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-4 mt-16 mb-20 bg-[#141414] border border-white/10 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <p className="font-sans text-base text-white mb-6">
          {editing ? 'Edit Product' : 'Add Product'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name + Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className={inputCls}
              placeholder="Product name *"
              value={form.name}
              onChange={(e) => field('name', e.target.value)}
              required
            />
            <input
              className={inputCls}
              placeholder="Tagline *"
              value={form.tagline}
              onChange={(e) => field('tagline', e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <textarea
            className={inputCls + ' resize-none'}
            placeholder="Description *"
            rows={3}
            value={form.description}
            onChange={(e) => field('description', e.target.value)}
            required
          />

          {/* Price + Compare Price + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              className={inputCls}
              placeholder="Price (PKR) *"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => field('price', e.target.value)}
              required
            />
            <input
              className={inputCls}
              placeholder="Compare Price"
              type="number"
              min="0"
              value={form.comparePrice}
              onChange={(e) => field('comparePrice', e.target.value)}
            />
            <select
              className={inputCls}
              value={form.category}
              onChange={(e) => field('category', e.target.value)}
            >
              <option value="self-care">Self-Care</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          {/* Stock */}
          <div className="grid grid-cols-2 gap-4">
            <input
              className={inputCls}
              placeholder="Stock Count *"
              type="number"
              min="0"
              value={form.stockCount}
              onChange={(e) => field('stockCount', e.target.value)}
              required
            />
            <input
              className={inputCls}
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => field('tags', e.target.value)}
            />
          </div>

          {/* Images */}
          <div>
            <textarea
              className={inputCls + ' resize-none'}
              placeholder="Image URLs (one per line) — Cloudinary coming soon"
              rows={3}
              value={form.images}
              onChange={(e) => field('images', e.target.value)}
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                { key: 'isFeatured', label: 'Featured' },
                { key: 'isNewDrop', label: 'New Drop' },
                { key: 'isBestSeller', label: 'Best Seller' },
                { key: 'inStock', label: 'In Stock' },
              ] as { key: keyof FormState; label: string }[]
            ).map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form[key] as boolean}
                  onChange={(e) => field(key, e.target.checked)}
                  className="accent-white w-4 h-4"
                />
                <span className="font-sans text-xs text-white/60">{label}</span>
              </label>
            ))}
          </div>

          {error && <p className="text-red-400 font-sans text-xs">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="bg-white text-[#0F0F0F] w-full py-3 font-sans text-xs tracking-widest uppercase hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  )
}

function StockBadge({ count }: { count: number }) {
  if (count === 0) return <span className="text-red-400 font-sans text-xs">Out of Stock</span>
  if (count <= 10)
    return (
      <span className="text-amber-400 font-sans text-xs">
        Low: {count}
      </span>
    )
  return <span className="text-green-400 font-sans text-xs">{count} in stock</span>
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | Product | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products?limit=100')
      const data = await res.json()
      setProducts(data.products ?? [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  function handleSaved() {
    setModal(null)
    fetchProducts()
  }

  return (
    <div>
      {modal !== null && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Header */}
      <div className="px-8 py-8 border-b border-white/5 flex items-center justify-between">
        <h1 className="font-sans text-xl text-white font-light">Products</h1>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 bg-white text-[#0F0F0F] px-6 py-2 font-sans text-xs tracking-widest uppercase hover:bg-white/90 transition-colors"
        >
          <Plus size={14} strokeWidth={2} />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="px-8 py-8 pb-12">
        <div className="bg-[#141414] border border-white/5 overflow-x-auto">
          {loading ? (
            <div className="px-6 py-12 text-center font-sans text-sm text-white/30">
              Loading...
            </div>
          ) : !products.length ? (
            <div className="px-6 py-12 text-center font-sans text-sm text-white/30">
              No products
            </div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5">
                  {['Image', 'Product', 'Category', 'Price', 'Stock', 'Badges', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className="font-sans text-[10px] tracking-widest uppercase text-white/30 px-6 py-4 text-left"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Image */}
                    <td className="px-6 py-4">
                      {product.images[0] ? (
                        <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-[#1A1A1A]">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A]" />
                      )}
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <p className="font-sans text-sm text-white">{product.name}</p>
                      <p className="font-sans text-xs text-white/40">{product.tagline}</p>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="font-sans text-[10px] tracking-wider uppercase bg-white/10 text-white/60 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <p className="font-sans text-sm text-white">{formatPKR(product.price)}</p>
                      {product.comparePrice && (
                        <p className="font-sans text-xs text-white/30 line-through">
                          {formatPKR(product.comparePrice)}
                        </p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <StockBadge count={product.stockCount} />
                    </td>

                    {/* Badges */}
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {product.isFeatured && (
                          <span className="font-sans text-[9px] tracking-wider uppercase bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                        {product.isNewDrop && (
                          <span className="font-sans text-[9px] tracking-wider uppercase bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                            New Drop
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="font-sans text-[9px] tracking-wider uppercase bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setModal(product)}
                        className="text-white/30 hover:text-white transition-colors"
                        title="Edit product"
                      >
                        <Edit2 size={14} strokeWidth={1.5} />
                      </button>
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
