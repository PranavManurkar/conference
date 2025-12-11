"use client"

export default function Accommodation() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Accommodation</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Hotel Recommendations</h2>
            <p className="text-slate-700 mb-4">
              We have negotiated special rates with several hotels in Indore. Participants can book through our
              recommended hotels or arrange their own accommodation.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-slate-700 font-semibold">Recommended Hotels:</p>
              <ul className="list-disc list-inside mt-2 space-y-2 text-slate-700">
                <li>The Fern Hotels & Resorts - 5-star luxury</li>
                <li>Sayaji Indore - 4-star comfort</li>
                <li>Ramada Hotel Indore - 4-star business</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">On-Campus Accommodation</h2>
            <p className="text-slate-700 mb-4">
              Limited on-campus accommodation is available for participants. Priority will be given to students and
              researchers. Contact us for availability and booking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">How to Book</h2>
            <ol className="space-y-3 text-slate-700 list-decimal list-inside">
              <li>Register for the conference</li>
              <li>Provide accommodation preference in registration form</li>
              <li>We will send you details of recommended hotels with special discount codes</li>
              <li>Book directly with the hotel using the provided codes for discounts</li>
              <li>For on-campus accommodation, contact our committee directly</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Need Help?</h2>
            <p className="text-slate-700">Contact our organizing committee:</p>
            <div className="bg-slate-50 p-4 rounded-lg mt-3 space-y-2">
              <p className="text-slate-700">
                <span className="font-semibold">Email:</span> abc@iiti.ac.in
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Phone:</span> +91-1234567890
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Address:</span> IIT Indore, Khandwa Road, Simrol, Indore 453552, India
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
