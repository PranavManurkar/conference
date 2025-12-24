'use client'

import { Mail, Phone, MapPin } from 'lucide-react'

const ContactCard = ({ icon: Icon, title, details }: { icon: any; title: string; details: string[] }) => (
  <div className="bg-[color:var(--primary-foreground)] rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <Icon className="h-6 w-6 text-[color:var(--primary)] mr-3" />
      <h3 className="text-xl font-bold text-[color:var(--nav)]">{title}</h3>
    </div>
    <ul className="space-y-2">
      {details.map((detail, idx) => (
        <p key={idx} className="text-[color:var(--nav)]/80 text-sm">{detail}</p>
      ))}
    </ul>
  </div>
)

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-[color:var(--primary-foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-[color:var(--nav)] mb-12">
          <span className="text-[color:var(--primary)]">Contact</span> Information
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <ContactCard
            icon={Mail}
            title="Email"
            details={[
              'Dr. Rupesh S Devan: rupesh@iiti.ac.in',
              'Dr. Ravindra Jangir: ravindrajangir@rrcat.gov.in',
              'Dr. Ram J. Choudhary: ram@csr.res.in',
            ]}
          />
          <ContactCard
            icon={Phone}
            title="Phone"
            details={[
              'Mr. Rupesh S Devan: +91-1234567890',
              'Dr. Ravindra Jangir: +91-1234567890',
              'Dr. Ram J. Choudhary: +91-1234567890',
            ]}
          />
          <ContactCard
            icon={MapPin}
            title="Address"
            details={[
              'Department of Metallurgical Engineering',
              'Indian Institute of Technology Indore',
              'Khandwa Road, Simrol',
              'Indore 453552, India',
            ]}
          />
        </div>

        <div className="bg-[color:var(--primary-foreground)] rounded-lg p-8 text-center shadow-md">
          <h3 className="text-2xl font-bold text-[color:var(--nav)] mb-4">General Inquiries</h3>
          <p className="text-[color:var(--nav)]/80 mb-4">
            For general questions and registration support, please contact:
          </p>
          <a href="mailto:arrnd@iiti.ac.in" className="text-[color:var(--primary)] font-bold text-lg hover:underline">
            2dmtg@iiti.ac.in
          </a>
        </div>
      </div>
    </section>
  )
}
