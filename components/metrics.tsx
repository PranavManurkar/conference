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
    <div className="bg-[color:var(--primary-foreground)] rounded-2xl shadow-lg p-8 text-center border border-[color:var(--nav)]/10 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[color:var(--primary)]/10 to-[color:var(--nav)]/10 rounded-2xl flex items-center justify-center">
          <Icon size={32} className="text-[color:var(--primary)]" />
        </div>
      </div>
      <div className="text-4xl font-bold bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--nav)] bg-clip-text text-transparent mb-2">
        {count.toLocaleString()}+
      </div>
      <p className="text-[color:var(--nav)]/80 font-semibold text-lg">{label}</p>
    </div>
  )
}

export default function Metrics() {
  return (
    <section className="py-20 bg-gradient-to-b from-[color:var(--primary-foreground)] to-[color:var(--primary-foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--nav)] mb-4">
            <span className="text-[color:var(--primary)]"> Conference </span>Impact
          </h2>
          <p className="text-lg text-[color:var(--nav)]/80 max-w-2xl mx-auto">
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
