import Themes from "@/components/themes"

export default function ThemesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 pt-8">Conference Themes</h1>
      </div>
      <Themes />
    </div>
  )
}
