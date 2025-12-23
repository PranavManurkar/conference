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
  note,
}: {
  icon: any;
  title: string;
  description: string;
  note?: string;
}) => {
  return (
    <div className="bg-[color:var(--primary-foreground)] rounded-xl shadow-md p-6 border border-[color:var(--nav)]/10 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-12 h-12 bg-[color:var(--primary)]/10 rounded-lg flex items-center justify-center shrink-0">
          <Icon size={24} className="text-[color:var(--primary)]" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[color:var(--nav)]">{title}</h3>
          <p className="text-[color:var(--nav)]/80 text-sm leading-relaxed mt-1">{description}</p>
        </div>
      </div>

      {note && <div className="mt-4 text-xs text-[color:var(--nav)]/60">{note}</div>}
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
          <p className="text-lg text-[color:var(--nav)]/80 max-w-2xl mx-auto">
            Recognizing outstanding contributions — awards will be presented during the closing ceremony.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AwardCard
            icon={Award}
            title="Oral Presentation Award"
            description="Awarded to the top oral presenter for clarity, scientific merit, and impact. Selected by the technical program committee."
            note="Prize: Certificate + ₹10,000 (or equivalent) • Criteria: novelty, clarity, significance"
          />

          <AwardCard
            icon={Award}
            title="Poster / Presentation Award"
            description="Recognizes exceptional poster presentations with clear visuals, strong results, and engaging communication."
            note="Prize: Certificate + ₹7,500 (or equivalent) • Criteria: visualization, discussion, relevance"
          />

          <AwardCard
            icon={Award}
            title="Special Mention (Placeholder)"
            description="This slot is reserved for additional awards (student category, industry collaboration, or community choice). Details to be announced."
            note="Placeholder — finalize award category & prize before printing materials."
          />
        </div>
      </div>
    </section>
  );
}
