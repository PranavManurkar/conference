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
    name: "Prof. Amlan J. Pal",
    affiliation: "Ex. Director, UGC-DAE-CSR, India; Professor & JC Bose National Fellow, IACS, Kolkata",
    initials: "AP",
    image: "/invited_speaker/amlan.png",
  },
  {
    name: "Prof. Anirudha V. Sumant",
    affiliation: "Group Leader, Center for Nanoscale Materials, Argonne National Laboratory, USA",
    initials: "AS",
    image: "/invited_speaker/sumant.jpg",
  },
  {
    name: "Prof. Babak Anasori",
    affiliation: "Reilly Associate Professor, Purdue University, USA",
    initials: "BA",
    image: "/invited_speaker/anasori.jpg",
  },
  {
    name: "Prof. Bharat Jalan",
    affiliation: "University of Minnesota, USA",
    initials: "BJ",
    image: "/invited_speaker/jalan.jpg",
  },
  {
    name: "Prof. Bikramjit Basu",
    affiliation: "Director, CSIR-CGCRI, India",
    initials: "BB",
    image: "/invited_speaker/basu.jpg",
  },
  {
    name: "Dr. R. Balamuralikrishnan",
    affiliation: "Outstanding Scientist / Director, Defence Metallurgical Research Laboratory (DMRL), Hyderabad",
    initials: "RB",
    image: "/invited_speaker/bala.jpg",
  },
  {
    name: "Prof. Kaustubh R. S. Priolkar",
    affiliation: "Director, UGC-DAE CSR; Senior Professor of Physics, Goa University, India",
    initials: "KP",
    image: "/invited_speaker/priolkar.jpg",
  },
  {
    name: "Prof. Kourosh Kalantar-Zadeh",
    affiliation: "Professor & Academic Lead, University of Sydney, Australia",
    initials: "KK",
    image: "/invited_speaker/zadeh.png",
  },
  {
    name: "Prof. Kalobaran Maiti",
    affiliation: "Director, IACS Kolkata, India",
    initials: "KM",
    image: "/invited_speaker/maiti.jpg",
  },
  {
    name: "Prof. Jin-Hyeok Kim",
    affiliation: "Professor, Chonnam National University, South Korea",
    initials: "JK",
    image: "/invited_speaker/kim.jpg",
  },
  {
    name: "Prof. Motohiko Ezawa",
    affiliation: "Professor, University of Tokyo, Japan",
    initials: "ME",
    image: "/invited_speaker/ezawa.jpg",
  },
  {
    name: "Prof. Robert Weatherup",
    affiliation: "Associate Professor, Materials Science, University of Oxford, UK",
    initials: "RW",
    image: "/invited_speaker/robert.jpg",
  },
  {
    name: "Prof. S. B. Ogale",
    affiliation: "Director, RISE; Emeritus Professor, IISER Pune, India",
    initials: "SO",
    image: "/invited_speaker/ogale.jpg",
  },
  {
    name: "Prof. Sanjay Mathur",
    affiliation: "Director, IIMC; University of Cologne, Germany",
    initials: "SM",
    image: "/invited_speaker/mathur.jpg",
  },
  {
    name: "Prof. Sebastien Royer",
    affiliation: "Université du Littoral Côte d'Opale, France",
    initials: "SR",
    image: "/invited_speaker/royer.png",
  },
  {
    name: "Prof. T. Venky Venkatesan",
    affiliation: "Director, CQRT; University of Oklahoma, USA",
    initials: "TV",
    image: "/invited_speaker/venky.png",
  },
  {
    name: "Prof. Umesh V Waghmare",
    affiliation: "President, JNCASR, Bangalore, India",
    initials: "UW",
    image: "/invited_speaker/umesh.png",
  },
  {
    name: "Mr. Unmesh D. Malshe",
    affiliation: "Director, RRCAT, India",
    initials: "UM",
    image: "/invited_speaker/malshe.png",
  },
  {
    name: "Prof. Yogendra Mishra",
    affiliation: "Professor, University of Southern Denmark; FRSC (Fellow Royal Society of Chemistry)",
    initials: "YM",
    image: "/invited_speaker/yog.png",
  },
  {
    name: "Prof. Yuan-Ron Ma",
    affiliation: "Vice President & Chair Professor, Fo Guang University; NDHU, Taiwan",
    initials: "YM",
    image: "/invited_speaker/ma3.jpg",
  },
];



  return (
    <div className="py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {committeeMembers.map((member, idx) => (
          <div key={idx} className="group">
            <div className="bg-[color:var(--primary-foreground)] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[color:var(--nav)]/10 hover:border-[color:var(--primary)] h-full flex flex-col">

              {/* Avatar Section */}
              <div className="h-32 bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--nav)] flex items-center justify-center p-4">
                <div className="relative h-32 w-32 rounded-full bg-[color:var(--primary-foreground)] p-1 shadow-md">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="400px"
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full rounded-full bg-[color:var(--nav)]/10 text-[color:var(--nav)] font-semibold text-lg">
                      {member.initials}
                    </div>
                  )}
                </div>
              </div>

              {/* Text Section */}
              <div className="p-6">
                <h3 className="font-bold text-[color:var(--nav)] text-base mb-2 line-clamp-2 group-hover:text-[color:var(--primary)] transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-[color:var(--nav)]/80 line-clamp-2">
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
