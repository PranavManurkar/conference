"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function ConferenceOverview() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Conference Overview</h1>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">About 2D MatTechGlobal</h2>
              <p className="text-slate-700 leading-relaxed">
                The 2D MatTechGlobal conference brings together leading scientists, engineers, and industry experts for
                an interdisciplinary exploration of 2D materials and their transformative applications. This premier
                event showcases cutting-edge research across energy, healthcare, electronics, and quantum technologies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Conference Highlights</h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span>500+ Expected participants from 35+ countries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span>World-class advisory committee of renowned researchers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span>Keynote presentations from industry leaders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span>Networking opportunities with global research community</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Venue & Dates</h2>
              <p className="text-slate-700 mb-2">
                <strong>Location:</strong> Indian Institute of Technology Indore, Khandwa Road, Simrol, Indore, India
              </p>
              <p className="text-slate-700">
                <strong>Dates:</strong> June 24-26, 2026
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
