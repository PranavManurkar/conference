"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Our Sponsors", href: "/sponsors" },
    { label: "Paper Submission", href: "/paper-submission" },
    { label: "Registration", href: "/registration" },
    { label: "Committee", href: "/committee" },
    { label: "Schedule", href: "/schedule" },
    { label: "Important Dates", href: "/important-dates" },
    { label: "Accommodation", href: "/accommodation" },
    { label: "Sponsorship Opportunities", href: "/sponsorship" },
  ]

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <nav className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 shadow-2xl">
        <div className="w-full px-6 lg:px-12">
          <div className="flex justify-between items-center h-24">
            {/* Left: IIT Indore Logo and Name */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image src="/iiti-logo.svg" alt="IIT Indore Logo" width={64} height={64} className="object-contain" />
              </div>
              <div className="hidden sm:flex flex-col justify-center">
                <h2 className="text-white font-bold text-sm leading-tight">भारतीय प्रौद्योगिकी संस्थान</h2>
                <p className="text-blue-100 font-semibold text-xs">Indian Institute of Technology</p>
                <p className="text-blue-100 font-semibold text-xs">Indore</p>
              </div>
            </Link>

            <div className="flex-1"></div>

            {/* Right: 2D MatTechGlobal Branding */}
            <div className="hidden lg:flex flex-col items-end justify-center space-y-1">
              <h1 className="text-xl font-bold text-white">2D MatTechGlobal</h1>
              <p className="text-blue-100 text-xs font-semibold">Fundamentals to Applications</p>
              <p className="text-blue-200 text-xs">June 24-26, 2026</p>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden ml-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-blue-800 transition-colors duration-200"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900 via-slate-800 to-blue-900 shadow-xl border-t border-blue-800">
        <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center">
            <div className="hidden lg:flex items-center flex-wrap justify-start flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-4 text-sm font-semibold transition-all duration-300 border-b-4 whitespace-nowrap flex-1 text-center ${
                    isActive(item.href)
                      ? "text-blue-200 border-b-blue-400 bg-blue-800 bg-opacity-30"
                      : "text-gray-200 border-b-transparent hover:text-blue-200 hover:border-b-blue-400 hover:bg-blue-800 hover:bg-opacity-20"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:block ml-4">
              <Link
                href="/registration"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                Register
              </Link>
            </div>
          </div>

          {isOpen && (
            <div className="lg:hidden pb-4 space-y-2 border-t border-blue-700 animate-in fade-in slide-in-from-top-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "text-gray-200 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 hover:text-white"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
