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

    link.download = "Brochure-2DMatTech-2025.pdf"
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
    <section id="home" className="relative overflow-hidden py-16 md:py-24 bg-[color:var(--primary-foreground)] shadow-lg">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {/* <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl" /> */}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Banner image: appears above text on mobile, right on desktop */}
          <div className="order-1 md:order-2 flex items-center justify-center mb-6 md:mb-0">
            <div className="relative w-auto h-auto border border-yellow-400 border-opacity-30 rounded-xl shadow-2xl bg-slate-800">
              <Image
                src="/poster1.png"
                alt="Conference banner"
                width={800}
                height={550}
                className="object-contain object-center border-3 border-[color:var(--primary)] rounded-lg shadow-lg"
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
          </div>

          {/* Text content: below image on mobile, left on desktop */}
          <div className="order-2 md:order-1 space-y-6 md:pr-8">
            <p className="text-xl text-[color:var(--primary)] max-w-xl leading-relaxed">
              Join leading scientists, engineers, and industry experts for an interdisciplinary exploration of 2D materials and their transformative applications across energy, healthcare, electronics, and quantum technologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/registration" passHref legacyBehavior>
                <button type="button" className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-bold text-lg px-6 py-3 rounded-lg shadow-lg transition-all duration-150 hover:shadow-xl">
                  Register Now
                </button>
              </Link>
              <button
                type="button"
                onClick={handleDownloadBrochure}
                className="border-2 border-[color:var(--primary)] text-[color:var(--primary)] hover:bg-[color:var(--primary)] hover:text-white font-bold text-lg px-6 py-3 rounded-lg transition-all duration-150 hover:shadow-lg"
              >
                Download Brochure
              </button>
            </div>
            <p className="text-sm text-[color:var(--primary)] pt-2">
              📍 Indian Institute of Technology Indore | Khandwa Road, Simrol, Indore, India
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
