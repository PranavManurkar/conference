"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function InvitedSpeakersCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const speakers = [
    { name: "Prof. Kourosh Kalantar-Zadeh", title: "University of Sydney", affiliation: "Australia" },
    { name: "Prof. Robert Weatherup", title: "University of Oxford", affiliation: "UK" },
    { name: "Prof. Umesh V Waghmare", title: "President, JNCASR", affiliation: "Bangalore, India" },
    { name: "Prof. T. Venky Venkatesan", title: "University of Oklahoma", affiliation: "USA" },
    { name: "Prof. Anirudha V. Sumant", title: "Argonne National Laboratory", affiliation: "USA" },
    { name: "Prof. Sebastien Royer", title: "Univ. du Littoral Côte d'Opale", affiliation: "France" },
    { name: "Prof. Kaustubh R. S. Priolkar", title: "Director, UGC-DAE CSR", affiliation: "India" },
    { name: "Prof. Amlan J. Pal", title: "Ex. Director UGC-DAE-CSR", affiliation: "India" },
    { name: "Prof. S. B. Ogale", title: "Director TCG-CREST, IISER Pune", affiliation: "India" },
    { name: "Prof. Yogendra Mishra", title: "University of Southern Denmark", affiliation: "Denmark" },
  ]

  const itemsPerSlide = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  }

  const getItemsToShow = () => {
    if (typeof window === "undefined") return itemsPerSlide.desktop
    const width = window.innerWidth
    if (width < 768) return itemsPerSlide.mobile
    if (width < 1024) return itemsPerSlide.tablet
    return itemsPerSlide.desktop
  }

  const [itemsToShow, setItemsToShow] = useState(itemsPerSlide.desktop)

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? Math.ceil(speakers.length / itemsToShow) - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === Math.ceil(speakers.length / itemsToShow) - 1 ? 0 : prev + 1))
  }

  const visibleSpeakers = speakers.slice(currentSlide * itemsToShow, (currentSlide + 1) * itemsToShow)

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Invited Speakers</h2>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            className="flex-shrink-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleSpeakers.map((speaker, index) => (
              <div
                key={currentSlide * itemsToShow + index}
                className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-blue-200"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {speaker.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{speaker.name}</h3>
                <p className="text-blue-600 text-xs font-semibold mb-1">{speaker.title}</p>
                <p className="text-gray-600 text-xs">{speaker.affiliation}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex-shrink-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(speakers.length / itemsToShow) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
