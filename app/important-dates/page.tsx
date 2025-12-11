"use client"

import { Calendar, CheckCircle2 } from "lucide-react"

export default function ImportantDatesPage() {
  const dates = [
    {
      date: "March 25, 2026",
      title: "Abstract Submission Deadline",
      description: "Submit your research abstracts (200-250 words) through the online portal",
    },
    {
      date: "April 25, 2026",
      title: "Abstract Acceptance Notification",
      description: "Decisions on submitted abstracts will be communicated to authors",
    },
    {
      date: "May 5, 2026",
      title: "Early Bird Registration Opens",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Important Dates</h1>
          <p className="text-gray-600 text-lg">Key milestones and deadlines for the 2D MatTechGlobal 2026 Conference</p>
        </div>

        <div className="space-y-6">
          {dates.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-600"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">{event.date}</p>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{event.title}</h3>
                  <p className="text-gray-600 mt-2">{event.description}</p>
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
