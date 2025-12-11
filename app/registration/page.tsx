import Registration from "@/components/registration"

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 pt-8">Registration</h1>
        <p className="text-gray-600 mb-12">Register now for the 2D MatTechGlobal 2026 Conference</p>
      </div>
      <Registration />
    </div>
  )
}
