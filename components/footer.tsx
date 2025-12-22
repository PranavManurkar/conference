"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-6">
          {/* Left half: Navigation columns */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-8 lg:w-1/2">
            <div>
              <h4 className="text-white font-bold mb-3">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/committee" className="hover:text-white transition-colors">
                    Committee
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Submission & Registration</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/paper-submission" className="hover:text-white transition-colors">
                    Paper Submission
                  </Link>
                </li>
                <li>
                  <Link href="/important-dates" className="hover:text-white transition-colors">
                    Important Dates
                  </Link>
                </li>
                <li>
                  <Link href="/registration" className="hover:text-white transition-colors">
                    Registration
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Logistics</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/accommodation" className="hover:text-white transition-colors">
                    Accommodation
                  </Link>
                </li>
                <li>
                  <Link href="/sponsorship" className="hover:text-white transition-colors">
                    Sponsors
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right half: Contact information */}
          <div className="lg:w-1/2 lg:text-right text-sm">
            <p>
              Department of Metallurgical Engineering and Materials Science
              <br />
              Indian Institute of Technology Indore
              <br />
              Khandwa Road, Simrol, Indore - 453 552, India
              <br />
              Website:{" "}
              <a
                href="https://mems.iiti.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                www.mems.iiti.ac.in
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <p className="text-sm text-center">© 2025-2026 2D MatTechGlobal Conference. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
