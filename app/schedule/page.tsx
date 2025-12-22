"use client"

export default function SchedulePage() {
  const schedule = [
    {
      day: "Day 1 - June 24, 2026",
      events: [
        { time: "08:00 AM", activity: "Registration & Welcome Tea" },
        { time: "09:00 AM", activity: "Inaugural Ceremony & Key Notes" },
        { time: "10:30 AM", activity: "Coffee Break" },
        { time: "11:00 AM", activity: "Parallel Sessions (A, B, C, D)" },
        { time: "01:00 PM", activity: "Lunch Break" },
        { time: "02:00 PM", activity: "Parallel Sessions (A, B, C, D)" },
        { time: "04:00 PM", activity: "Tea Break" },
        { time: "04:30 PM", activity: "Invited Lectures & Panel Discussion" },
        { time: "06:00 PM", activity: "Welcome Reception & Networking" },
      ],
    },
    {
      day: "Day 2 - June 25, 2026",
      events: [
        { time: "09:00 AM", activity: "Parallel Sessions (A, B, C, D)" },
        { time: "10:30 AM", activity: "Coffee Break" },
        { time: "11:00 AM", activity: "Parallel Sessions (A, B, C, D)" },
        { time: "01:00 PM", activity: "Lunch Break" },
        { time: "02:00 PM", activity: "Parallel Sessions (A, B, C, D)" },
        { time: "04:00 PM", activity: "Tea Break" },
        { time: "04:30 PM", activity: "Invited Lectures & Technical Symposium" },
        { time: "06:30 PM", activity: "Banquet & Cultural Program" },
      ],
    },
    {
      day: "Day 3 - June 26, 2026",
      events: [
        { time: "09:00 AM", activity: "Parallel Sessions (A, B, C, D)" },
        { time: "10:30 AM", activity: "Coffee Break" },
        { time: "11:00 AM", activity: "Parallel Sessions (A, B, C, D)" },
        { time: "01:00 PM", activity: "Lunch Break" },
        { time: "02:00 PM", activity: "Keynote Addresses & Panel Discussion" },
        { time: "03:30 PM", activity: "Awards & Closing Ceremony" },
        { time: "04:00 PM", activity: "High Tea & Networking" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Coming Soon</h1>
        {/* <p className="text-gray-600 text-center mb-12">2D MatTechGlobal 2026 - June 24-26, 2026</p>

        <div className="space-y-8">
          {schedule.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <h2 className="text-2xl font-bold text-white">{day.day}</h2>
              </div>

              <div className="divide-y">
                {day.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="flex p-6 hover:bg-blue-50 transition-colors">
                    <div className="flex-shrink-0 w-24">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
                        {event.time}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-900 font-semibold">{event.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-8 border-l-4 border-blue-600">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Conference Details</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Total sessions: 12 parallel sessions covering 4 major themes</li>
            <li>• Poster presentations available throughout the conference</li>
            <li>• Networking events scheduled for maximum collaboration opportunities</li>
            <li>• All sessions will be held at IIT Indore campus</li>
            <li>• Accommodation available at nearby hotels</li>
          </ul>
        </div> */}
      </div>
    </div>
  )
}
