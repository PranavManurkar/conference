"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function CodeOfConduct() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Code of Conduct</h1>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Our Commitment</h2>
              <p>
                2D MatTechGlobal Conference is committed to providing a welcoming, inclusive, and respectful environment
                for all participants.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Expected Behavior</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Treat all participants with respect and professionalism</li>
                <li>Refrain from harassment, discrimination, or offensive behavior</li>
                <li>Respect intellectual property and confidentiality</li>
                <li>Follow conference rules and venue policies</li>
                <li>Support a collaborative and constructive environment</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Reporting Violations</h2>
              <p>
                If you witness or experience inappropriate behavior, please report it to the conference organizers
                immediately. All reports will be handled confidentially.
              </p>
              <p className="mt-2">Email: conduct@2dmatech.iiti.ac.in</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Consequences</h2>
              <p>Violations of this code of conduct may result in removal from the conference without refund.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
