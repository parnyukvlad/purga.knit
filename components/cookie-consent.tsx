'use client'

import { useEffect, useState } from 'react'
import { X, Cookie } from 'lucide-react'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setShowBanner(false)
  }

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-[#8B0000]/20 shadow-lg p-4 vintage-bg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-5 h-5 text-[#8B0000] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-[#F5F5DC] font-medium mb-1 font-serif">
              Cookie Consent
            </p>
            <p className="text-sm text-[#F5F5DC]/70 font-serif">
              We use cookies to enhance your browsing experience and analyze site traffic. 
              By clicking &quot;Accept&quot;, you consent to our use of cookies. 
              <a href="/privacy" className="underline ml-1 text-[#8B0000] hover:text-[#5C0000]">Learn more</a>
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 text-sm font-medium text-[#F5F5DC]/70 bg-[#1a1a1a] border border-[#8B0000]/30 rounded-md hover:bg-[#8B0000]/10 hover:text-[#8B0000] transition-colors font-serif"
          >
            Reject
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm font-medium text-[#F5F5DC] bg-[#8B0000] rounded-md hover:bg-[#5C0000] transition-colors font-serif"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

