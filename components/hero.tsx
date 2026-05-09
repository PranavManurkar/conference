'use client'
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [guestImgLoaded, setGuestImgLoaded] = useState(false)
  const pathname = usePathname()

  const guestOfHonor = {
    name: "Dr. Anil Kakodkar",
    title: "Guest of Honor",
    designations: [
      "Chancellor, Homi Bhabha National Institute",
      "Chairman, Rajiv Gandhi Science & Technology Commission",
      "Former Chairman, Atomic Energy Commission",
    ],
  }

  const carouselImages = [
    { src: "/poster1.png", alt: "Conference banner 1" },
    { src: "/poster2.jpeg", alt: "Conference banner 1" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)

  const handleDownloadBrochure = () => {
    const link = document.createElement("a")
    link.href = "/Brochure for 2DMatTech-new.pdf"
    link.download = "Brochure-2DMatTech-2026.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section
      id="home"
      className="relative overflow-hidden py-16 md:py-24 pb-8 md:pb-8 bg-[color:var(--primary-foreground)] shadow-lg"
    >
      {/* Subtle radial background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(30,58,138,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(234,179,8,0.06) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro text */}
        <div className="text-center max-w-6xl mx-auto space-y-3 mb-10">
          <p className="text-lg md:text-xl lg:text-[1.3rem] text-[color:var(--primary)] leading-relaxed">
            Join leading scientists, engineers, and industry experts for an interdisciplinary exploration of 2D
            materials and their transformative applications across energy, healthcare, electronics, and quantum
            technologies.
          </p>
          <p className="text-sm text-[color:var(--primary)]">
            Indian Institute of Technology Indore | Khandwa Road, Simrol, Indore, India
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_40rem] gap-8 items-stretch">

          {/* ── GUEST OF HONOR CARD ──────────────────────────────────── */}
          <div className="order-1 h-full">
            {/* White card matching site's color scheme */}
            <div
              className="relative h-full lg:h-[20.8rem] rounded-2xl overflow-hidden flex flex-col bg-white/80"
              style={{
                border: "1px solid rgba(var(--primary-rgb,30,58,138),0.14)",
                boxShadow: "0 4px 24px rgba(30,58,138,0.08), 0 1px 3px rgba(30,58,138,0.06)",
              }}
            >
              {/* Top primary-colored rule — matches site's --primary */}
              <div className="h-[3px] w-full bg-[color:var(--primary)]" />

              <div className="flex flex-col h-full p-5 md:p-6 gap-4">

                {/* Label — same style as other sections on site */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[color:var(--primary)]/20" />
                  <p className="text-[clamp(0.9rem,1.8vw,1.2rem)] font-bold tracking-[0.18em] uppercase text-[color:var(--primary)] whitespace-nowrap">
                    Chief Guest 
                  </p>
                  <div className="h-px flex-1 bg-[color:var(--primary)]/20" />
                </div>

                {/* Photo + Info row */}
                <div className="flex gap-5 flex-1 min-h-0">

                  {/* Photo */}
                  <div className="flex-shrink-0 w-36 md:w-44">
                    <div
                      className="relative w-full h-full min-h-[9rem] rounded-xl overflow-hidden bg-slate-100"
                      style={{
                        boxShadow: "0 0 0 2px var(--primary, #1e3a8a), 0 0 0 5px rgba(30,58,138,0.1), 0 6px 20px rgba(30,58,138,0.15)",
                      }}
                    >
                      {!guestImgLoaded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-2 bg-slate-50">
                          <svg
                            className="w-10 h-10 mb-2 text-[color:var(--primary)] opacity-30"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          <p className="text-[10px] text-slate-400 leading-snug">
                            Add photo to<br />
                            <span className="font-semibold text-[color:var(--primary)]">public/guest-of-honor.jpg</span>
                          </p>
                        </div>
                      )}
                      <Image
                        src="/guest-of-honor.png"
                        alt="Dr. Anil Kakodkar"
                        fill
                        sizes="(min-width: 1024px) 144px, 128px"
                        className="object-cover object-top"
                        priority={false}
                        onLoadingComplete={() => setGuestImgLoaded(true)}
                        onError={() => setGuestImgLoaded(false)}
                      />
                    </div>
                  </div>

                  {/* Name + details */}
                  <div className="flex flex-col justify-center gap-3">
                    <div>
                      <h2
                        className="text-2xl md:text-[1.85rem] font-bold leading-tight text-[color:var(--nav)]"
                        style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: "-0.01em" }}
                      >
                        {guestOfHonor.name}
                      </h2>
                    </div>

                    <div className="space-y-1.5">
                      {guestOfHonor.designations.map((designation, i) => (
                        <p key={i} className="text-sm md:text-base text-[color:var(--nav)]/80 font-medium leading-snug">
                          {designation}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>


              </div>

              {/* Bottom primary rule */}
              <div className="h-[3px] w-full bg-[color:var(--primary)]" />
            </div>
          </div>

          {/* ── CAROUSEL ─────────────────────────────────────────────── */}
          <div className="order-2 h-full">
            <div className="relative w-full lg:h-[20.8rem] aspect-[16/11] lg:aspect-auto">
              {/* Fixed-height carousel container — ALL slides are absolute */}
              <div
                className="relative w-full h-full rounded-xl overflow-hidden shadow-md"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(var(--primary-rgb, 30,58,138), 0.12)",
                }}
              >
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    style={{ opacity: index === currentSlide ? 1 : 0, zIndex: index === currentSlide ? 1 : 0 }}
                  >
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 40rem, 100vw"
                        className="object-contain"
                        style={{ padding: "1rem" }}
                        priority={index === 0}
                      />
                    </div>
                  </div>
                ))}

                {/* Prev / Next buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110 bg-[color:var(--primary)]/80 hover:bg-[color:var(--primary)]"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110 bg-[color:var(--primary)]/80 hover:bg-[color:var(--primary)]"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} className="text-white" />
                </button>


                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: index === currentSlide ? "1.5rem" : "0.5rem",
                        background: index === currentSlide ? "#f5c842" : "rgba(255,255,255,0.4)",
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTAs + tagline ─────────────────────────────────────────── */}
        <div className="mt-12 mb-3 flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/registration" passHref legacyBehavior>
              <button
                type="button"
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-bold text-lg px-6 py-3 rounded-lg shadow-lg transition-all duration-150 hover:shadow-xl"
              >
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

          <div className="text-center">
            <h2 className="text-4xl font-bold text-[color:var(--nav)]">
              "Join the conference and publish with{" "}
              <Link href="/paper_publish" className="text-[color:var(--primary)] hover:underline underline-offset-4">
                WILEY"
              </Link>
            </h2>
            <p className="mt-3 text-xl font-semibold text-[color:var(--nav)]">
              Opportunity to join Pre-conference{" "}
              <Link href="/workshop" className="text-[color:var(--primary)] hover:underline underline-offset-4">
                workshop
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}