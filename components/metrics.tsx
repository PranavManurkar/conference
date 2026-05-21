'use client'

import { useState, useEffect, useRef } from 'react'
import { Users, Globe, TrendingUp, FileText } from 'lucide-react'

// Updated Component: No animation state, renders 'value' directly
const MetricsCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number }) => {
  return (
    <div className="bg-[color:var(--primary-foreground)] rounded-2xl shadow-lg p-8 text-center border border-[color:var(--nav)]/10 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[color:var(--primary)]/10 to-[color:var(--nav)]/10 rounded-2xl flex items-center justify-center">
          <Icon size={32} className="text-[color:var(--primary)]" />
        </div>
      </div>
      <div className="text-4xl font-bold bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--nav)] bg-clip-text text-transparent mb-2">
        {/* Directly display the value with commas */}
        {value.toLocaleString()}+
      </div>
      <p className="text-[color:var(--nav)]/80 font-semibold text-lg">{label}</p>
    </div>
  )
}

export default function Metrics() {
  const [visitorCount, setVisitorCount] = useState(700)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const API_URL = 'https://tdmtg.iiti.ac.in/api/visit-counter/' 

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data?.visits) {
          setVisitorCount(700 + data.visits)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch visitor count:', err)
        setVisitorCount(700) 
      })
  }, [])

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
          <MetricsCard icon={TrendingUp} label="Website Visitors" value={visitorCount} />
          <MetricsCard icon={FileText} label="Paper Submissions" value={400} />
        </div>
      </div>
    </section>
  )
}