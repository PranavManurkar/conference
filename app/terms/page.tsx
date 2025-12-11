"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function Terms() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms & Conditions</h1>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Conference Registration</h2>
              <p>By registering for 2D MatTechGlobal Conference, you agree to abide by these terms and conditions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Cancellation Policy</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Cancellations before May 1, 2026: Full refund minus 10% administrative fee</li>
                <li>Cancellations between May 1 - May 31, 2026: 50% refund</li>
                <li>Cancellations after June 1, 2026: No refund</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Intellectual Property</h2>
              <p>
                Participants retain ownership of their presented work. The conference organizers may use conference
                proceedings for archival and educational purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Liability</h2>
              <p>
                The conference organizers are not responsible for lost, damaged, or stolen items during the conference.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
