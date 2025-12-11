import Contact from "@/components/contact"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 pt-8">Contact Us</h1>
        <p className="text-gray-600 mb-12">Get in touch with the conference organizers</p>
      </div>
      <Contact />
    </div>
  )
}
