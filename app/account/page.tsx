'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { User, MapPin, Package } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
        return
      }
      setUser(data.user)
      setLoading(false)
    })
  }, [router])

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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/account/profile"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <User className="w-8 h-8 text-gray-900 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile</h2>
              <p className="text-gray-600 text-sm">Manage your personal information</p>
            </Link>

            <Link
              href="/account/addresses"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <MapPin className="w-8 h-8 text-gray-900 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Addresses</h2>
              <p className="text-gray-600 text-sm">Manage shipping addresses</p>
            </Link>

            <Link
              href="/account/orders"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <Package className="w-8 h-8 text-gray-900 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Orders</h2>
              <p className="text-gray-600 text-sm">View order history</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

