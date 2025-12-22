"use client"

import { Building2, Award, Zap, Target } from "lucide-react"

export default function SponsorsPage() {
  // Current sponsors organized by tier
  const sponsorTiers = {
    title: [
      // No title sponsors currently, but structure ready for future updates
    ],
    diamond: [
      // No diamond sponsors currently, but structure ready for future updates
    ],
    platinum: [
      // No platinum sponsors currently, but structure ready for future updates
    ],
    gold: [
      // No gold sponsors currently, but structure ready for future updates
    ],
    silver: [
      // No silver sponsors currently, but structure ready for future updates
    ],
  }

  const tierConfig = [
    {
      key: "title",
      name: "Title Sponsors",
      icon: Building2,
      color: "",
      textColor: "text-[color:var(--primary-foreground)]",
      gridCols: "md:grid-cols-1",
      borderColor: "border-[color:var(--primary)]",
      bgColor: "bg-[color:var(--primary)]",
      amount: "₹1,200,000",
      benefits: [
        "35-min presentation to entire audience",
        "Title promotion on all materials",
        "Prominent ads on webpage, dais, & displays",
        "2 exhibition booths",
        "Presentation at Banquet",
      ],
    },
    {
      key: "diamond",
      name: "Diamond Sponsors",
      icon: Award,
      color: "",
      textColor: "text-[color:var(--primary-foreground)]",
      gridCols: "md:grid-cols-2",
      borderColor: "border-[color:var(--primary)]/80",
      bgColor: "bg-[color:var(--primary)]/90",
      amount: "₹1,000,000",
      benefits: [
        "25-min presentation to audience",
        "Prominent ads on webpage & dais",
        "2 exhibition booths",
        "Logo on conference materials",
      ],
    },
    {
      key: "platinum",
      name: "Platinum Sponsors",
      icon: Zap,
      color: "",
      textColor: "text-[color:var(--primary-foreground)]",
      gridCols: "md:grid-cols-3",
      borderColor: "border-[color:var(--primary)]/60",
      bgColor: "bg-[color:var(--nav)]",
      amount: "₹700,000",
      benefits: ["20-min presentation", "2 exhibition booths", "Full-page souvenir ad", "Free entry for 4 delegates"],
    },
    {
      key: "gold",
      name: "Gold Sponsors",
      icon: Target,
      color: "",
      textColor: "text-[color:var(--primary-foreground)]",
      gridCols: "md:grid-cols-4",
      borderColor: "border-[color:var(--primary)]/40",
      bgColor: "bg-[color:var(--nav)]/90",
      amount: "₹500,000",
      benefits: ["15-min presentation", "1 exhibition booth", "½ page souvenir ad", "Free entry for 3 delegates"],
    },
  ]

  return (
    <main className="min-h-screen bg-[color:var(--nav)]/5 pt-8">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[color:var(--nav)] mb-4">Our Sponsors</h1>
          <p className="text-xl text-[color:var(--nav)]/80 max-w-3xl mx-auto">
            We are grateful to our sponsors who make the 2D MatTechGlobal 2026 Conference possible. Their support
            enables us to bring together the world's leading experts in 2D materials research and applications.
          </p>
        </div>

        {tierConfig.map((tier) => (
          <section key={tier.key} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-lg bg-[color:var(--primary)]`}>
                <tier.icon className="w-8 h-8 text-[color:var(--primary-foreground)]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[color:var(--nav)]">{tier.name}</h2>
                <p className="text-[color:var(--primary)] text-sm">{tier.amount}</p>
              </div>
            </div>

            {sponsorTiers[tier.key as keyof typeof sponsorTiers].length > 0 ? (
              <div className={`grid ${tier.gridCols} gap-6 mb-8`}>
                {sponsorTiers[tier.key as keyof typeof sponsorTiers].map((sponsor: any, idx: number) => (
                  <div
                    key={idx}
                    className={`${tier.bgColor} rounded-lg p-8 ${tier.textColor} text-center shadow-lg hover:shadow-xl transition-shadow`}
                  >
                    <h3 className="text-2xl font-bold">{sponsor.name}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`bg-[color:var(--primary-foreground)] rounded-lg p-8 border-2 border-dashed border-[color:var(--nav)]/30 text-center mb-8`}>
                <p className="text-[color:var(--nav)]/80 text-lg">No sponsors in this category yet</p>
                <p className="text-[color:var(--nav)]/60 text-sm mt-2">Be the first to sponsor at this level!</p>
              </div>
            )}

            {/* Benefits for this tier */}
            <div className="bg-[color:var(--primary-foreground)] rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-[color:var(--nav)] mb-4 flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full bg-[color:var(--primary)]`}></span>
                What's Included
              </h3>
              <ul className="grid md:grid-cols-2 gap-3">
                {tier.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className={`text-[color:var(--primary)] font-bold flex-shrink-0`}>✓</span>
                    <span className="text-[color:var(--nav)]/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        {/* Additional Sponsorship Options */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-[color:var(--nav)] mb-8">Other Sponsorship Opportunities</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Banquet Sponsorship", amount: "₹350,000" },
              { name: "Conference Kit Sponsorship", amount: "₹200,000" },
              { name: "Exhibition Stalls", amount: "₹50,000" },
            ].map((option, idx) => (
              <div
                key={idx}
                className="bg-[color:var(--primary-foreground)] rounded-lg p-6 shadow-md border border-[color:var(--nav)]/10 hover:scale-105 hover:shadow-2xl transition-transform duration-200"
              >
                <h3 className="text-xl font-bold text-[color:var(--nav)] mb-2">{option.name}</h3>
                <p className="text-[color:var(--primary)] font-semibold">{option.amount}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 bg-[color:var(--primary)] rounded-lg shadow-lg p-12 text-center text-[color:var(--primary-foreground)]">
          <h3 className="text-3xl font-bold mb-4">Become a Sponsor</h3>
          <p className="text-lg text-[color:var(--primary-foreground)]/80 mb-8 max-w-2xl mx-auto">
            Showcase your organization to leading scientists, engineers, and industry experts from around the world.
            Partner with us and make a lasting impact on the future of 2D materials research and innovation.
          </p>
          <a
            href="/sponsorship"
            className="inline-block bg-[color:var(--primary-foreground)] text-[color:var(--primary)] px-8 py-3 rounded-lg font-bold hover:bg-[color:var(--nav)] hover:text-[color:var(--primary-foreground)] transition-colors"
          >
            View Sponsorship Opportunities
          </a>
        </section>
      </div>
    </main>
  )
}
