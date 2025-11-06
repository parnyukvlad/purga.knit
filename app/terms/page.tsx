import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for purga.knit',
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using purga.knit, you accept and agree to be bound by these Terms of Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Products and Pricing</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to change product prices and availability at any time. All prices are in EUR (€).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Orders and Payment</h2>
                <p className="text-gray-700 mb-4">
                  All orders are subject to acceptance. Payment is processed securely through Stripe. 
                  We reserve the right to refuse or cancel any order.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Shipping</h2>
                <p className="text-gray-700 mb-4">
                  Shipping costs are calculated at checkout. For Czech Republic, shipping is €10 flat rate. 
                  For other countries, please contact us at{' '}
                  <a href="https://instagram.com/purga.knit" className="text-gray-900 underline" target="_blank" rel="noopener noreferrer">
                    @purga.knit
                  </a> on Instagram.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Returns and Refunds</h2>
                <p className="text-gray-700 mb-4">
                  Returns are accepted within 14 days of delivery. Items must be unused and in original condition. 
                  Contact us for return instructions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  All content on this website, including images, text, and logos, is the property of purga.knit 
                  and protected by copyright laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  purga.knit shall not be liable for any indirect, incidental, or consequential damages 
                  arising from the use of our products or services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
                <p className="text-gray-700">
                  For questions about these Terms, contact us at{' '}
                  <a href="mailto:info@purga.knit" className="text-gray-900 underline">info@purga.knit</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

