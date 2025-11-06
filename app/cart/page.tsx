'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCart = async () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(cart)

      if (cart.length > 0) {
        const itemIds = cart.map((item: any) => item.id)
        const { data } = await supabase
          .from('purgaknit_items')
          .select('*')
          .in('id', itemIds)
        
        setProducts(data || [])
      }
      
      setLoading(false)
    }

    loadCart()

    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener('cart-updated', handleCartUpdate)
    return () => window.removeEventListener('cart-updated', handleCartUpdate)
  }, [])

  const updateQuantity = (itemId: number, change: number) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const item = cart.find((i: any) => i.id === itemId)
    
    if (item) {
      item.quantity = Math.max(1, item.quantity + change)
      localStorage.setItem('cart', JSON.stringify(cart))
      setCartItems(cart)
      window.dispatchEvent(new Event('cart-updated'))
    }
  }

  const removeItem = (itemId: number) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const newCart = cart.filter((i: any) => i.id !== itemId)
    localStorage.setItem('cart', JSON.stringify(newCart))
    setCartItems(newCart)
    window.dispatchEvent(new Event('cart-updated'))
  }

  const getTotal = () => {
    return cartItems.reduce((total, cartItem) => {
      const product = products.find((p) => p.id === cartItem.id)
      return total + (product?.price || 0) * cartItem.quantity
    }, 0)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <Link
                href="/products"
                className="inline-block bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                  {cartItems.map((cartItem) => {
                    const product = products.find((p) => p.id === cartItem.id)
                    if (!product) return null

                    return (
                      <div key={cartItem.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                        <div className="relative w-24 h-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">€{product.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(cartItem.id, -1)}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{cartItem.quantity}</span>
                            <button
                              onClick={() => updateQuantity(cartItem.id, 1)}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeItem(cartItem.id)}
                              className="ml-auto p-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>€{getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>€10.00</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span>€{(getTotal() + 10).toFixed(2)}</span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="block w-full bg-gray-900 text-white text-center py-3 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

