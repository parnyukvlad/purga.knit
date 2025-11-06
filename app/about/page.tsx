import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'About',
  description: 'Learn about purga.knit - Handmade knitted items',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">About purga.knit</h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">
                Welcome to purga.knit, where handmade meets quality. We specialize in creating beautiful, 
                unique knitted items crafted with care and attention to detail.
              </p>
              
              <p className="text-gray-700 mb-4">
                Each piece in our collection is handmade, ensuring that no two items are exactly alike. 
                We use high-quality materials and traditional techniques to create products that are both 
                beautiful and durable.
              </p>
              
              <p className="text-gray-700 mb-4">
                Based in the Czech Republic, we serve customers throughout Europe, bringing warmth and style 
                to your everyday life through our carefully crafted knitted items.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                Our mission is to create high-quality, handmade knitted items that bring joy and comfort 
                to our customers while supporting sustainable, traditional craftsmanship.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Contact Us</h2>
              <p className="text-gray-700 mb-2">
                Have questions or want to learn more? Reach out to us:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Email: <a href="mailto:info@purga.knit" className="text-gray-900 underline">info@purga.knit</a></li>
                <li>Instagram: <a href="https://instagram.com/purga.knit" className="text-gray-900 underline" target="_blank" rel="noopener noreferrer">@purga.knit</a></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

