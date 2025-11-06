'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
  item: {
    id: number
    name: string
    description: string | null
    price: number
    image_url: string
    stock: number
    purgaknit_categories?: { name: string; slug: string } | null
    purgaknit_sizes?: { name: string } | null
  }
}

export function ProductCard({ item }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((i: any) => i.id === item.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ id: item.id, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#8B0000]/20 rounded-lg overflow-hidden hover:border-[#8B0000]/40 transition-all group distressed-border">
      <Link href={`/products/${item.id}`}>
        <div className="relative aspect-[3/4] bg-[#0a0a0a] overflow-hidden">
          {!imageError ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#F5F5DC]/40 font-serif">
              Image not available
            </div>
          )}
          {item.stock === 0 && (
            <div className="absolute inset-0 bg-[#0a0a0a] bg-opacity-80 flex items-center justify-center">
              <span className="text-[#8B0000] font-semibold font-serif">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${item.id}`}>
          <h3 className="text-lg font-semibold text-[#F5F5DC] mb-1 line-clamp-2 font-serif">
            {item.name}
          </h3>
        </Link>
        
        {item.purgaknit_categories && (
          <p className="text-sm text-[#8B0000]/70 mb-2 font-serif">
            {item.purgaknit_categories.name}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-[#8B0000] font-serif">
            €{item.price.toFixed(2)}
          </span>
          <button
            onClick={addToCart}
            disabled={item.stock === 0}
            className="p-2 bg-[#8B0000] text-[#F5F5DC] rounded-md hover:bg-[#5C0000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

