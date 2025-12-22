"use client"

import Image from "next/image"

interface CommitteeMember {
  name: string
  affiliation: string
  initials: string
  image?: string
}

export default function InternationalAdvisoryCarousel() {
  const committeeMembers: CommitteeMember[] = [
    {
      name: "Prof. Kourosh Kalantar-Zadeh",
      affiliation: "University of Sydney, Australia",
      initials: "KK",
      image: "/invited_speaker/zadeh.png",
    },
    {
      name: "Prof. Robert Weatherup",
      affiliation: "University of Oxford, UK",
      initials: "RW",
      image: "/invited_speaker/robert.jpg",
    },
    {
      name: "Prof. T. Venky Venkatesan",
      affiliation: "University of Oklahoma, USA",
      initials: "TV",
      image: "/invited_speaker/venky.png",
    },
    {
      name: "Prof. Anirudha V. Sumant",
      affiliation: "Argonne National Laboratory, USA",
      initials: "AS",
      image: "/invited_speaker/sumant.jpg",
    },
    {
      name: "Prof. Sebastien Royer",
      affiliation: "Univ. du Littoral Côte d'Opale, France",
      initials: "SR",
      image: "/invited_speaker/royer.png",
    },
    {
      name: "Prof. Yogendra Mishra",
      affiliation: "University of Southern Denmark, Denmark",
      initials: "YM",
      image: "/invited_speaker/yog.png",
    },
    {
      name: "Prof. Sanjay Mathur",
      affiliation: "Director, IIMC, University of Cologne, Germany",
      initials: "SM",
      image: "/invited_speaker/mathur.jpg",
    },
    {
      name: "Prof. Jin-Hyeok Kim",
      affiliation: "Chonnam National University, South Korea",
      initials: "JK",
      image: "/invited_speaker/kim.jpg",
    },
    {
      name: "Prof. Bharat Jalan",
      affiliation: "University of Minnesota, USA",
      initials: "BJ",
      image: "/invited_speaker/jalan.jpg",
    },
    {
      name: "Prof. Motohiko Ezawa",
      affiliation: "University of Tokyo, Japan",
      initials: "ME",
      image: "/invited_speaker/ezawa.jpg",
    },
    {
      name: "Prof. Babak Anasori",
      affiliation: "Purdue University, USA",
      initials: "BA",
      image: "/invited_speaker/anasori.jpg",
    },
    {
      name: "Prof. Yuan-Ron Ma",
      affiliation: "Vice-President, Fo Guang University, Taiwan",
      initials: "YM",
      image: "/invited_speaker/ma.jpg",
    },
  ]

  return (
    <div className="py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {committeeMembers.map((member, idx) => (
          <div key={idx} className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-300">

              {/* Avatar Section */}
              <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <div className="relative h-24 w-24 rounded-full bg-white p-1 shadow-md">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="96px"
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full rounded-full bg-slate-200 text-slate-700 font-semibold text-lg">
                      {member.initials}
                    </div>
                  )}
                </div>
              </div>

              {/* Text Section */}
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {member.affiliation}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
