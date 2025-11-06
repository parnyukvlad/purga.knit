'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Logo } from './logo'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b border-[#8B0000]/20 bg-[#0a0a0a] sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors font-serif ${
                isActive('/products')
                  ? 'text-[#8B0000] border-b-2 border-[#8B0000]'
                  : 'text-[#F5F5DC]/80 hover:text-[#8B0000]'
              }`}
            >
              Products
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors font-serif ${
                isActive('/about')
                  ? 'text-[#8B0000] border-b-2 border-[#8B0000]'
                  : 'text-[#F5F5DC]/80 hover:text-[#8B0000]'
              }`}
            >
              About
            </Link>
            <Link
              href="/cart"
              className="text-sm font-medium text-[#F5F5DC]/80 hover:text-[#8B0000] flex items-center gap-1 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Cart
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/account"
                  className="text-sm font-medium text-[#F5F5DC]/80 hover:text-[#8B0000] flex items-center gap-1 transition-colors"
                >
                  <User className="w-5 h-5" />
                  Account
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-[#F5F5DC]/80 hover:text-[#8B0000] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#F5F5DC]/80 hover:text-[#8B0000] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium bg-[#8B0000] text-[#F5F5DC] px-4 py-2 rounded-md hover:bg-[#5C0000] transition-colors font-serif"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#F5F5DC]/80 hover:text-[#8B0000]"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#8B0000]/20 bg-[#0a0a0a]">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/products"
              className="block px-3 py-2 text-base font-medium text-[#F5F5DC]/80 hover:text-[#8B0000] hover:bg-[#8B0000]/10 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-[#F5F5DC]/80 hover:text-[#8B0000] hover:bg-[#8B0000]/10 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/cart"
              className="block px-3 py-2 text-base font-medium text-[#F5F5DC]/80 hover:text-[#8B0000] hover:bg-[#8B0000]/10 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart
            </Link>
            {user ? (
              <>
                <Link
                  href="/account"
                  className="block px-3 py-2 text-base font-medium text-[#F5F5DC]/80 hover:text-[#8B0000] hover:bg-[#8B0000]/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-[#F5F5DC]/80 hover:text-[#8B0000] hover:bg-[#8B0000]/10 rounded-md transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-[#F5F5DC]/80 hover:text-[#8B0000] hover:bg-[#8B0000]/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 text-base font-medium bg-[#8B0000] text-[#F5F5DC] rounded-md text-center hover:bg-[#5C0000] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

