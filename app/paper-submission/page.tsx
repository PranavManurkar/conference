export default function PaperSubmission() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Paper Submission</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Guidelines Section */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Submission Requirements</h2>
              <ul className="space-y-3 text-slate-700 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span>Only unpublished work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span>100-250 words abstract</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span>Include keywords</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span>High-quality papers invited for SCI journals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span>Selected: full paper (6-8 pages)</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">Important Dates</h3>
              <p className="text-sm text-blue-800 mb-1">
                <strong>Submission:</strong> March 25, 2026
              </p>
              <p className="text-sm text-blue-800">
                <strong>Notification:</strong> April 25, 2026
              </p>
            </div>
          </div>

          {/* Submission Section */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Submit Your Abstract</h2>
            <p className="text-slate-600 mb-6">
              Submit your abstract through our Microsoft CMT portal. Click the button below to proceed with your
              submission.
            </p>
            <a
              href="https://cmt3.research.microsoft.com/2dmattechglobal2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Submit Abstract on CMT
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
