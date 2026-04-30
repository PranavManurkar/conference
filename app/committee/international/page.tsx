"use client"

import InternationalAdvisoryCarousel from "@/components/international-advisory-carousel"

export default function InternationalCommitteePage() {
  return (
    <div className="min-h-screen bg-[color:var(--primary-foreground)]">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="bg-[color:var(--primary-foreground)] rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[color:var(--nav)] mb-8">
            <span className="text-[color:var(--primary)]">International</span> Advisory Committee
          </h1>
          <InternationalAdvisoryCarousel />
        </div>
      </div>
    </div>
  )
}
