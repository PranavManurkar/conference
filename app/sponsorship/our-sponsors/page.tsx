import React from "react"

type Sponsor = {
  name: string
  logo?: string
  alt?: string
}

const sizeClasses = {
  platinum: "h-36 sm:h-44 w-full sm:w-auto sm:max-w-[420px]",
  gold: "h-28 sm:h-36 w-full sm:w-auto sm:max-w-[360px]",
  silver: "h-24 sm:h-32 w-full sm:w-auto sm:max-w-[320px]",
  bronze: "h-22 sm:h-28 w-full sm:w-auto sm:max-w-[300px]",
  award: "h-24 sm:h-32 w-full sm:w-auto sm:max-w-[320px]",
  other: "h-20 sm:h-24 w-full sm:w-auto sm:max-w-[260px]",
} as const

type TierSize = keyof typeof sizeClasses

const tiers: {
  id: string
  label: string
  size: TierSize
  gradient: string
  sponsors: Sponsor[]
}[] = [
  {
    id: "platinum",
    label: "Platinum",
    size: "platinum",
    gradient: "from-slate-100 via-white to-slate-50",
    sponsors: [{ name: "Thermo Scientific",logo: "/thermo.jpg",}],
  },
  {
    id: "gold",
    label: "Gold",
    size: "gold",
    gradient: "from-amber-50 via-white to-yellow-50",
    sponsors: [
      {
        name: "Malvern Panalytical",
        logo: "/logo11.png",
        alt: "Malvern Panalytical logo",
      },
    ],
  },
  {
    id: "silver",
    label: "Silver",
    size: "silver",
    gradient: "from-gray-50 via-white to-slate-50",
    sponsors: [
      {
        name: "ANRF",
        logo: "/logo12.png",
        alt: "Anusandhan National Research Foundation logo",
      },
    ],
  },
  {
    id: "bronze",
    label: "Bronze",
    size: "bronze",
    gradient: "from-orange-50 via-white to-amber-50",
    sponsors: [
      { name: "JEOL", logo: "/jeol.png", alt: "JEOL logo" },
      { name: "Oxford Instruments", logo: "/oxford.jpg",},
    ],
  },
  {
    id: "award",
    label: "Award",
    size: "award",
    gradient: "from-emerald-50 via-white to-emerald-100/60",
    sponsors: [{ name: "Wiley", logo: "/logo13.png", alt: "Wiley logo" }],
  },
  {
    id: "other",
    label: "Other Sponsors",
    size: "other",
    gradient: "from-slate-50 via-white to-slate-100",
    sponsors: [
      { name: "DRDO", logo: "/logo14.jpg", alt: "DRDO logo" },
      { name: "CSIR", logo: "/CSIR-Logo.png", alt: "CSIR logo" },
      {
        name: "Trokut Solutions",
        logo: "/logo17.png",
        alt: "Trokut Solutions logo",
      },
      {
        name: "Laser Spectra Services",
        logo: "/logo_lss.jpeg",
        alt: "Laser Spectra Services logo",
      },
      { name: "KAN-THT", logo: "/logo_kam.jpeg", alt: "KAM-THt logo" },
      {
        name: "Micromeritics",
        logo: "/logo15.png",
        alt: "Micromeritics logo",
      },
      { name: "SciAps", logo: "/logo16.png", alt: "SciAps logo" },
      {
        name: "E-Spin Nanotech",
        logo: "/logo18.png",
        alt: "E-Spin Nanotech logo",
      },      {
        name: "Therelek",
        logo: "/therelek.jpeg",
        alt: "Therelek logo",
      },
        {
        name: "Gnano",
        logo: "/ganano.png",
        alt: "Gnano logo",
      },
        {
        name: "Metrohm",
        logo: "/metrohm.png",
        alt: "Metrohm logo",
      },
    ],
  },
]

export default function OurSponsorsPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#ffffff_60%)]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-slate-900">Our Sponsors</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sponsor tiers are arranged from platinum to other partners, with a
            gentle size gradient to highlight top contributors.
          </p>
        </div>

        <div className="space-y-10">
          {tiers.map((tier) => (
            <section
              key={tier.id}
              className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${tier.gradient} p-6 shadow-sm`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold text-slate-800">
                  {tier.label}
                </h3>
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  {tier.sponsors.length} sponsor
                  {tier.sponsors.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-6">
                {tier.sponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 p-3 sm:p-4 shadow-sm ${sizeClasses[tier.size]}`}
                    >
                      {sponsor.logo ? (
                        <img
                          src={sponsor.logo}
                          alt={sponsor.alt ?? sponsor.name}
                          className="h-full w-auto max-w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-sm font-medium text-slate-700 text-center">
                          {sponsor.name}
                        </span>
                      )}
                    </div>
                    {sponsor.logo && (
                      <span className="text-xs sm:text-sm text-slate-700 text-center">
                        {sponsor.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
