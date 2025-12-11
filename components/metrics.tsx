'use client'

import { useState, useEffect } from 'react'
import { Users, Globe, TrendingUp, FileText } from 'lucide-react'

const MetricsCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => (prev < value ? prev + Math.ceil(value / 50) : value))
    }, 20)
    return () => clearInterval(interval)
  }, [value])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center">
          <Icon size={32} className="text-blue-600" />
        </div>
      </div>
      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
        {count.toLocaleString()}+
      </div>
      <p className="text-slate-600 font-semibold text-lg">{label}</p>
    </div>
  )
}

export default function Metrics() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Conference Impact
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join a global community of materials science experts and innovators
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard icon={Users} label="Expected Participants" value={500} />
          <MetricsCard icon={Globe} label="Countries Represented" value={35} />
          <MetricsCard icon={TrendingUp} label="Website Visitors" value={12450} />
          <MetricsCard icon={FileText} label="Paper Submissions" value={280} />
        </div>
      </div>
    </section>
  )
}
