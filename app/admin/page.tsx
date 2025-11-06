'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Package, Users, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Check if user is admin
      const { data: userData } = await supabase
        .from('purgaknit_users')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!userData || !userData.is_admin) {
        router.push('/')
        return
      }

      setIsAdmin(true)

      // Load statistics
      const { count: ordersCount } = await supabase
        .from('purgaknit_orders')
        .select('*', { count: 'exact', head: true })

      const { data: orders } = await supabase
        .from('purgaknit_orders')
        .select('total_amount, shipping_cost, status')

      const { count: customersCount } = await supabase
        .from('purgaknit_users')
        .select('*', { count: 'exact', head: true })

      const totalRevenue = orders?.reduce((sum, order) => {
        if (order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered') {
          return sum + parseFloat(order.total_amount) + parseFloat(order.shipping_cost)
        }
        return sum
      }, 0) || 0

      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0

      setStats({
        totalOrders: ordersCount || 0,
        totalRevenue,
        totalCustomers: customersCount || 0,
        pendingOrders,
      })

      setLoading(false)
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0a0a0a] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-[#F5F5DC]">Loading...</div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0a0a0a] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-[#F5F5DC]">
              <h1 className="text-2xl font-bold mb-4 font-serif">Access Denied</h1>
              <p className="font-serif">You do not have permission to access this page.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#8B0000] mb-8 font-serif italic">Admin Dashboard</h1>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#1a1a1a] border border-[#8B0000]/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#F5F5DC]/70 font-serif">Total Orders</p>
                  <p className="text-2xl font-bold text-[#8B0000]">{stats.totalOrders}</p>
                </div>
                <Package className="w-8 h-8 text-[#8B0000]/50" />
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#8B0000]/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#F5F5DC]/70 font-serif">Total Revenue</p>
                  <p className="text-2xl font-bold text-[#8B0000]">€{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-[#8B0000]/50" />
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#8B0000]/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#F5F5DC]/70 font-serif">Total Customers</p>
                  <p className="text-2xl font-bold text-[#8B0000]">{stats.totalCustomers}</p>
                </div>
                <Users className="w-8 h-8 text-[#8B0000]/50" />
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#8B0000]/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#F5F5DC]/70 font-serif">Pending Orders</p>
                  <p className="text-2xl font-bold text-[#8B0000]">{stats.pendingOrders}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#8B0000]/50" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/products"
              className="bg-[#1a1a1a] border border-[#8B0000]/20 rounded-lg p-6 hover:border-[#8B0000]/40 transition-all"
            >
              <h2 className="text-xl font-semibold text-[#8B0000] mb-2 font-serif">Manage Products</h2>
              <p className="text-[#F5F5DC]/70 text-sm font-serif">Add, edit, or remove products</p>
            </Link>

            <Link
              href="/admin/orders"
              className="bg-[#1a1a1a] border border-[#8B0000]/20 rounded-lg p-6 hover:border-[#8B0000]/40 transition-all"
            >
              <h2 className="text-xl font-semibold text-[#8B0000] mb-2 font-serif">Manage Orders</h2>
              <p className="text-[#F5F5DC]/70 text-sm font-serif">View and update order status</p>
            </Link>

            <Link
              href="/admin/customers"
              className="bg-[#1a1a1a] border border-[#8B0000]/20 rounded-lg p-6 hover:border-[#8B0000]/40 transition-all"
            >
              <h2 className="text-xl font-semibold text-[#8B0000] mb-2 font-serif">View Customers</h2>
              <p className="text-[#F5F5DC]/70 text-sm font-serif">Browse customer information</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
