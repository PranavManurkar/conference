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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Hero />
      <ConferenceAwards />
      <InvitedSpeakersCarousel />
      <ConferenceImpact />
      <Metrics />
    </div>
  )
}
