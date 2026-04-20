// components/ConferenceAwards.tsx
"use client";

import React from "react";
import { Award } from "lucide-react";

/**
 * AwardCard
 * Re-uses the same visual language as your ImpactCard:
 * - white card, rounded-xl, shadow, border, hover shadow
 * - blue icon in a rounded square
 */
const AwardCard = ({
  icon: Icon,
  title,
  description,
  awardCount,
  prize,
  criteria,
}: {
  icon: any;
  title: string;
  description: string;
  awardCount: string;
  prize: string;
  criteria: string;
}) => {
  return (
    <div className="bg-[color:var(--primary-foreground)] rounded-xl shadow-md p-6 border border-[color:var(--nav)]/10 hover:shadow-lg transition-shadow duration-300 flex flex-col gap-4">
      <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-[color:var(--primary)]/10 rounded-lg flex items-center justify-center shrink-0">
        <Icon size={20} className="text-[color:var(--primary)]" />
      </div>
      <h3 className="text-base font-semibold text-[color:var(--nav)] line-clamp-2">{title}</h3>
      </div>
      <p className="text-[color:var(--nav)]/80 text-xs leading-relaxed min-h-[3rem]">{description}</p>
      <div className="space-y-2 text-sm text-[color:var(--nav)]/70 pt-2 border-t border-[color:var(--nav)]/10 ">
      <div><strong>Total Awards:</strong> {awardCount}</div>
      <div><strong>Prize:</strong> {prize}</div>
      <div><strong>Criteria:</strong> {criteria}</div>
      </div>
    </div>
  );
};

/**
 * ConferenceAwards
 * Shows three award cards: Oral, Presentation (poster), and a placeholder for future award
 * Matches same spacing, color, and design as your ConferenceImpact component.
 */
export default function ConferenceAwards() {
  return (
    <section className="py-20 bg-[color:var(--primary-foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--nav)] mb-4">
            <span className="text-[color:var(--primary)]"> Conference </span>Awards</h2>
            <h6 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                Sponsored by <span className="text-[var(--primary)]">WILEY </span> 
            </h6>
          <p className="text-lg text-[color:var(--nav)]/80 max-w-2xl mx-auto">
            Recognizing outstanding contributions — awards will be presented during the closing ceremony.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AwardCard
            icon={Award}
            title="Best Thesis Award"
            description="Thesis awarded or submitted between 1 May 2024 – 30th April 2026 will be eligible. Selected by technical program committee."
            awardCount="3"
            prize="Certificate + Rs 25,000 (or Equivalent)"
            criteria="Novelty, significance, outcome"
          />

          <AwardCard
            icon={Award}
            title="Oral Presentation Award"
            description="Awarded to the top oral presenter for clarity, scientific merit, and impact. Selected by technical program committee."
            awardCount="3"
            prize="Certificate + ₹10,000 (or equivalent)"
            criteria="Novelty, clarity, significance"
          />

          <AwardCard
            icon={Award}
            title="Poster Presentation Award"
            description="Exceptional poster presentations with clear visuals, strong results, and engaging communication. Selected by technical program committee."
            awardCount="3 in each theme, 12 Total"
            prize="Certificate + ₹5000 (or equivalent)"
            criteria="Visualisation, discussion, relevance"
          />

          <AwardCard
            icon={Award}
            title="Special Mention"
            description="Reserved for additional awards (student category, industry collaboration, or community choice). Details to be announced."
            awardCount="To be announced"
            prize="To be announced"
            criteria="To be finalized"
          />
        </div>
      </div>
    </section>
  );
}
