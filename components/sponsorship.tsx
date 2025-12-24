'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const SponsorshipCard = ({ title, amount, benefits, featured }: { title: string; amount: string; benefits: string[]; featured?: boolean }) => (
  <Card className={`border-2 ${featured ? 'border-[color:var(--primary)] shadow-lg scale-105' : 'border-[color:var(--nav)]/10'}`}>
    <CardHeader className={featured ? 'bg-[color:var(--primary)]/10' : 'bg-[color:var(--nav)]/5'}>
      <CardTitle className={featured ? 'text-[color:var(--primary)]' : 'text-[color:var(--nav)]'}>{title}</CardTitle>
      <p className={`text-2xl font-bold mt-2 ${featured ? 'text-[color:var(--primary)]' : 'text-[color:var(--nav)]/80'}`}>{amount}</p>
    </CardHeader>
    <CardContent className="pt-6">
      {featured && <Badge className="bg-[color:var(--primary)] mb-4">Most Popular</Badge>}
      <ul className="space-y-2">
        {benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-start text-sm text-[color:var(--nav)]/80">
            <span className="text-[color:var(--primary)] mr-3 mt-1">✓</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
)

export default function Sponsorship() {
  const sponsorships = [
    {
      title: 'Title Sponsorship',
      amount: '₹12,00,000',
      featured: true,
      benefits: [
        '35-min presentation to entire audience',
        'Promotion of company name with title of conference',
        'Prominent advertisement on webpage, dais, & electronic display',
        '2 booths in the exhibition',
      ],
    },
    {
      title: 'Diamond Sponsorship',
      amount: '₹10,00,000',
      benefits: [
        '25-min presentation to entire audience',
        'Prominent advertisement on webpage, dais, & electronic display',
        '2 booths in the exhibition',
      ],
    },
    {
      title: 'Platinum Sponsorship',
      amount: '₹7,00,000',
      benefits: [
        '20-min presentation to entire audience',
        '2 booths in the exhibition',
        '1 full-page advertisement in Souvenir',
        'Free entry for 4 delegates',
      ],
    },
    {
      title: 'Gold Sponsorship',
      amount: '₹5,00,000',
      benefits: [
        '15-min presentation to entire audience',
        '1 booth in the exhibition',
        '1 full-page advertisement in Souvenir',
        'Free entry for 3 delegates',
      ],
    },
  ]

  const otherSponsorship = [
    {title: 'Banquet Sponsorship', amount: '₹3,50,000', features: ['2 full-page advertisements in Souvenir', 'Free entry for 6 delegates'] },
    { title: 'Silver Sponsorship', amount: '₹3,00,000', features: ['1 booth', '½ page advertisement in Souvenir', 'Free entry for 4 delegates'] },
    { title: 'Bronze Sponsorship', amount: '₹2,50,000', features: ['1 booth', '½ page advertisement in Souvenir', 'Free entry for 2 delegates'] },
    { title: 'Conference Kit Sponsorship', amount: '₹2,00,000', features: ['2 full-page advertisements in Souvenir', 'Free entry for 5 delegates'] },
    { title: 'Exhibition Booth', amount: '₹50,000', features: ['Single booth in exhibition area'] },
  ]

  return (
    <section id="sponsorship" className="py-20 bg-[color:var(--primary-foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <div className="inline-block mb-4">
            <div className="h-1 w-12 bg-[var(--primary)] rounded" />
          </div>
          <h2 className="text-4xl font-bold text-[color:var(--nav)] mb-4">
            <span className="text-[color:var(--primary)]">Sponsorship</span> Opportunities
          </h2>
          <p className="text-[color:var(--nav)]/80 text-lg max-w-2xl mx-auto">
            Partner with us to reach leading scientists and decision-makers in materials science and engineering.
          </p>
        </div>

        {/* Main Sponsorship Tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sponsorships.map((sponsor, idx) => (
            <SponsorshipCard key={idx} {...sponsor} />
          ))}
        </div>

        {/* Other Sponsorship Options */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-[color:var(--nav)] mb-8">Other Sponsorship Options</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {otherSponsorship.map((sponsor, idx) => (
              <Card key={idx} className="border-[color:var(--nav)]/10 flex flex-col h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-[color:var(--nav)] min-h-[3rem] flex items-center">{sponsor.title}</CardTitle>
                <p className="text-[color:var(--primary)] font-bold mt-2">{sponsor.amount}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-1 text-xs text-[color:var(--nav)]/80">
                {sponsor.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start">
                  <span className="text-[color:var(--primary)] mr-2">•</span>
                  <span>{feature}</span>
                  </li>
                ))}
                </ul>
              </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
