'use client'
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
export default function Hero() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const handleDownloadBrochure = () => {
    const link = document.createElement("a")

    // Option 1: Use your local PDF in the public folder
    // Add your brochure PDF to: /public/brochure.pdf
    // Then use: link.href = "/brochure.pdf"

    // Option 2: Use an environment variable for production
    // Create .env.local with: NEXT_PUBLIC_BROCHURE_URL=your-url
    // Then use: link.href = process.env.NEXT_PUBLIC_BROCHURE_URL || "/brochure.pdf"

    // Option 3: Current setup (blob URL from v0)
    // Replace this URL with your own PDF URL
    link.href =
      "https://blobs.vusercontent.net/blob/Brochure%20for%202DMatTech%20-%202025-11-09-6IHhq5WV3Q4GkPNSWHBvPGb3qrlCUJ.pdf"

    link.download = "C:\Users\prana\OneDrive\Desktop\conference\public\Brochure for 2DMatTech - 2025-11-09.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
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
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 py-24 md:py-40">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Conference Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight text-balance">
              2D MatTechGlobal 2026
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-100">
              Fundamentals to Applications
            </h2>
          </div>

          {/* Date Badge */}
          <div className="inline-flex items-center justify-center">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-8 py-4 rounded-full font-bold text-xl shadow-lg">
              June 24-26, 2026
            </div>
          </div>

          {/* Description */}
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed text-pretty">
            Join leading scientists, engineers, and industry experts for an interdisciplinary exploration of 2D materials and their transformative applications across energy, healthcare, electronics, and quantum technologies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
                href="/registration">
            <button className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
              Register Now
            </button></Link>
            <button
              onClick={handleDownloadBrochure}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              Download Brochure
            </button>
          </div>

          {/* Venue Info */}
          <p className="text-blue-200 text-base font-medium pt-4">
            📍 Indian Institute of Technology Indore | Khandwa Road, Simrol, Indore, India
          </p>
        </div>
      </div>
    </section>
  )
}
