'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/account')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0a] py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1a1a1a] border border-[#8B0000]/20 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-[#8B0000] mb-6 font-serif italic">Login</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-[#8B0000]/20 border border-[#8B0000] rounded-md">
                <p className="text-sm text-[#8B0000] font-serif">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#F5F5DC] mb-1 font-serif">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#8B0000]/30 text-[#F5F5DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000] placeholder:text-[#F5F5DC]/40"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#F5F5DC] mb-1 font-serif">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#8B0000]/30 text-[#F5F5DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000] placeholder:text-[#F5F5DC]/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B0000] text-[#F5F5DC] py-2 px-4 rounded-md hover:bg-[#5C0000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-serif"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#F5F5DC]/70 font-serif">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-[#8B0000] font-medium hover:text-[#5C0000] transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

