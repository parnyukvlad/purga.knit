import Link from 'next/link'
import { Instagram, Mail } from 'lucide-react'
import { Logo } from './logo'

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#8B0000]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-[#F5F5DC]/70 text-sm mb-4 font-serif">
              Handmade knitted items crafted with care and passion.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/purga.knit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5F5DC]/70 hover:text-[#8B0000] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@purga.knit"
                className="text-[#F5F5DC]/70 hover:text-[#8B0000] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-[#8B0000] mb-4 font-serif">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-[#F5F5DC]/70 hover:text-[#8B0000] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=clothing" className="text-sm text-[#F5F5DC]/70 hover:text-[#8B0000] transition-colors">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-sm text-[#F5F5DC]/70 hover:text-[#8B0000] transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-[#8B0000] mb-4 font-serif">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-[#F5F5DC]/70 hover:text-[#8B0000] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-[#F5F5DC]/70 hover:text-[#8B0000] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-[#F5F5DC]/70 hover:text-[#8B0000] transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[#8B0000]/20">
          <p className="text-center text-sm text-[#F5F5DC]/50 font-serif">
            © {new Date().getFullYear()} PURGA*. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

