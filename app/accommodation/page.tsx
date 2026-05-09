"use client"

import { MapPin, Phone, Globe, ExternalLink } from "lucide-react"

type Hotel = {
  srNo: number
  name: string
  contact: string[]
  address: string
  distance: string
  distanceKm: number
  link?: string
  linkLabel?: string
  contactPerson?: string
  highlight?: boolean
}

const hotels: Hotel[] = [
  {
    srNo: 0,
    name: "The Sky Imperial Sethji Ni Wadi",
    contact: ["9826803107"],
    contactPerson: "Mr. Avinash Rawat",
    address: "Indore",
    distance: "3 km",
    distanceKm: 3,
    link: "https://docs.google.com/forms/d/e/1FAIpQLSeIfso1iNI6jPsssxY9TX8yJfpLLP-dPxKJUmdOVyl3l0MePA/viewform?usp=header",
    linkLabel: "Book via Form",
    highlight: true,
  },
  {
    srNo: 1,
    name: "Hotel Amrat Villa",
    contact: ["9752990952"],
    address: "Amrat Sweets, Amrat Sagar Colony, near IIT Gate, beside IIT, Indore",
    distance: "220 m",
    distanceKm: 0.22,
    link: "https://www.instagram.com/amratsweets/",
    linkLabel: "Instagram",
  },
  {
    srNo: 2,
    name: "Hotel Welcome",
    contact: ["9753974883"],
    address: "Near Amrit Greens Township, Khandwa Road, Simrol, Near IIT Gate No. 01, Indore",
    distance: "900 m",
    distanceKm: 0.9,
    link: "https://www.instagram.com/hotewelcome?igsh=MTZ6ejgxNngzOGI4NA%3D%3D",
    linkLabel: "Instagram",
  },
  {
    srNo: 3,
    name: "Hotel Bombay Darbar",
    contact: ["7084598974"],
    address: "Near Amrit Greens Township, Khandwa Road, Simrol, Near IIT Gate No. 01, Indore",
    distance: "1.0 km",
    distanceKm: 1.0,
  },
  {
    srNo: 4,
    name: "Chokhi Dhani Aangan",
    contact: ["9875704888"],
    address: "Chokhi Dhani Aangan, Indore 9 Mile, Khandwa Road, Datodafatha, Indore",
    distance: "8.4 km",
    distanceKm: 8.4,
    link: "https://chokhidhani.com/welcome-indore/",
    linkLabel: "Website",
  },
  {
    srNo: 5,
    name: "Hotel Magnet",
    contact: ["6268778944", "8120007080"],
    address: "Khandwa Rd, near Chameli Devi College, Umrikheda, Indore",
    distance: "10 km",
    distanceKm: 10,
    link: "https://magnethotelindore.com/",
    linkLabel: "Website",
  },
  {
    srNo: 6,
    name: "Hotel Royal Imperia",
    contact: ["9009008188"],
    address: "Royal Imperia, near Bharat Petrol Pump, Tejaji Nagar, Morod, Indore",
    distance: "11.8 km",
    distanceKm: 11.8,
    link: "https://www.instagram.com/_royal_imperia_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    linkLabel: "Instagram",
  },
  {
    srNo: 7,
    name: "Fun n Food Resort",
    contact: ["9479800333"],
    address: "Khandwa Road, behind BSNL Office, Morda Patak, Anuradha Nagar, Morod, Indore",
    distance: "12 km",
    distanceKm: 12,
    link: "https://www.instagram.com/funandfoodresortnwaterpark/",
    linkLabel: "Instagram",
  },
  {
    srNo: 8,
    name: "Hotel Indore Palace",
    contact: ["9111095333"],
    address: "Tejaji Nagar Square, near Reliance Petrol Pump, opposite Hero Showroom, Anuradha Nagar, Indore",
    distance: "12.4 km",
    distanceKm: 12.4,
    link: "https://www.justdial.com/Indore/Hotel-Indore-Palace-NearRatna-Garden-Tejaji-Nagar/0731PX731-X731-241202153046-P9E4_BZDET",
    linkLabel: "JustDial",
  },
  {
    srNo: 9,
    name: "Hotel Gourav Palace",
    contact: ["9301311177", "6261617770"],
    address: "Near Tejaji Nagar Square, Khandwa Rd, in front of Indian Oil Petrol Pump, Tejaji Nagar, Indore",
    distance: "12.7 km",
    distanceKm: 12.7,
  },
  {
    srNo: 10,
    name: "Skyline Resort & Convention Center",
    contact: ["7999999805", "6262030071"],
    address: "Indore Bypass, Opposite Tejaji Nagar Police Station, Near Khandwa Road, Indore",
    distance: "13.4 km",
    distanceKm: 13.4,
    link: "https://www.skylinernc.com/",
    linkLabel: "Website",
  },
  {
    srNo: 11,
    name: "Hotel Baywatch",
    contact: ["9589428600"],
    address: "Khandwa Naka, Khandwa Rd, opp. Imperial Academy School, 2-3, Rani Bagh Main, Indore",
    distance: "16.3 km",
    distanceKm: 16.3,
    link: "https://hotels.eglobe-solutions.com/hotelbaywatch/booking/hotels/hotel-baywatch-indoreindore?roomId=86879&checkIn=2026-05-01&nights=1&adults=2&child=0&ghaRef=RQ30fiJUcNoumNYC0Iye",
    linkLabel: "Book Online",
  },
]

// Sort by distance
const sortedHotels = [...hotels].sort((a, b) => a.distanceKm - b.distanceKm)

function DistanceBadge({ distance, distanceKm }: { distance: string; distanceKm: number }) {
  let color = "bg-green-100 text-green-700"
  if (distanceKm > 5 && distanceKm <= 12) color = "bg-yellow-100 text-yellow-700"
  else if (distanceKm > 12) color = "bg-orange-100 text-orange-700"
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${color}`}>
      {distance}
    </span>
  )
}

export default function Accommodation() {
  return (
    <main className="min-h-screen bg-[color:var(--primary-foreground)]">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="h-1 w-12 bg-[color:var(--primary)] rounded mb-4" />
          <h1 className="text-4xl font-bold text-[color:var(--nav)] mb-3">
            <span className="text-[color:var(--primary)]">Accommodation</span> Options
          </h1>
          <p className="text-[color:var(--nav)]/70 text-lg max-w-2xl">
            A curated list of hotels near IIT Indore for conference participants. We recommend booking early as availability may be limited during the conference dates (June 24–26, 2026).
          </p>
          <div className="flex flex-wrap gap-4 mt-5 text-sm">
            <div className="flex items-center gap-2 text-[color:var(--nav)]/70">
              <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
              Within 5 km of IIT Indore
            </div>
            <div className="flex items-center gap-2 text-[color:var(--nav)]/70">
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
              5–12 km from IIT Indore
            </div>
            <div className="flex items-center gap-2 text-[color:var(--nav)]/70">
              <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
              Over 12 km from IIT Indore
            </div>
          </div>
        </div>

        {/* Highlighted Partner Hotel */}
        {(() => {
          const h = hotels.find((x) => x.highlight)
          if (!h) return null
          return (
            <div className="mb-8 bg-gradient-to-r from-[color:var(--primary)]/10 to-[color:var(--primary)]/5 border-2 border-[color:var(--primary)]/30 rounded-2xl p-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--primary)] bg-[color:var(--primary)]/10 px-3 py-1 rounded-full">
                      ★ Recommended Partner Hotel
                    </span>
                    <DistanceBadge distance={h.distance} distanceKm={h.distanceKm} />
                  </div>
                  <h2 className="text-2xl font-bold text-[color:var(--nav)] mb-1">{h.name}</h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-[color:var(--nav)]/70">
                    {h.contactPerson && (
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold text-[color:var(--nav)]">Contact:</span> {h.contactPerson}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Phone size={13} className="text-[color:var(--primary)]" />
                      {h.contact.join(" / ")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-[color:var(--primary)]" />
                      {h.distance} from IIT Indore
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {h.link && (
                      <a
                        href={h.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[color:var(--primary)] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                      >
                        {h.linkLabel || "Book Now"} <ExternalLink size={14} />
                      </a>
                    )}
                    <a
                      href="https://theskyimperial.com/hotels-resorts/best-hotels-in-madhya-pradesh/best-hotels-in-indore/the-sky-imperial-sethji-ni-wadi-indore/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border-2 border-[color:var(--primary)] text-[color:var(--primary)] font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[color:var(--primary)] hover:text-white transition-colors"
                    >
                      View Hotel Details <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* IIT Indore Students Hostel (styled card) */}
        <div className="mb-8 bg-gradient-to-r from-[color:var(--primary)]/10 to-[color:var(--primary)]/5 border-2 border-[color:var(--primary)]/30 rounded-2xl p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--primary)] bg-[color:var(--primary)]/10 px-3 py-1 rounded-full">
                  Hostel - IIT Indore
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                  Available: 220 seats
                </span>
              </div>

              <h2 className="text-2xl font-bold text-[color:var(--nav)] mb-1">IIT Indore Students Hostel</h2>

              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-[color:var(--nav)]/70">
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold text-[color:var(--nav)]">Occupancy:</span> Double occupancy
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold text-[color:var(--nav)]">Rate:</span> Rs. 473/- per day per person (incl. GST)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold text-[color:var(--nav)]">Dates:</span> 23rd–27th June 2026
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href="https://forms.gle/t5129u9Y3smRz89Y7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[color:var(--primary)] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Apply via Form <ExternalLink size={14} />
                </a>
              </div>

              <p className="text-[color:var(--nav)]/70 text-sm mt-3">* Rates are subject to revision. New rates are applicable from the date it is approved by the Competent Authority.</p>

              <div className="mt-4 text-[color:var(--nav)]/80">
                <p className="font-semibold">Contact</p>
                <p>Chandrani Mita Sarkar — Office of Chief Warden</p>
                <p>
                  Tel: <a href="tel:+9107316603468" className="text-[color:var(--primary)]">+91-0731-6603468</a>
                </p>
                <p>
                  Email: <a href="mailto:chiefwardenoffice@iiti.ac.in" className="text-[color:var(--primary)]">chiefwardenoffice@iiti.ac.in</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hotels Table — Desktop */}
        <div className="hidden md:block bg-[color:var(--primary-foreground)] rounded-2xl border border-[color:var(--nav)]/10 shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[color:var(--nav)] text-white">
                  <th className="py-3.5 px-4 text-left font-semibold w-12">Sr.</th>
                  <th className="py-3.5 px-4 text-left font-semibold">Hotel Name</th>
                  <th className="py-3.5 px-4 text-left font-semibold">Contact</th>
                  <th className="py-3.5 px-4 text-left font-semibold">Address</th>
                  <th className="py-3.5 px-4 text-center font-semibold whitespace-nowrap">Distance</th>
                  <th className="py-3.5 px-4 text-center font-semibold">Link</th>
                </tr>
              </thead>
              <tbody>
                {sortedHotels
                  .filter((h) => !h.highlight)
                  .map((hotel, idx) => (
                    <tr
                      key={hotel.srNo}
                      className={`border-b border-[color:var(--nav)]/5 hover:bg-[color:var(--primary)]/[0.02] transition-colors ${idx % 2 === 0 ? "" : "bg-[color:var(--nav)]/[0.02]"}`}
                    >
                      <td className="py-3.5 px-4 text-[color:var(--nav)]/40 font-medium">{hotel.srNo}</td>
                      <td className="py-3.5 px-4 font-semibold text-[color:var(--nav)]">{hotel.name}</td>
                      <td className="py-3.5 px-4 text-[color:var(--nav)]/70">
                        <div className="flex items-start gap-1.5">
                          <Phone size={12} className="text-[color:var(--primary)] mt-0.5 flex-shrink-0" />
                          <span>{hotel.contact.join(" / ")}</span>
                        </div>
                        {hotel.contactPerson && (
                          <p className="text-xs text-[color:var(--nav)]/50 mt-0.5">{hotel.contactPerson}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[color:var(--nav)]/70 max-w-xs">
                        <div className="flex items-start gap-1.5">
                          <MapPin size={12} className="text-[color:var(--primary)] mt-0.5 flex-shrink-0" />
                          <span className="leading-snug">{hotel.address}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <DistanceBadge distance={hotel.distance} distanceKm={hotel.distanceKm} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {hotel.link ? (
                          <a
                            href={hotel.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[color:var(--primary)] font-semibold hover:underline text-xs"
                          >
                            <Globe size={12} />
                            {hotel.linkLabel || "Visit"}
                          </a>
                        ) : (
                          <span className="text-[color:var(--nav)]/30 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hotels Cards — Mobile */}
        <div className="md:hidden space-y-4 mb-8">
          {sortedHotels
            .filter((h) => !h.highlight)
            .map((hotel) => (
              <div
                key={hotel.srNo}
                className="bg-[color:var(--primary-foreground)] border border-[color:var(--nav)]/10 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-[color:var(--nav)] leading-snug">{hotel.name}</h3>
                  <DistanceBadge distance={hotel.distance} distanceKm={hotel.distanceKm} />
                </div>
                <div className="space-y-1.5 text-sm text-[color:var(--nav)]/70">
                  {hotel.contactPerson && (
                    <p className="text-xs font-semibold text-[color:var(--nav)]/60">{hotel.contactPerson}</p>
                  )}
                  <div className="flex items-start gap-1.5">
                    <Phone size={12} className="text-[color:var(--primary)] mt-0.5 flex-shrink-0" />
                    {hotel.contact.join(" / ")}
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin size={12} className="text-[color:var(--primary)] mt-0.5 flex-shrink-0" />
                    <span className="leading-snug">{hotel.address}</span>
                  </div>
                </div>
                {hotel.link && (
                  <a
                    href={hotel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-[color:var(--primary)] font-semibold text-xs hover:underline"
                  >
                    <ExternalLink size={12} />
                    {hotel.linkLabel || "Visit Website"}
                  </a>
                )}
              </div>
            ))}
        </div>

        {/* Note */}
        <div className="bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/15 rounded-xl p-5 text-sm text-[color:var(--nav)]/80">
          <p className="font-semibold text-[color:var(--nav)] mb-2">Note</p>
          <ul className="space-y-1.5">
            {[
              "The above list is for reference only. Participants are responsible for their own bookings and payments.",
              "Conference dates: June 24–26, 2026. Pre-conference workshop: June 23, 2026.",
              "For any accommodation-related queries, contact: 2dmtg@iiti.ac.in",
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[color:var(--primary)] flex-shrink-0">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}