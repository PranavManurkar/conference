'use client'
import { useState, useEffect } from "react"
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
export default function Hero() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const pathname = usePathname()

  const carouselImages = [
    { src: "/poster1.png", alt: "Conference banner 1" },
    { src: "/Poster presentation.png", alt: "Conference banner 2" },
    { src: "/ORAL presentation.png", alt: "Conference banner 3" },
    { src: "/thesis.jpeg", alt: "Conference banner 4" },
  ]

  // Auto-rotate carousel with 5 second delay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }
  const handleDownloadBrochure = () => {
    const link = document.createElement("a")
    link.href = "/Brochure for 2DMatTech - 2025-03-05.pdf"
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
          {/* Carousel: appears above text on mobile, right on desktop */}
          <div className="order-1 md:order-2 flex items-center justify-center mb-6 md:mb-0">
            <div className="relative w-full h-auto max-w-2xl">
              {/* Carousel Container */}
              <div className="relative w-full border border-yellow-400 border-opacity-30 rounded-xl shadow-2xl bg-slate-800 overflow-hidden">
                {/* Images */}
                <div className="relative w-full">
                  {carouselImages.map((image, index) => (
                    <div
                      key={index}
                      className={`transition-opacity duration-700 ${
                        index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={800}
                        height={550}
                        className="object-contain object-center border-3 border-[color:var(--primary)] rounded-lg shadow-lg w-full h-auto"
                        priority={index === 0}
                        sizes="(min-width: 768px) 40vw, 100vw"
                      />
                    </div>
                  ))}
                </div>

                {/* Left Arrow */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[color:var(--primary)]/80 hover:bg-[color:var(--primary)] text-white p-2 rounded-full z-10 transition-all duration-200 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[color:var(--primary)]/80 hover:bg-[color:var(--primary)] text-white p-2 rounded-full z-10 transition-all duration-200 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
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
