"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface CommitteeMember {
  name: string
  affiliation: string
  initials: string
}

export default function InternationalAdvisoryCarousel() {
  const committee: CommitteeMember[] = [
    { name: "Prof. Kourosh Kalantar-Zadeh", affiliation: "University of Sydney, Australia", initials: "KK" },
    { name: "Prof. Robert Weatherup", affiliation: "University of Oxford, UK", initials: "RW" },
    { name: "Prof. T. Venky Venkatesan", affiliation: "University of Oklahoma, USA", initials: "TV" },
    { name: "Prof. Anirudha V. Sumant", affiliation: "Argonne National Laboratory, USA", initials: "AS" },
    { name: "Prof. Sebastien Royer", affiliation: "Univ. du Littoral Côte d'Opale, France", initials: "SR" },
    { name: "Prof. Yogendra Mishra", affiliation: "University of Southern Denmark, Denmark", initials: "YM" },
    { name: "Prof. Sanjay Mathur", affiliation: "Director, IIMC, University of Cologne, Germany", initials: "SM" },
    { name: "Prof. Jin-Hyeok Kim", affiliation: "Chonnam National University, South Korea", initials: "JK" },
    { name: "Prof. Bharat Jalan", affiliation: "University of Minnesota, USA", initials: "BJ" },
    { name: "Prof. Motohiko Ezawa", affiliation: "University of Tokyo, Japan", initials: "ME" },
    { name: "Prof. Babak Anasori", affiliation: "Purdue University, USA", initials: "BA" },
    { name: "Prof. Yuan-Ron Ma", affiliation: "Vice-President, Fo Guang University, Taiwan", initials: "YM" },
  ]

  return (
    <div className="py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {committee.map((member, idx) => (
          <div key={idx} className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-300">
              <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:shadow-lg transition-transform">
                <span className="text-4xl font-bold text-white">{member.initials}</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2">{member.affiliation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
