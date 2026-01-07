import { Button } from "@/components/ui/button"
export default function PaperSubmission() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-8">
          <span className="text-[var(--primary)]">Paper </span>Submission</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Guidelines Section */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-[var(--card)] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Submission Requirements</h2>
              <ul className="space-y-3 text-[var(--muted-foreground)] text-sm">
                <li className="flex items-start">
                  <span className="text-[var(--primary)] font-bold mr-2">•</span>
                  <span>Only unpublished work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] font-bold mr-2">•</span>
                  <span>100-250 words abstract</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] font-bold mr-2">•</span>
                  <span>Include keywords</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] font-bold mr-2">•</span>
                  <span>High-quality papers invited for SCI journals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] font-bold mr-2">•</span>
                  <span>Selected: full paper (6-8 pages)</span>
                </li>
              </ul>
            </div>

            <div className="bg-[var(--muted)] border-l-4 border-[var(--primary)] rounded-lg p-4">
              <h3 className="font-bold text-[var(--nav)] mb-2">Important Dates</h3>
              <p className="text-sm text-[var(--primary)] mb-1">
                <strong>Submission:</strong> April 30, 2026
              </p>
              <p className="text-sm text-[var(--primary)]">
                <strong>Notification:</strong> May 15, 2026
              </p>
            </div>
          </div>

          {/* Submission Section */}
          <div className="md:col-span-2 bg-[var(--card)] rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Submit Your Abstract</h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              Submit your abstract through our Microsoft CMT portal.
            </p>
            <a
              href="https://cmt3.research.microsoft.com/2DMTG2026"            // ← put your CMT URL here
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--primary)] text-white font-semibold py-3 px-8 rounded-lg cursor-pointer"
              aria-label="CMT submission (opens in a new tab)"
            >
              Paper Submission on Microsoft CMT 
            </a>

            {/* Acknowledgment */}
            <div className="mt-6 bg-[var(--muted)] rounded-lg p-4">
              <p className="text-xs text-[var(--muted-foreground)]">
                <strong>ACKNOWLEDGMENT:</strong> The Microsoft CMT service was used for managing the peer-reviewing process for this conference. This service was provided for free by Microsoft and they bore all expenses, including costs for Azure cloud services as well as for software development and support.
              </p>
            </div>

            <div className="mt-6">
              <p className="text-[var(--muted-foreground)] mb-3 text-sm">Download Templates:</p>
              <div className="flex gap-4">
                <a
                  href="/Abstract_Format.docx"
                  download
                  className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--nav)] font-medium text-sm transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 7H7v6h6V7z" />
                    <path fillRule="evenodd" d="M3 3a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm2 0v14h10V3H5z" clipRule="evenodd" />
                  </svg>
                  Word Template (.docx)
                </a>
                <a
                  href="/Abstract_Template.tex"
                  download
                  className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--nav)] font-medium text-sm transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 7H7v6h6V7z" />
                    <path fillRule="evenodd" d="M3 3a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm2 0v14h10V3H5z" clipRule="evenodd" />
                  </svg>
                  LaTeX Template (.tex)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
