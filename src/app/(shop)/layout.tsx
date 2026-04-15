import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/shop/CartDrawer'
import { NuuraChatbot } from '@/components/chat/NuuraChatbot'
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
      <NuuraChatbot />
      <PageTransition>
        <main>{children}</main>
      </PageTransition>
      <Footer />
    </>
  )
}