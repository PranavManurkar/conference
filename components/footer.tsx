"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-bold mb-4">Navigation</h4>
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
            <h4 className="text-white font-bold mb-4">Submission & Registration</h4>
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
            <h4 className="text-white font-bold mb-4">Logistics</h4>
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
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">© 2025-2026 2D MatTechGlobal Conference. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/code-of-conduct" className="hover:text-white transition-colors">
                Code of Conduct
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-gray-700">
          <p className="text-sm">
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
    </footer>
  )
}
