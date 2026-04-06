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
    'bg-[#FAFAF8] border border-[#DDD8CF] text-[#0F1A11] placeholder-[#6B7B6E]/70 px-4 py-2.5 w-full focus:outline-none focus:border-[#1B2E1F] font-sans text-sm transition-colors'

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-4 mt-16 mb-20 bg-[#F5F0E6] border border-[#DDD8CF] p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B7B6E] hover:text-[#0F1A11] transition-colors"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <p className="font-sans text-base text-[#0F1A11] mb-6">
          {editing ? 'Edit Product' : 'Add Product'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <textarea
            className={inputCls + ' resize-none'}
            placeholder="Description *"
            rows={3}
            value={form.description}
            onChange={(e) => field('description', e.target.value)}
            required
          />

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

          <div>
            <textarea
              className={inputCls + ' resize-none'}
              placeholder="Image URLs (one per line)"
              rows={3}
              value={form.images}
              onChange={(e) => field('images', e.target.value)}
            />
          </div>

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
                  className="accent-[#1B2E1F] w-4 h-4"
                />
                <span className="font-sans text-xs text-[#6B7B6E]">{label}</span>
              </label>
            ))}
          </div>

          {error && <p className="text-red-600 font-sans text-xs">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="bg-[#1B2E1F] text-[#F5F0E6] w-full py-3 font-sans text-xs tracking-widest uppercase hover:bg-[#D4A853] hover:text-[#1B2E1F] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  )
}

function StockBadge({ count }: { count: number }) {
  if (count === 0) return <span className="text-red-600 font-sans text-xs">Out of Stock</span>
  if (count <= 10)
    return (
      <span className="text-amber-600 font-sans text-xs">
        Low: {count}
      </span>
    )
  return <span className="text-green-700 font-sans text-xs">{count} in stock</span>
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

      <div className="px-8 py-8 border-b border-[#DDD8CF] flex items-center justify-between">
        <h1 className="font-sans text-xl text-[#0F1A11] font-light">Products</h1>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 bg-[#1B2E1F] text-[#F5F0E6] px-6 py-2 font-sans text-xs tracking-widest uppercase hover:bg-[#D4A853] hover:text-[#1B2E1F] transition-colors"
        >
          <Plus size={14} strokeWidth={2} />
          Add Product
        </button>
      </div>

      <div className="px-8 py-8 pb-12">
        <div className="bg-[#FFFFFF] border border-[#DDD8CF] overflow-x-auto">
          {loading ? (
            <div className="px-6 py-12 text-center font-sans text-sm text-[#6B7B6E]">
              Loading...
            </div>
          ) : !products.length ? (
            <div className="px-6 py-12 text-center font-sans text-sm text-[#6B7B6E]">
              No products
            </div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#1B2E1F]">
                  {['Image', 'Product', 'Category', 'Price', 'Stock', 'Badges', 'Actions'].map(
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
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-[#DDD8CF] last:border-0 hover:bg-[#F5F0E6]/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {product.images[0] ? (
                        <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-[#F5F0E6]">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[#F5F0E6] to-[#EEE7DA]" />
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-sans text-sm text-[#0F1A11]">{product.name}</p>
                      <p className="font-sans text-xs text-[#6B7B6E]">{product.tagline}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-sans text-[10px] tracking-wider uppercase bg-[#F5F0E6] text-[#6B7B6E] px-2 py-1 rounded-full border border-[#DDD8CF]">
                        {product.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-sans text-sm text-[#0F1A11]">{formatPKR(product.price)}</p>
                      {product.comparePrice && (
                        <p className="font-sans text-xs text-[#6B7B6E] line-through">
                          {formatPKR(product.comparePrice)}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <StockBadge count={product.stockCount} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {product.isFeatured && (
                          <span className="font-sans text-[9px] tracking-wider uppercase bg-[#D4A853]/20 text-[#7A5A17] px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                        {product.isNewDrop && (
                          <span className="font-sans text-[9px] tracking-wider uppercase bg-[#1B2E1F]/15 text-[#1B2E1F] px-2 py-1 rounded-full">
                            New Drop
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="font-sans text-[9px] tracking-wider uppercase bg-blue-500/20 text-blue-700 px-2 py-1 rounded-full">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => setModal(product)}
                        className="text-[#6B7B6E] hover:text-[#0F1A11] transition-colors"
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
