'use client'

import { Calendar } from 'lucide-react'

const DateItem = ({ date, label }: { date: string; label: string }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <Calendar className="h-6 w-6 text-blue-600 mt-1" />
    </div>
    <div>
      <p className="text-lg font-semibold text-blue-900">{date}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  </div>
)

export default function KeyDates() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          <span className="text-blue-600">Important</span> Dates
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <DateItem date="March 25, 2026" label="Abstract Submission Deadline" />
          <DateItem date="April 25, 2026" label="Abstract Acceptance Notification" />
          <DateItem date="May 5, 2026" label="Early Bird Registration Opens" />
          <DateItem date="June 5, 2026" label="Final Registration Deadline" />
          <DateItem date="June 15, 2026" label="Complete Paper Submission" />
          <DateItem date="June 24-26, 2026" label="Conference Dates" />
        </div>
      </div>
    </section>
  )
}
