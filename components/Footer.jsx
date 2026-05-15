import { Tv } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-[#2a2a2a] mt-20 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tv className="text-red-500" size={20} />
              <span className="text-white font-bold text-lg">Watch<span className="text-red-500">ly</span></span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              India&apos;s OTT movie discovery platform.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Discover</h4>
              <div className="flex flex-col gap-2">
                <Link href="/releases" className="text-gray-500 hover:text-white text-sm transition">OTT Releases</Link>
                <Link href="/mood" className="text-gray-500 hover:text-white text-sm transition">By Mood</Link>
                <Link href="/search" className="text-gray-500 hover:text-white text-sm transition">Search</Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#2a2a2a] mt-8 pt-6 text-center text-gray-600 text-xs">
          © 2026 Watchly. Built for Indian OTT lovers.
        </div>
      </div>
    </footer>
  )
}
