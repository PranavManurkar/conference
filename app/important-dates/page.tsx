"use client"

import { Calendar, CheckCircle2 } from "lucide-react"

export default function ImportantDatesPage() {
  const dates = [
    {
      date: "May 15, 2026",
      title: "Abstract Submission Deadline (Extended)",
      description: "On popular demand and upon receiving multiple requests from participants, the abstract submission deadline has been extended to 15th May 2026. Kindly note that all other dates remain unchanged.",
    },
    {
      date: "May 16, 2026",
      title: "Abstract Acceptance Notification",
      description: "Decisions on submitted abstracts will be communicated to authors",
    },
    {
      date: "May 20, 2026",
      title: "Early Bird Registration Deadline",
      description: "Register early and avail discounted registration fees",
    },
    {
      date: "June 5, 2026",
      title: "Final Registration Deadline",
      description: "Last date for registration at standard rates",
    },
    {
      date: "June 24-26, 2026",
      title: "Conference Dates",
      description: "Three-day international conference at IIT Indore campus",
    },
  ]

  return (
    <div className="min-h-screen bg-[color:var(--primary-foreground)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="h-1 w-12 bg-[var(--primary)] rounded" />
          </div>
          <h1 className="text-4xl font-bold text-[color:var(--nav)] mb-4">
            <span className="text-[color:var(--primary)]">Important </span>Dates</h1>
          <p className="text-[color:var(--nav)]/80 text-lg">Key milestones and deadlines for the 2D MatTechGlobal 2026 Conference</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--primary)]/10 px-4 py-2 text-sm font-medium text-[color:var(--nav)]">
            Abstract deadline extended to 15th May 2026
          </div>
        </div>

        <div className="space-y-6">
          {dates.map((event, index) => (
            <div
              key={index}
              className="bg-[color:var(--primary-foreground)] rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-[color:var(--primary)]"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[color:var(--primary)]/10">
                    <Calendar className="h-6 w-6 text-[color:var(--primary)]" />
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-[color:var(--primary)] uppercase tracking-wide">{event.date}</p>
                  <h3 className="text-xl font-bold text-[color:var(--nav)] mt-1">{event.title}</h3>
                  <p className="text-[color:var(--nav)]/80 mt-2">{event.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
