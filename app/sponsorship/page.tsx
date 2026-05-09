"use client"

import Sponsorship from "@/components/sponsorship"

export default function SponsorshipPage() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-0">Sponsorship Opportunities</h1>
      </div>

      <div className="mt-8">
        <Sponsorship />
      </div>
    </div>
  )
}
