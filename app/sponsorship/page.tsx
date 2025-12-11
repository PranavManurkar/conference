import Sponsorship from "@/components/sponsorship"

export default function SponsorshipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 pt-8">Sponsorship Opportunities</h1>
        <p className="text-gray-600 mb-12">Become a sponsor and showcase your organization</p>
      </div>
      <Sponsorship />
    </div>
  )
}
