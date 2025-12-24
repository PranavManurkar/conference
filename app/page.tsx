"use client"

import { useState, useEffect } from "react"
import Hero from "@/components/hero"
import Metrics from "@/components/metrics"
import InvitedSpeakersCarousel from "@/components/invited-speakers-carousel"
import ConferenceImpact from "@/components/conference-impact"
import ConferenceAwards from "@/components/conference-awards"
import PageLoader from "@/components/page-loader"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if this is a page reload or navigation
    // Global variables are cleared on page reload but persist on navigation
    const homePageVisited = (window as any).homePageVisited

    if (!homePageVisited) {
      // First load or page reload - show loader
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
        ;(window as any).homePageVisited = true
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen ">
      <Hero />
      <InvitedSpeakersCarousel />
      <ConferenceImpact />
       <ConferenceAwards />
      <Metrics />
      {/* Contact Us Call to Action */}
      <div className="mt-16 flex flex-col items-center justify-center pb-12">
        <p className="text-lg text-[color:var(--nav)] mb-4 text-center max-w-xl">
          Have questions or need more information? We're here to help!
        </p>
        <a href="/contact" className="inline-block">
          <button className="px-8 py-3 cursor-pointer bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-bold rounded-lg shadow-md hover:bg-[color:var(--navhover)] hover:text-white transition-colors duration-200">
            Contact Us
          </button>
        </a>
      </div>
    </div>
  )
}
