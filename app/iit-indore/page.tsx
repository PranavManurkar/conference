"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function IITIndore() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Indian Institute of Technology Indore</h1>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">About IIT Indore</h2>
              <p className="text-slate-700 leading-relaxed">
                Indian Institute of Technology Indore is one of the premier technical institutes in India, established
                to impart world-class education and conduct cutting-edge research. The institute is committed to
                fostering innovation and excellence in science and engineering.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">MEMS Department</h2>
              <p className="text-slate-700 mb-4">
                The Department of Metallurgical Engineering and Materials Science at IIT Indore is at the forefront of
                research in advanced materials and their applications. Our faculty members are leading researchers in
                the field of 2D materials, composites, and advanced alloys.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact</h2>
              <p className="text-slate-700">
                Website:{" "}
                <a
                  href="https://www.iiti.ac.in"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.iiti.ac.in
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
