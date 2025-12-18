export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 z-50">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Modern spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-blue-900/40"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-blue-300 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-blue-500/50 animate-spin" style={{ animationDirection: "reverse", animationDuration: "2s" }}></div>
        </div>

        {/* Branding text */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-200">2D MatTechGlobal</h1>
          <p className="text-xs text-blue-100 mt-1">Fundamentals to Applications</p>
        </div>
      </div>
    </div>
  )
}
