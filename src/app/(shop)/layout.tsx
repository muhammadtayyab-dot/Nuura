import Navbar from '@/components/layout/Navbar'
import ConditionalFooter from '@/components/layout/ConditionalFooter'
import CartDrawer from '@/components/shop/CartDrawer'
import { PageTransition } from '@/components/shared/PageTransition'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <PageTransition>
        <main>{children}</main>
      </PageTransition>
      <ConditionalFooter />
    </>
  )
}