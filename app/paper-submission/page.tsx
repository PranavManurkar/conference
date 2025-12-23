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
                <strong>Submission:</strong> March 25, 2026
              </p>
              <p className="text-sm text-[var(--primary)]">
                <strong>Notification:</strong> April 25, 2026
              </p>
            </div>
          </div>

          {/* Submission Section */}
          <div className="md:col-span-2 bg-[var(--card)] rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Submit Your Abstract</h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              Submit your abstract through our Microsoft CMT portal. Click the button below to proceed with your
              submission.
            </p>
            <a
              href="https://cmt3.research.microsoft.com/2dmattechglobal2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--nav)] text-[var(--primary-foreground)] font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Submit Abstract on CMT
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
