"use client"

import { useState } from "react"
import InternationalAdvisoryCarousel from "@/components/international-advisory-carousel"
import OrganisingCommitteeCarousel from "@/components/organising-committee-carousel"

export default function CommitteePage() {
  const [activeTab, setActiveTab] = useState("international")

  return (
    <div className="min-h-screen bg-[color:var(--nav)]/5">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <h1 className="text-4xl font-bold text-[color:var(--nav)] mb-8">Committee</h1>

        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("international")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "international"
                ? "bg-[color:var(--primary)] text-white shadow-lg"
                : "bg-[color:var(--primary-foreground)] text-[color:var(--nav)] border-2 border-[color:var(--primary)] hover:bg-[color:var(--primary)]/10"
            }`}
          >
            International Advisory Committee
          </button>
          <button
            onClick={() => setActiveTab("organising")}
            className={`hidden px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "organising"
                ? "bg-[color:var(--primary)] text-white shadow-lg"
                : "bg-[color:var(--primary-foreground)] text-[color:var(--nav)] border-2 border-[color:var(--primary)] hover:bg-[color:var(--primary)]/10"
            }`}
          >
            Organising Committee
          </button>
        </div>

        <div className="bg-[color:var(--primary-foreground)] rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[color:var(--nav)] mb-8">
            {activeTab === "international" ? "International Advisory Committee" : "Organising Committee"}
          </h2>

          {activeTab === "international" ? <InternationalAdvisoryCarousel /> : <OrganisingCommitteeCarousel />}
        </div>
      </div>
    </div>
  )
}
