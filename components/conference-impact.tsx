"use client"

import { Award, Users, BookOpen, Globe } from "lucide-react"

const ImpactCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => {
  return (
    <div className="bg-[color:var(--primary-foreground)] rounded-xl shadow-md p-6 border border-[color:var(--nav)]/10 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 bg-[color:var(--primary)]/10 rounded-lg flex items-center justify-center">
          <Icon size={24} className="text-[color:var(--primary)]" />
        </div>
        <h3 className="text-lg font-semibold text-[color:var(--nav)]">{title}</h3>
      </div>
      <p className="text-[color:var(--nav)]/80 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

export default function ConferenceImpact() {
  return (
    <section className="py-20 bg-[color:var(--primary-foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--nav)] mb-4">Conference Highlights</h2>
          <p className="text-lg text-[color:var(--nav)]/80 max-w-2xl mx-auto">
            Experience world-class research and networking in 2D materials science
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ImpactCard
            icon={Award}
            title="Expert-Led Sessions"
            description="Learn from leading researchers and industry pioneers in 2D materials and their applications across energy, healthcare, and quantum technologies."
          />
          <ImpactCard
            icon={Users}
            title="Global Networking"
            description="Connect with 500+ participants from 35+ countries representing academia, industry, and research institutions worldwide."
          />
          <ImpactCard
            icon={BookOpen}
            title="Research Presentations"
            description="Showcase your work through oral presentations and poster sessions with opportunities for publication in leading journals."
          />
          <ImpactCard
            icon={Globe}
            title="Innovation Hub"
            description="Discover cutting-edge applications in energy storage, electronics, sensors, and emerging quantum computing technologies."
          />
        </div>
      </div>
    </section>
  )
}
