'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CommitteeMember {
  name: string
  affiliation: string
  initials: string
}

export default function CommitteeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerSlide, setItemsPerSlide] = useState(4)

  const committee: CommitteeMember[] = [
    { name: 'Prof. Kourosh Kalantar-Zadeh', affiliation: 'University of Sydney, Australia', initials: 'KK' },
    { name: 'Prof. Robert Weatherup', affiliation: 'University of Oxford, UK', initials: 'RW' },
    { name: 'Prof. Umesh V Waghmare', affiliation: 'JNCASR Bangalore, India', initials: 'UW' },
    { name: 'Prof. T. Venky Venkatesan', affiliation: 'Univ. of Oklahoma, USA', initials: 'TV' },
    { name: 'Prof. Anirudha V. Sumant', affiliation: 'Argonne National Lab, USA', initials: 'AS' },
    { name: 'Prof. Sebastien Royer', affiliation: 'Univ. Côte d\'Opale, France', initials: 'SR' },
    { name: 'Prof. Kaustubh R. S. Priolkar', affiliation: 'UGC-DAE CSR, India', initials: 'KP' },
    { name: 'Prof. Amlan J. Pal', affiliation: 'UGC-DAE-CSR, India', initials: 'AP' },
    { name: 'Prof. S. B. Ogale', affiliation: 'TCG-CREST & IISER Pune, India', initials: 'SO' },
    { name: 'Prof. Yogendra Mishra', affiliation: 'Univ. of Southern Denmark', initials: 'YM' },
    { name: 'Prof. Sanjay Mathur', affiliation: 'Univ. of Cologne, Germany', initials: 'SM' },
    { name: 'Mr. Unmesh D. Malshe', affiliation: 'RRCAT, India', initials: 'UM' },
    { name: 'Prof. Kalobarun Maiti', affiliation: 'IACS Kolkata, India', initials: 'KM' },
    { name: 'Prof. Yuan-Ron Ma', affiliation: 'Fo Guang University, Taiwan', initials: 'YM' },
    { name: 'Prof. Jin-Hyeok Kim', affiliation: 'Chonnam National Univ., Korea', initials: 'JK' },
    { name: 'Prof. Bharat Jalan', affiliation: 'University of Minnesota, USA', initials: 'BJ' },
    { name: 'Prof. Motohiko Ezawa', affiliation: 'University of Tokyo, Japan', initials: 'ME' },
    { name: 'Dr. R. Balamuralikrishnan', affiliation: 'DMRL, India', initials: 'RB' },
    { name: 'Prof. Bikramjit Basu', affiliation: 'CSIR-CGCRI, India', initials: 'BB' },
    { name: 'Prof. Babak Anasori', affiliation: 'Purdue University, USA', initials: 'BA' },
  ]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerSlide(1)
      else if (window.innerWidth < 1024) setItemsPerSlide(2)
      else if (window.innerWidth < 1280) setItemsPerSlide(3)
      else setItemsPerSlide(4)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, committee.length - itemsPerSlide)

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev === maxIndex ? 0 : prev + 1))
  }

  const visibleMembers = committee.slice(currentIndex, currentIndex + itemsPerSlide)

  return (
    <section id="committee" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Advisory</span>
            {' '}Committee
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Meet the world-class experts guiding our conference towards groundbreaking research in 2D materials
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {visibleMembers.map((member, idx) => (
              <div
                key={currentIndex + idx}
                className="group animate-fade-in"
              >
                {/* Member Card */}
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-300">
                  {/* Avatar */}
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:shadow-lg transition-transform">
                    <span className="text-4xl font-bold text-white">{member.initials}</span>
                  </div>

                  {/* Content */}
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

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Previous members"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Slide Indicators */}
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(committee.length / itemsPerSlide) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === Math.floor(currentIndex) 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 w-8' 
                      : 'bg-slate-300 w-2.5 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Next members"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Info Text */}
          <div className="text-center mt-8">
            <p className="text-slate-600 text-sm">
              Showing {currentIndex + 1} - {Math.min(currentIndex + itemsPerSlide, committee.length)} of {committee.length} members
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
