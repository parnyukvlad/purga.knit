import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createServiceClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string; order_id?: string }
}) {
  const supabase = await createServiceClient()
  
  let order = null
  if (searchParams.order_id) {
    const { data } = await supabase
      .from('purgaknit_orders')
      .select(`
        *,
        purgaknit_order_items(
          *,
          purgaknit_items(name, image_url)
        ),
        purgaknit_shipping_addresses(*)
      `)
      .eq('id', searchParams.order_id)
      .single()
    
    order = data
  }

  // Verify Stripe session if provided
  if (searchParams.session_id && order) {
    try {
      const session = await stripe.checkout.sessions.retrieve(searchParams.session_id)
      
      if (session.payment_status === 'paid') {
        // Update order status
        await supabase
          .from('purgaknit_orders')
          .update({ status: 'paid' })
          .eq('id', order.id)
      }
    } catch (error) {
      console.error('Error verifying Stripe session:', error)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            
            {order && (
              <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-4">Order Details</h2>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Order ID:</span> #{order.id}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Total:</span> €{(order.total_amount + order.shipping_cost).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span> {order.status}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Link
                href="/account/orders"
                className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800"
              >
                View Orders
              </Link>
              <Link
                href="/products"
                className="bg-white text-gray-900 border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
