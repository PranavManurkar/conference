"use client"

import Image from "next/image"
import { Train, Plane, Car, Phone, MapPin, ExternalLink, Navigation } from "lucide-react"

// QR code URLs — uses the free QR server API
// Gate 1A: IIT Indore Gate 1A on Google Maps
const GATE1A_MAPS_URL = "https://maps.google.com/?q=IIT+Indore+Gate+1A,+Khandwa+Road,+Simrol,+Indore"
const NALANDA_MAPS_URL = "https://maps.google.com/?q=Nalanda+Auditorium,+IIT+Indore,+Simrol,+Indore"

const GATE1A_QR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(GATE1A_MAPS_URL)}`
const NALANDA_QR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(NALANDA_MAPS_URL)}`

export default function HowToReachPage() {
  return (
    <main className="min-h-screen bg-[color:var(--primary-foreground)]">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="bg-[color:var(--nav)] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-1 w-12 bg-[color:var(--primary)] rounded mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            How to <span className="text-[color:var(--primary)]">Reach</span>
          </h1>
          <p className="text-white/70 text-base max-w-2xl">
            IIT Indore · Khandwa Road, Simrol, Indore – 453 552, Madhya Pradesh, India
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* ── Transport Cards ──────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-8 bg-[color:var(--primary)] rounded" />
            <h2 className="text-2xl font-bold text-[color:var(--nav)]">
              Getting to <span className="text-[color:var(--primary)]">IIT Indore</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Railway */}
            <div className="bg-white rounded-2xl border border-[color:var(--nav)]/10 shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[color:var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Train className="h-5 w-5 text-[color:var(--primary)]" />
                </div>
                <h3 className="text-lg font-bold text-[color:var(--nav)]">By Train</h3>
              </div>
              <p className="text-sm text-[color:var(--nav)]/70 leading-relaxed">
                <span className="font-semibold text-[color:var(--nav)]">Indore Railway Station</span> is the nearest railhead,
                approximately <span className="font-semibold text-[color:var(--primary)]">24 km</span> from IIT Indore.
              </p>
              <p className="text-sm text-[color:var(--nav)]/60">
                Auto-rickshaws, taxis, and app-cabs (Ola / Uber) are readily available from the station.
              </p>
            </div>

            {/* Airport */}
            <div className="bg-white rounded-2xl border border-[color:var(--nav)]/10 shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[color:var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Plane className="h-5 w-5 text-[color:var(--primary)]" />
                </div>
                <h3 className="text-lg font-bold text-[color:var(--nav)]">By Air</h3>
              </div>
              <p className="text-sm text-[color:var(--nav)]/70 leading-relaxed">
                <span className="font-semibold text-[color:var(--nav)]">Devi Ahilya Bai Holkar Airport, Indore</span> is
                approximately <span className="font-semibold text-[color:var(--primary)]">30 km</span> from IIT Indore.
              </p>
              <p className="text-sm text-[color:var(--nav)]/60">
                Pre-paid taxis and app-cabs are available at the airport exit. Journey takes approx. 45–60 min.
              </p>
            </div>

            {/* Pickup Service */}
            <div className="bg-gradient-to-br from-[color:var(--primary)]/5 to-[color:var(--primary)]/10 rounded-2xl border-2 border-[color:var(--primary)]/25 shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[color:var(--primary)]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Car className="h-5 w-5 text-[color:var(--primary)]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[color:var(--nav)]">Pickup &amp; Drop</h3>
                  <span className="text-xs font-semibold text-[color:var(--primary)] uppercase tracking-wide">Conference Service</span>
                </div>
              </div>
              <p className="text-sm text-[color:var(--nav)]/80 font-semibold">Sai Tours and Travels</p>
              <a
                href="tel:9479583639"
                className="inline-flex items-center gap-2 text-[color:var(--primary)] font-bold text-base hover:underline"
              >
                <Phone className="h-4 w-4" />
                94795 83639
              </a>
              <p className="text-sm text-[color:var(--nav)]/60">
                Estimated fare: <span className="font-semibold text-[color:var(--nav)]">₹800 – ₹1,000</span> (airport / station to campus)
              </p>
            </div>
          </div>
        </section>

        {/* ── Campus Map ───────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-8 bg-[color:var(--primary)] rounded" />
            <h2 className="text-2xl font-bold text-[color:var(--nav)]">
              Campus <span className="text-[color:var(--primary)]">Map</span>
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-[color:var(--nav)]/10 shadow-md overflow-hidden">
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <Image
                src="/map.png"
                alt="IIT Indore Campus Map showing Conference Venue (Nalanda Auditorium), Hostels, Dining Hall, and Gate 1A"
                fill
                className="object-contain bg-gray-50"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
            <div className="px-5 py-3 bg-[color:var(--nav)]/5 border-t border-[color:var(--nav)]/10">
              <p className="text-xs text-[color:var(--nav)]/60 text-center">
                Campus layout showing the Conference Venue (Nalanda Auditorium), Hostels, Dining Area, and Entry Gate 1A from Khandwa Road
              </p>
            </div>
          </div>
        </section>

        {/* ── QR Codes ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-8 bg-[color:var(--primary)] rounded" />
            <h2 className="text-2xl font-bold text-[color:var(--nav)]">
              Scan to <span className="text-[color:var(--primary)]">Navigate</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Gate 1A QR */}
            <div className="bg-white rounded-2xl border border-[color:var(--nav)]/10 shadow-md p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 bg-[color:var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Navigation className="h-5 w-5 text-[color:var(--primary)]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[color:var(--nav)]">IIT Indore — Gate 1A</h3>
                  <p className="text-xs text-[color:var(--nav)]/60">Main entry from Khandwa Road</p>
                </div>
              </div>
              <div className="bg-white p-2 rounded-xl border-2 border-dashed border-[color:var(--nav)]/15">
                <img
                  src={GATE1A_QR}
                  alt="QR code for IIT Indore Gate 1A on Google Maps"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <a
                href={GATE1A_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--primary)] hover:underline"
              >
                <MapPin className="h-4 w-4" />
                Open in Google Maps
                <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-xs text-[color:var(--nav)]/50 text-center">
                Use this to navigate to the campus entrance on Khandwa Road
              </p>
            </div>

            {/* Nalanda Auditorium QR */}
            <div className="bg-white rounded-2xl border border-[color:var(--nav)]/10 shadow-md p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 bg-[color:var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-[color:var(--primary)]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[color:var(--nav)]">Nalanda Auditorium</h3>
                  <p className="text-xs text-[color:var(--nav)]/60">2DMTG Conference Venue</p>
                </div>
              </div>
              <div className="bg-white p-2 rounded-xl border-2 border-dashed border-[color:var(--nav)]/15">
                <img
                  src={NALANDA_QR}
                  alt="QR code for Nalanda Auditorium IIT Indore on Google Maps"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <a
                href={NALANDA_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--primary)] hover:underline"
              >
                <MapPin className="h-4 w-4" />
                Open in Google Maps
                <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-xs text-[color:var(--nav)]/50 text-center">
                Direct navigation to the conference venue inside campus
              </p>
            </div>
          </div>
        </section>

        {/* ── Address & Contact Note ───────────────────────────────── */}
        <section>
          <div className="bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/15 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--primary)] mb-2">Conference Venue</p>
                <p className="text-lg font-bold text-[color:var(--nav)]">IIT Indore</p>
                <p className="text-sm text-[color:var(--nav)]/70 mt-1 leading-relaxed">
                  Khandwa Road, Simrol, Indore – 453 552<br />
                  Madhya Pradesh, India
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--primary)] mb-2">For Queries</p>
                <p className="text-sm text-[color:var(--nav)]/80">
                  Contact us at{" "}
                  <a href="mailto:2dmtg@iiti.ac.in" className="text-[color:var(--primary)] font-semibold hover:underline">
                    2dmtg@iiti.ac.in
                  </a>
                  {" "}or reach our transport coordinator:
                </p>
                <a href="tel:9479583639" className="inline-flex items-center gap-2 mt-2 text-[color:var(--primary)] font-bold hover:underline">
                  <Phone className="h-4 w-4" />
                  Sai Tours &amp; Travels · 94795 83639
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}