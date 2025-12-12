"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CommitteeMember {
  name: string
  affiliation: string
  initials: string
}

export default function OrganisingCommitteeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerSlide, setItemsPerSlide] = useState(4)

  const committee: CommitteeMember[] = [
    { name: "Dr. Rupesh Devan", affiliation: "Indian Institute of Technology, Indore", initials: "RD" },
    { name: "Dr. K.V Vamsi", affiliation: "Indian Institute of Technology, Indore", initials: "KV" },
    { name: "Dr. Ravindra Jangir", affiliation: "Indian Institute of Technology, Indore", initials: "RJ" },
    { name: "Dr. Ram J. Choudhary", affiliation: "Indian Institute of Technology, Indore", initials: "RC" },
    { name: "Mr. Unmesh D. Malshe", affiliation: "Director, RRCAT, India", initials: "UM" },
    { name: "Prof. Kalobarun Maiti", affiliation: "Director, IACS Kolkata, India", initials: "KM" },
    { name: "Dr. R. Balamuralikrishnan", affiliation: "Director, DMRL, India", initials: "RB" },
  ]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerSlide(1)
      else if (window.innerWidth < 1024) setItemsPerSlide(2)
      else if (window.innerWidth < 1280) setItemsPerSlide(3)
      else setItemsPerSlide(4)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, committee.length - itemsPerSlide)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
  }

  const visibleMembers = committee.slice(currentIndex, currentIndex + itemsPerSlide)

  return (
    <div className="py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {visibleMembers.map((member, idx) => (
          <div key={currentIndex + idx} className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-300">
              <div className="h-32 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center group-hover:shadow-lg transition-transform">
                <span className="text-4xl font-bold text-white">{member.initials}</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2 group-hover:text-slate-700 transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2">{member.affiliation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-gradient-to-r from-slate-600 to-slate-800 text-white hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(committee.length / itemsPerSlide) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === Math.floor(currentIndex)
                  ? "bg-gradient-to-r from-slate-600 to-slate-800 w-8"
                  : "bg-slate-300 w-2.5 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-gradient-to-r from-slate-600 to-slate-800 text-white hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="text-center mt-8">
        <p className="text-slate-600 text-sm">
          Showing {currentIndex + 1} - {Math.min(currentIndex + itemsPerSlide, committee.length)} of {committee.length}{" "}
          members
        </p>
      </div>
    </div>
  )
}
