'use client'

import { Mail, Phone, MapPin } from 'lucide-react'

const ContactCard = ({ icon: Icon, title, details }: { icon: any; title: string; details: string[] }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <Icon className="h-6 w-6 text-blue-600 mr-3" />
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
    <ul className="space-y-2">
      {details.map((detail, idx) => (
        <p key={idx} className="text-gray-700 text-sm">{detail}</p>
      ))}
    </ul>
  </div>
)

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          <span className="text-blue-600">Contact</span> Information
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
              'Dr. Rupesh S Devan: +91-8308208880',
              'Dr. Ravindra Jangir: +91-9229236404',
              'Dr. Ram J. Choudhary: +91-9893849446',
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

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">General Inquiries</h3>
          <p className="text-gray-700 mb-4">
            For general questions and registration support, please contact:
          </p>
          <a href="mailto:arrnd@iiti.ac.in" className="text-blue-600 font-bold text-lg hover:text-blue-700">
            arrnd@iiti.ac.in
          </a>
        </div>
      </div>
    </section>
  )
}
