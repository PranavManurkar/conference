"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function PrivacyPolicy() {
  return (
    <>
      {/* <Navigation /> */}
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Introduction</h2>
              <p>
                This Privacy Policy governs how 2D MatTechGlobal Conference collects, uses, and protects personal
                information provided by participants.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Information We Collect</h2>
              <p>We collect information such as:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Name, email, and contact information</li>
                <li>Affiliation and professional background</li>
                <li>Registration preferences</li>
                <li>Payment information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Data Protection</h2>
              <p>
                We implement appropriate security measures to protect your personal information from unauthorized
                access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Contact Us</h2>
              <p>For privacy-related inquiries, contact: privacy@2dmatech.iiti.ac.in</p>
            </section>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  )
}
