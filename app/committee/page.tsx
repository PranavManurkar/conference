"use client"

import { useState } from "react"
import InternationalAdvisoryCarousel from "@/components/international-advisory-carousel"
import OrganisingCommitteeCarousel from "@/components/organising-committee-carousel"

export default function CommitteePage() {
  const [activeTab, setActiveTab] = useState("international")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Committee</h1>

        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("international")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "international"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-900 border-2 border-blue-600 hover:bg-blue-50"
            }`}
          >
            International Advisory Committee
          </button>
          <button
            onClick={() => setActiveTab("organising")}
            className={`hidden px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "organising"
                ? "bg-gradient-to-r from-slate-600 to-slate-800 text-white shadow-lg"
                : "bg-white text-gray-900 border-2 border-slate-600 hover:bg-slate-50"
            }`}
          >
            Organising Committee
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {activeTab === "international" ? "International Advisory Committee" : "Organising Committee"}
          </h2>

          {activeTab === "international" ? <InternationalAdvisoryCarousel /> : <OrganisingCommitteeCarousel />}
        </div>
      </div>
    </div>
  )
}
