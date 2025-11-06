'use client'

import Link from 'next/link'
import Image from 'next/image'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative">
        <span className="font-serif text-3xl md:text-4xl font-bold italic text-[#8B0000] grunge-text tracking-tight">
          PURGA
        </span>
        <span className="font-serif text-2xl md:text-3xl font-bold italic text-[#8B0000] ml-1 align-sub">
          *
        </span>
      </div>
      <span className="text-xs md:text-sm text-[#8B0000]/70 font-serif italic mt-2 hidden sm:block">
        EST.2024
      </span>
    </Link>
  )
}

