import About from "@/components/about"
import KeyDates from "@/components/key-dates"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 pt-8">About Conference</h1>
      </div> */}
      <About />
      <KeyDates />
    </div>
  )
}
