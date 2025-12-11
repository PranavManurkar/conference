'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const CommitteeMember = ({ name, affiliation }: { name: string; affiliation: string }) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <p className="font-semibold text-gray-900">{name}</p>
    <p className="text-sm text-gray-600 mt-1">{affiliation}</p>
  </div>
)

export default function AdvisoryCommittee() {
  const [expanded, setExpanded] = useState(false)

  const committee = [
    { name: 'Prof. Kourosh Kalantar-Zadeh', affiliation: 'University of Sydney, Australia' },
    { name: 'Prof. Robert Weatherup', affiliation: 'University of Oxford, UK' },
    { name: 'Prof. Umesh V Waghmare', affiliation: 'President, JNCASR Bangalore, India' },
    { name: 'Prof. T. Venky Venkatesan', affiliation: 'Univ. of Oklahoma, USA' },
    { name: 'Prof. Anirudha V. Sumant', affiliation: 'Argonne National Laboratory, USA' },
    { name: 'Prof. Sebastien Royer', affiliation: 'Univ. du Littoral Côte d\'Opale, France' },
    { name: 'Prof. Kaustubh R. S. Priolkar', affiliation: 'Director, UGC-DAE CSR, India' },
    { name: 'Prof. Amlan J. Pal', affiliation: 'Ex. Director UGC-DAE-CSR, India' },
    { name: 'Prof. S. B. Ogale', affiliation: 'Director TCG-CREST, IISER Pune, India' },
    { name: 'Prof. Yogendra Mishra', affiliation: 'Univ. of Southern Denmark, Denmark' },
    { name: 'Prof. Sanjay Mathur', affiliation: 'Director, IIMC, Univ. of Cologne, Germany' },
    { name: 'Mr. Unmesh D. Malshe', affiliation: 'Director, RRCAT, India' },
    { name: 'Prof. Kalobarun Maiti', affiliation: 'Director, IACS Kolkata, India' },
    { name: 'Prof. Yuan-Ron Ma', affiliation: 'Vice-President, Fo Guang Univ., Taiwan' },
    { name: 'Prof. Jin-Hyeok Kim', affiliation: 'Chonnam National Univ., South Korea' },
    { name: 'Prof. Bharat Jalan', affiliation: 'University of Minnesota, USA' },
    { name: 'Prof. Motohiko Ezawa', affiliation: 'Univ. of Tokyo, Japan' },
    { name: 'Dr. R. Balamuralikrishnan', affiliation: 'Director, DMRL, India' },
    { name: 'Prof. Bikramjit Basu', affiliation: 'Director, CSIR-CGCRI, India' },
    { name: 'Prof. Babak Anasori', affiliation: 'Purdue University, USA' },
  ]

  const displayedMembers = expanded ? committee : committee.slice(0, 6)

  return (
    <section id="committee" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          <span className="text-blue-600">Advisory</span> Committee
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {displayedMembers.map((member, idx) => (
            <CommitteeMember key={idx} {...member} />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <span>{expanded ? 'Show Less' : 'View All Committee Members'}</span>
            <ChevronDown size={20} className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </section>
  )
}
