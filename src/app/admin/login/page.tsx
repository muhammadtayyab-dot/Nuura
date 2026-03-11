'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Invalid credentials')
        return
      }
      // Set cookie for 24 hours
      document.cookie = `nuura-admin-token=${data.token}; path=/; max-age=86400`
      router.push('/admin')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-start justify-center">
      <div className="w-full max-w-sm pt-32 px-4">
        <div className="bg-[#141414] border border-white/5 p-10">
          {/* Header */}
          <p
            style={{ fontFamily: 'var(--font-italiana)', letterSpacing: '0.2em' }}
            className="text-3xl text-white mb-2"
          >
            Nuura
          </p>
          <p className="font-sans text-xs text-white/30 tracking-widest uppercase mb-10">
            Admin Portal
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              autoComplete="email"
              className="bg-[#1A1A1A] border border-white/10 text-white placeholder-white/20 px-4 py-3 w-full focus:outline-none focus:border-white/30 font-sans text-sm transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
              className="bg-[#1A1A1A] border border-white/10 text-white placeholder-white/20 px-4 py-3 w-full focus:outline-none focus:border-white/30 font-sans text-sm transition-colors"
            />

            {error && (
              <p className="text-red-400 font-sans text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-[#0F0F0F] w-full py-3 mt-2 font-sans text-xs tracking-widest uppercase hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
