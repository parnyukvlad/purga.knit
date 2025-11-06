import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CookieConsent } from '@/components/cookie-consent'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0a]">
        {/* Hero Section */}
        <section className="relative py-20 vintage-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#8B0000] mb-6 font-serif italic grunge-text">
                Handmade Knitted Items
              </h1>
              <p className="text-xl text-[#5C0000]/90 mb-8 max-w-2xl mx-auto font-serif">
                Discover unique, quality pieces crafted with care and passion. 
                Each item is made by hand with attention to detail.
              </p>
              <Link
                href="/products"
                className="inline-block bg-[#8B0000] text-[#F5F5DC] px-8 py-3 rounded-md text-lg font-medium hover:bg-[#5C0000] transition-colors font-serif"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-[#8B0000] text-center mb-12 font-serif italic">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Placeholder for featured products */}
              <div className="bg-[#1a1a1a] border border-[#8B0000]/20 aspect-[3/4] rounded-lg flex items-center justify-center distressed-border">
                <p className="text-[#F5F5DC]/40 font-serif">Product Image</p>
              </div>
              <div className="bg-[#1a1a1a] border border-[#8B0000]/20 aspect-[3/4] rounded-lg flex items-center justify-center distressed-border">
                <p className="text-[#F5F5DC]/40 font-serif">Product Image</p>
              </div>
              <div className="bg-[#1a1a1a] border border-[#8B0000]/20 aspect-[3/4] rounded-lg flex items-center justify-center distressed-border">
                <p className="text-[#F5F5DC]/40 font-serif">Product Image</p>
              </div>
            </div>
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="text-[#8B0000] font-medium hover:text-[#5C0000] transition-colors font-serif"
              >
                View All Products →
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 vintage-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-[#8B0000] mb-6 font-serif italic grunge-text">
                About PURGA*
              </h2>
              <p className="text-lg text-[#5C0000]/90 mb-8 font-serif">
                We create beautiful, handmade knitted items with love and attention to detail. 
                Each piece is unique and crafted to bring warmth and style to your everyday life.
              </p>
              <Link
                href="/about"
                className="inline-block text-[#8B0000] font-medium hover:text-[#5C0000] transition-colors font-serif"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CookieConsent />
    </>
  )
}
