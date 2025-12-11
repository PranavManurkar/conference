import Hero from "@/components/hero"
import Metrics from "@/components/metrics"
import InvitedSpeakersCarousel from "@/components/invited-speakers-carousel"
import ConferenceImpact from "@/components/conference-impact"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Hero />
      <Metrics />
      <InvitedSpeakersCarousel />
      <ConferenceImpact />
    </div>
  )
}
