"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, User } from "lucide-react"

interface Speaker {
  name: string
  title: string
  affiliation: string
  image?: string
}

export default function InvitedSpeakersCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

const speakers: Speaker[] = [
  { name: "Prof. Umesh V Waghmare", title: "President", affiliation: "President, JNCASR Bangalore, India", image: "/invited_speaker/umesh.png" },
  { name: "Dr. K. Pillai Vijayamohanan", title: "Professor", affiliation: "Professor, IISER Tirupati Honorary Fellow Electrochemical Society of India.", image: "/invited_speaker/pillai.png" },
  { name: "Prof. S. B. Ogale", title: "Director, RISE; Emeritus Professor", affiliation: "Director, RISE, TCG-CREST, Kolkata, India. Emeritus Professor, IISER Pune, India.", image: "/invited_speaker/ogale.jpg" },
  { name: "Prof. Sanjay Mathur", title: "Director, IIMC", affiliation: "Director, IIMC, Univ. of Cologne, Germany", image: "/invited_speaker/mathur.jpg" },
  { name: "Prof. Sebastien Royer", title: "Professor", affiliation: "Distinguished Professor of Chemistry, Université du Littoral Côte d'Opale (ULCO) in France", image: "/invited_speaker/royer2.jpg" },
  { name: "Prof. Anirudha V. Sumant", title: "Group Leader / Scientist", affiliation: "Group Leader Nanofabrication and Devices, Argonne National Lab., USA", image: "/invited_speaker/sumant.png" },
  { name: "Prof. Yuan-Ron Ma", title: "Vice President & Chair Professor", affiliation: "Vice President & Chair Professor, Fo Guang University, Yilan, Taiwan. Distinguished Professor, National Dong Hwa University, Hualien, Taiwan.", image: "/invited_speaker/ma3.jpg" },
  { name: "Prof. Jin-Hyeok Kim", title: "Professor", affiliation: "Professor, Chonnam National University, South Korea.", image: "/invited_speaker/kim.jpg" },
  { name: "Prof. Soon Hyung Kang", title: "Professor", affiliation: "Professor, Chonnam National University, South Korea.", image: "/invited_speaker/kang.jpg" },
  { name: "Prof. Sumeet Walia", title: "Professor; Director, COMAS", affiliation: "Professor & Director, RMIT COMAS, RMIT University, Australia.", image: "/invited_speaker/walia3.jpg" },
  { name: "Prof. Somnath C. Roy", title: "Professor", affiliation: "Professor in Physics, IIT Madras", image: "/invited_speaker/roy.png" },
  { name: "Prof. Yogendra Mishra", title: "Professor", affiliation: "Professor, Univ. of Southern, Denmark", image: "/invited_speaker/yog.png" },
  { name: "Prof. Bharat Jalan", title: "Professor", affiliation: "Professor, Univ. of Minnesota, USA", image: "/invited_speaker/jalan.jpg" },
  { name: "Prof. Vilas Pol", title: "Professor", affiliation: "Professor, Purdue University, USA", image: "/invited_speaker/pol.jpg" },
  { name: "Prof. Priya Mahadevan", title: "Senior Professor", affiliation: "Senior Professor, S. N. Bose Kolkata", image: "/invited_speaker/priya.png" },
  { name: "Dr. Surendra Singh", title: "Scientific Officer, SSPD", affiliation: "SO/H, SSPD, BARC, Mumbai, India.", image: "/invited_speaker/singh.jpg" },
  { name: "Prof. Babak Anasori", title: "Reilly Associate Professor", affiliation: "Reilly Associate Professor, Purdue University, USA.", image: "/invited_speaker/anasori.jpg" },
  { name: "Prof. Sandip Ghosh", title: "Professor", affiliation: "Professor, TIFR, Mumbai", image: "/invited_speaker/gosh.png" },
  { name: "Prof. Abha Misra", title: "Professor", affiliation: "Professor, IISc, Bangalore", image: "/invited_speaker/abha.jpg" },
  { name: "Prof. Mahesh Kumar", title: "Professor", affiliation: "Professor, IIT Jodhpur Associate Editor, IEEE Sensors Journal.", image: "/invited_speaker/mah.png" },
  { name: "Prof. Samaresh Das", title: "Professor (CARE)", affiliation: "Professor, CARE, IIT Delhi", image: "/invited_speaker/das.jpg" },
  { name: "Prof. Chandra Sekhar Sharma", title: "Head, Chemical Engineering", affiliation: "Professor & Head, Chemical Engineering, IIT Hyderabad", image: "/invited_speaker/sharma.png" },
  { name: "Prof. Suman Kalyan Pal", title: "Professor", affiliation: "Professor in Physics, IIT Mandi", image: "/invited_speaker/pal.png" },
  { name: "Prof. Pavan Nukala", title: "Associate Professor", affiliation: "Associate Professor, IISc, Bangalore", image: "/invited_speaker/pavam.jpg" },
  { name: "Prof. B. Ranjit Kumar Nanda", title: "Associate Professor", affiliation: "Associate Professor, IIT Madras", image: "/invited_speaker/ran.png" },
  { name: "Prof. Mahesh Suryavanshi", title: "ARC DECRA Fellow & Lecturer in SPREE", affiliation: "ARC DECRA Fellow & Lecturer in SPREE, University of New South Wales (UNSW), Sydney, Australia.", image: "/invited_speaker/mahesh.jpg" },
  { name: "Prof. K. D. M. Rao", title: "Assistant Professor", affiliation: "Assistant Professor, IACS Kolkata", image: "/invited_speaker/rao.png" },
  { name: "Dr. Ashish Mishra", title: "Associate Professor", affiliation: "Associate Professor, IIT BHU", image: "/invited_speaker/ashish.png" },
  { name: "Prof. Murli Devraj", title: "Associate Professor", affiliation: "Associate Professor, IIITDM, Kurnool", image: "/invited_speaker/dev.png" },
  { name: "Dr. Dhiraj Bhatia", title: "Assistant Professor", affiliation: "Associate Professor in Biological Engineering, IIT Gandhinagar", image: "/invited_speaker/bhatia2.png" },
  { name: "Prof. Tanushree Choudhury", title: "Assistant Professor", affiliation: "Assistant Professor, IIT Bombay", image: "/invited_speaker/tanu.png" },
  { name: "Dr. Ashutosh Singh", title: "Material Scientist", affiliation: "CeNS, Bangalore", image: "/invited_speaker/scientist.jpeg" },
  { name: "Prof. Pankaj Koinkar", title: "Professor", affiliation: "Institute of Post-LED Photonics, Tokushima University, Japan", image: "/invited_speaker/Professor.png" },
];




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
    <div className="w-full bg-[color:var(--primary-foreground)] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-[color:var(--nav)] mb-12 text-center">
          <span className="text-[color:var(--primary)]"> Invited </span>
          Speakers
        </h2>
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            className="flex-shrink-0 p-2 rounded-full bg-[color:var(--primary)] text-white hover:bg-[color:var(--nav)] transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleSpeakers.map((speaker, index) => (
              <div
                key={currentSlide * itemsToShow + index}
                className="bg-[color:var(--primary-foreground)] rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-[color:var(--nav)]/10"
              >
                {/* Image Section */}
                <div className="w-full h-48 bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--nav)] flex items-center justify-center p-4">
                  {speaker.image ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[color:var(--primary-foreground)] shadow-lg flex-shrink-0">
                      <Image
                        src={speaker.image}
                        alt={speaker.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[color:var(--nav)]/10 to-[color:var(--nav)]/30 flex flex-col items-center justify-center border-4 border-[color:var(--primary-foreground)] shadow-lg">
                      <User className="h-12 w-12 text-white opacity-70 mb-2" />
                      <span className="text-white text-xs opacity-60">No Photo</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 text-center">
                  <h3 className="font-bold text-[color:var(--nav)] text-sm mb-1 line-clamp-2">{speaker.name}</h3>
                  <p className="text-[color:var(--primary)] text-xs font-semibold mb-1">{speaker.title}</p>
                  <p className="text-[color:var(--nav)]/80 text-xs line-clamp-2">{speaker.affiliation}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex-shrink-0 p-2 rounded-full bg-[color:var(--primary)] text-white hover:bg-[color:var(--nav)] transition-colors"
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
                index === currentSlide ? "bg-[color:var(--primary)]" : "bg-[color:var(--nav)]/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
