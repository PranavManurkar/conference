"use client"

import Link from "next/link"

export default function CommitteePage() {
  return (
    <div className="min-h-screen bg-[color:var(--primary-foreground)]">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="bg-[color:var(--primary-foreground)] rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[color:var(--nav)] mb-6">Committee</h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/committee/international"
              className="rounded-xl border border-[color:var(--nav)]/10 bg-white p-6 shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold text-[color:var(--nav)]">
                <span className="text-[color:var(--primary)]">International</span> Advisory Committee
              </h2>
              <p className="mt-2 text-sm text-[color:var(--nav)]/70">
                View the international advisory members
              </p>
            </Link>
            <Link
              href="/committee/organizing"
              className="rounded-xl border border-[color:var(--nav)]/10 bg-white p-6 shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold text-[color:var(--nav)]">Organizing Committee</h2>
              <p className="mt-2 text-sm text-[color:var(--nav)]/70">
                View the organizing committee members
              </p>
            </Link>
            <Link
              href="/committee/global-connect"
              className="rounded-xl border border-[color:var(--nav)]/10 bg-white p-6 shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold text-[color:var(--nav)]">Global Connect Committee</h2>
              <p className="mt-2 text-sm text-[color:var(--nav)]/70">
                View the Global Connect committee members
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
