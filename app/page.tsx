import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CookieConsent } from '@/components/cookie-consent'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Handmade Knitted Items
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Discover unique, quality pieces crafted with care and passion. 
                Each item is made by hand with attention to detail.
              </p>
              <Link
                href="/products"
                className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Placeholder for featured products */}
              <div className="bg-gray-100 aspect-[3/4] rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Product Image</p>
              </div>
              <div className="bg-gray-100 aspect-[3/4] rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Product Image</p>
              </div>
              <div className="bg-gray-100 aspect-[3/4] rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Product Image</p>
              </div>
            </div>
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="text-gray-900 font-medium hover:underline"
              >
                View All Products →
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About purga.knit
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We create beautiful, handmade knitted items with love and attention to detail. 
                Each piece is unique and crafted to bring warmth and style to your everyday life.
              </p>
              <Link
                href="/about"
                className="inline-block text-gray-900 font-medium hover:underline"
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
