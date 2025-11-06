import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for purga.knit',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  purga.knit (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                <p className="text-gray-700 mb-2">We collect information that you provide directly to us:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Account credentials</li>
                  <li>Order history and preferences</li>
                </ul>
                <p className="text-gray-700 mb-2">We automatically collect certain information:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Device information and IP address</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 mb-2">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and account</li>
                  <li>Improve our website and services</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Protection Rights (GDPR)</h2>
                <p className="text-gray-700 mb-4">
                  If you are a resident of the European Economic Area (EEA), you have certain data protection rights:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Right to Access:</strong> You can request copies of your personal data</li>
                  <li><strong>Right to Rectification:</strong> You can request correction of inaccurate data</li>
                  <li><strong>Right to Erasure:</strong> You can request deletion of your personal data</li>
                  <li><strong>Right to Restrict Processing:</strong> You can request restriction of processing</li>
                  <li><strong>Right to Data Portability:</strong> You can request transfer of your data</li>
                  <li><strong>Right to Object:</strong> You can object to our processing of your data</li>
                </ul>
                <p className="text-gray-700">
                  To exercise these rights, please contact us at{' '}
                  <a href="mailto:info@purga.knit" className="text-gray-900 underline">info@purga.knit</a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies to enhance your browsing experience. You can control cookie preferences through your browser settings. 
                  For more information, see our Cookie Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal data. 
                  However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
                <p className="text-gray-700">
                  If you have questions about this Privacy Policy, please contact us at{' '}
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

