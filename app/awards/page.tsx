export default function Awards() {
    const awards = [
      {
        title: "Ph.D. Thesis",
        count: "3 Awards",
        prize: "Certificate + ₹ 25,000 (or equivalent)",
        color: "var(--primary)",         // purple
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        ),
        details: [
          { label: "Number of Awards", value: "3 awards" },
          {
            label: "Eligibility",
            value: "Degree awarded within the last 3 years:",
            sub: [
              "Degree awarded after 01 May 2023, or",
              "Thesis submitted before 30 April 2026",
            ],
          },
          { label: "Guidlines", value: "", 
            sub:[
              "Abstract should be submitted to Microsoft CMT",
              "Template should be same as the abstract",
              "Title of abstract should be same as thesis",
              "Thesis submission for the award of a Ph.D. degree must be endorsed by the Head of Institution/Department.",
              "Ph.D. degree certificate must be provided if the degree has been awarded.",
              "Submit the thesis copy in PDF format",
              <>
              Submit best thesis entry along with above documents to{" "}
              <span style={{ color: "var(--primary)" }}>2dmtg@iiti.ac.in</span>{" "}
              with subject line <span>"Submission for best thesis award"</span>
            </>,
            ],
          },
          { label: "Prize", value: "Certificate + ₹ 25,000 (or equivalent)" },
        ],
        tagline: "Share your scientific journey with pride and shine on a global research platform.",
      },
      {
        title: "Oral Presentation",
        count: "3 Awards",
        prize: "Certificate + ₹ 10,000 (or equivalent)",
        color: "var(--primary)",         // purple
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        ),
        details: [
          { label: "Number of Awards", value: "3 awards" },
          { label: "Prize", value: "Certificate + ₹ 10,000 (or equivalent)" },
          { label: "Total Presentation Time", value: "(10 + 3) minutes" },
          { label: "Maximum Slides", value: "10 slides" },
          { label: "Template", value: "Coming soon! " },
        ],
        tagline: "Bring your ideas to the forefront, inspire the global research community, and gain international scientific visibility.",
      },
      {
        title: "Poster Presentation",
        count: "12 Awards",
        prize: "Certificate + ₹ 5,000 (or equivalent)",
        color: "var(--primary)",         // orange — middle card
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        ),
        details: [
          { label: "Number of Awards", value: "12 awards — 3 in each theme" },
          { label: "Prize", value: "Certificate + ₹ 5,000 (or equivalent)" },
          { label: "Poster Size", value: "80 cm (W) × 100 cm (H)" },
          { label: "Template",  value: (
            <a
            href="/Poster Templat1.pptx"
            download
            className="hover:underline font-medium transition-colors"
            style={{ color: "var(--primary)" }}
          >
            Click here
          </a>
        ), },
        ],
        tagline: "Present your research, compete with the best, and gain international recognition.",
      },
    ];
  
    return (
      <main className="min-h-screen bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 py-16">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-3">
              <span className="text-[var(--primary)]">Conference </span>Awards
            </h1>
            <h6 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                Sponsored by <span className="text-[var(--primary)]">WILEY </span> 
            </h6>
            <p className="text-[var(--muted-foreground)] text-base max-w-xl mx-auto">
              Recognize excellence across oral presentations, poster sessions, and doctoral research at{" "}
              <span className="font-semibold text-[var(--primary)]">2D MatTech Global 2026</span>.
            </p>
          </div>
  
          {/* Award Cards — 3 rows */}
          <div className="flex flex-col gap-8">
            {awards.map((award, idx) => (
              <div
                key={idx}
                className="bg-[var(--card)] rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row"
              >
                {/* Left accent panel */}
                <div
                  className="flex flex-col items-center justify-center px-6 py-8 md:w-52 shrink-0"
                  style={{ background: award.color }}
                >
                  <div className="text-white mb-3">{award.icon}</div>
                  <span className="text-white font-bold text-lg text-center leading-tight">
                    {award.title}
                  </span>
                  <span className="mt-3 bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                    {award.count}
                  </span>
                </div>
  
                {/* Main content */}
                <div className="flex-1 p-6 flex flex-col gap-4">
                  {/* Prize banner */}
                  <div
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold w-fit"
                    style={{
                      background: `color-mix(in srgb, ${award.color} 12%, transparent)`,
                      color: award.color,
                    }}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Prize: {award.prize}
                  </div>
  
                  {/* Detail bullets */}
                  <ul className="space-y-2">
                    {award.details.map((detail, i) => (
                      <li key={i} className="text-sm text-[var(--muted-foreground)]">
                        <div className="flex items-start gap-2">
                          <span
                            className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                            style={{ background: award.color }}
                          />
                          <span>
                            <span className="font-semibold text-[var(--foreground)]">{detail.label}:</span>{" "}
                            {detail.value}
                          </span>
                        </div>
                        {/* Sub-bullets for eligibility */}
                        {detail.sub && (
                          <ul className="mt-1.5 ml-8 space-y-1">
                            {detail.sub.map((s, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]">
                                <span
                                  className="mt-1 w-1.5 h-1.5 rounded-full shrink-0 opacity-70"
                                  style={{ background: award.color }}
                                />
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
  
                  {/* Tagline */}
                  <div
                    className="rounded-lg px-4 py-3 text-sm font-medium italic mt-auto"
                    style={{
                      background: `color-mix(in srgb, ${award.color} 8%, transparent)`,
                      color: award.color,
                      borderLeft: `3px solid ${award.color}`,
                    }}
                  >
                    "{award.tagline}"
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          {/* Footer note */}
          <div className="mt-10 bg-[var(--muted)] rounded-lg p-4 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">
              All awards will be presented at the{" "}
              <strong>2D MatTech Global Conference, June 24–26, 2026</strong>, Indian Institute of Technology Indore.
            </p>
          </div>
        </div>
      </main>
    );
  }