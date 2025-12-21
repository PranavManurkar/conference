"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: "Who can attend the conference?",
      answer:
        "The conference is open to researchers, academicians, engineers, industry professionals, and students working in materials science, nanotechnology, and related fields.",
    },
    {
      question: "What is the registration fee?",
      answer:
        "Registration fees vary based on participant category: Students ₹5,000, Faculty ₹8,000, Industry ₹15,000, International $300. See registration page for details.",
    },
    {
      question: "Can I present a paper?",
      answer:
        "Yes! Submit your paper through our online portal before March 31, 2026. All submissions undergo peer review.",
    },
    {
      question: "Is accommodation included in registration?",
      answer: "Accommodation is not included but we provide recommendations and discounts with partner hotels.",
    },
    {
      question: "What is the deadline for early bird registration?",
      answer: "Early bird registration ends on April 30, 2026. Early registrants receive a 15% discount.",
    },
    {
      question: "Can I attend virtually?",
      answer:
        "Unfortunately, this year the conference is in-person only. We are planning a hybrid format for future editions.",
    },
  ]

  return (
    <>
      {/* <Navigation /> */}
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h1>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <h3 className="font-semibold text-slate-800 text-left">{faq.question}</h3>
                  <ChevronDown
                    size={20}
                    className={`text-blue-600 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  />
                </button>

                {openIndex === index && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <p className="text-slate-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  )
}
