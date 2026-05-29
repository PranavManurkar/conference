"use client"

import GlobalConnectCommittee from "@/components/global-connect-committee"

export default function GlobalConnectCommitteePage() {
  return (
    <div className="min-h-screen bg-[color:var(--primary-foreground)]">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="bg-[color:var(--primary-foreground)] rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[color:var(--nav)] mb-8">Global Connect Committee</h1>
          <GlobalConnectCommittee />
        </div>
      </div>
    </div>
  )
}
