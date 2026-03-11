'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react'

const NAV_LINKS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    document.cookie = 'nuura-admin-token=; path=/; max-age=0'
    router.push('/admin/login')
  }

  // Login page renders without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-[#0F0F0F] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[#141414] border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="px-6 pt-8 pb-0">
          <p
            style={{ fontFamily: 'var(--font-italiana)', letterSpacing: '0.2em' }}
            className="text-xl text-white"
          >
            Nuura
          </p>
          <p className="font-sans text-[10px] text-white/30 tracking-widest uppercase mt-1">
            Admin
          </p>
          <div className="border-b border-white/5 mt-4 mb-6" />
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 flex-1">
          {NAV_LINKS.map(({ icon: Icon, label, href }) => {
            const isActive =
              href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'flex items-center gap-3 px-4 py-3 rounded-sm font-sans text-sm transition-all duration-150',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-6 py-6 flex flex-col gap-3 border-t border-white/5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-sans text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <ExternalLink size={12} strokeWidth={1.5} />
            View Store
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-sans text-xs text-white/30 hover:text-white/60 transition-colors text-left"
          >
            <LogOut size={12} strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0F0F0F]">{children}</main>
    </div>
  )
}
