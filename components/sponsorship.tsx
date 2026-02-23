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
    { title: 'Conference Kit Sponsorship', amount: '₹2,00,000', features: ['Prominent display of Logo on Conference kit provided by the sponser', 'Free entry for 2 delegates'] },
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
          <h3 className="text-2xl font-bold text-[color:var(--nav)] mb-8">Other
            <span className='text-[color:var(--primary)]'> Sponsorship</span>  Options</h3>
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

      {/* PAYMENT SECTION UPDATED */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-[var(--card)] rounded-lg shadow-md p-8 border border-[color:var(--nav)]/10 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[color:var(--primary)] mb-6 border-b border-[color:var(--nav)]/10 pb-4">
            Payment Information
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
            
            {/* Column 1: Bank Details */}
            <div className="flex-1">
              <h3 className="font-bold text-[color:var(--primary)] mb-3 text-lg">Bank Details</h3>
              <ul className="space-y-3 text-[var(--muted-foreground)] text-sm md:text-base">
                <li><span className="font-semibold text-[color:var(--nav)]">Bank:</span> Canara Bank</li>
                <li><span className="font-semibold text-[color:var(--nav)]">Branch:</span> Simrol IIT Branch</li>
                <li><span className="font-semibold text-[color:var(--nav)]">Account Number:</span> 1476101027440</li>
                <li><span className="font-semibold text-[color:var(--nav)]">IFSC Code:</span> CNRB0006223</li>
                <li><span className="font-semibold text-[color:var(--nav)]">MICR Code:</span> 452015003</li>
                {/* ADDED whitespace-nowrap HERE */}
                <li className="whitespace-nowrap">
                    <span className="font-semibold text-[color:var(--nav)]">Account Holder:</span> Indian Institute of Technology Indore
                </li>
                <li className="flex items-center gap-2 pt-2">
                  <span className="font-semibold text-[color:var(--nav)]">Payu link:</span>
                  <a 
                    href="https://payu.in/web/EB3AF4CBC22FB4C90B5ABC9A52E5CAC3" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 bg-[color:var(--primary)] text-white text-sm font-medium rounded hover:opacity-90 transition-opacity"
                  >
                    Pay Now
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Account Information */}
            <div className="flex-1">
              <h3 className="font-bold text-[color:var(--primary)] mb-3 text-lg">
                Account Information
              </h3>
              <ul className="space-y-3 text-[var(--muted-foreground)] text-sm md:text-base">
                <li><span className="font-semibold text-[color:var(--nav)]">GST No:</span> 23AAAAI7115H122</li>
                <li><span className="font-semibold text-[color:var(--nav)]">PAN:</span> AAAAI7115H</li>
                <li><span className="font-semibold text-[color:var(--nav)]">TAN:</span> BPLI01163B</li>
                <li><span className="font-semibold text-[color:var(--nav)]">SWIFT Code:</span> CNRBINBBMSG</li>
                <li><span className="font-semibold text-[color:var(--nav)]">Contact:</span> arrnd@iiti.ac.in</li>
              </ul>
            </div>

            {/* Column 3: QR Code */}
            <div className="flex-none flex flex-col items-center justify-center md:items-start lg:items-center">
              <h4 className="font-bold text-[color:var(--primary)] mb-4">
                Scan to Pay
              </h4>
              <div className="bg-white p-2 rounded-lg border border-[var(--border)] shadow-sm">
                <img 
                    src="payuqr.png" 
                    alt="Payment QR Code" 
                    className="w-40 h-40 object-contain" 
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}