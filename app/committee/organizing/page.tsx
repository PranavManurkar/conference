"use client"

import OrganisingCommitteeCarousel from "@/components/organising-committee-carousel"

export default function OrganizingCommitteePage() {
  return (
    <div className="min-h-screen bg-[color:var(--primary-foreground)]">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="bg-[color:var(--primary-foreground)] rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[color:var(--nav)] mb-8">Organizing Committee</h1>
          <OrganisingCommitteeCarousel />
        </div>
      </div>
    </div>
  )
}
