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
  { name: "Prof. Somnath C. Roy", title: "Professor in Physics", affiliation: "IIT Madras, India",image: "/invited_speaker/roy.png" },
  { name: "Prof. B. Ranjit Kumar Nanda", title: "Associate Professor", affiliation: "IIT Madras, India",image: "/invited_speaker/ran.png" },
  { name: "Prof. Yogendra Mishra", title: "Professor", affiliation: "University of Southern Denmark, Denmark", image: "/invited_speaker/yog.png" },
  { name: "Dr. K. Pillai Vijayamohanan", title: "Professor", affiliation: "IISER Tirupati, India", image: "/invited_speaker/pillai.png" },
  { name: "Prof. Priya Mahadevan", title: "Senior Professor", affiliation: "S. N. Bose Institute, Kolkata, India", image: "/invited_speaker/priya.png" },
  { name: "Prof. Mahesh Kumar", title: "Professor", affiliation: "IIT Jodhpur, India", image: "/invited_speaker/mah.png" },
  { name: "Prof. K. D. M. Rao", title: "Assistant Professor", affiliation: "IACS, India", image: "/invited_speaker/rao.png" },
  { name: "Prof. Anirudha V. Sumant", title: "Group Leader / Scientist", affiliation: "Argonne National Laboratory, USA", image: "/invited_speaker/sumant.png" },
  { name: "Prof. S. B. Ogale", title: "Director, RISE; Emeritus Professor", affiliation: "TCG-CREST / IISER Pune, India", image: "/invited_speaker/ogale.jpg" },
  { name: "Prof. Yuan-Ron Ma", title: "Vice President & Chair Professor", affiliation: "Fo Guang University / NDHU, Taiwan", image: "/invited_speaker/ma.jpg" },
  { name: "Prof. Jin-Hyeok Kim", title: "Professor", affiliation: "Chonnam National University, South Korea", image: "/invited_speaker/kim.jpg" },
  { name: "Prof. Sumeet Walia", title: "Professor; Director, COMAS", affiliation: "RMIT University, Australia", image: "/invited_speaker/walia.jpg" },
  { name: "Prof. Murli Devraj", title: "Associate Professor", affiliation: "IIITDM Kurnool, India", image: "/invited_speaker/dev.png" },
  { name: "Dr. Surendra Singh", title: "Scientific Officer, SSPD", affiliation: "BARC, Mumbai, India", image: "/invited_speaker/singh.jpg" },
  { name: "Prof. Babak Anasori", title: "Reilly Associate Professor", affiliation: "Purdue University, USA", image: "/invited_speaker/anasori.jpg" },
  { name: "Prof. Mahesh Suryavanshi", title: "ARC DECRA Fellow & Lecturer", affiliation: "UNSW Sydney, Australia",image: "/invited_speaker/mahesh.jpg" },
  { name: "Dr. Dhiraj Bhatia", title: "Assistant Professor", affiliation: "IIT Gandhinagar, India", image: "/invited_speaker/bhatia.png" },
  { name: "Dr. Ashish Mishra", title: "Associate Professor", affiliation: "IIT (BHU), India", image: "/invited_speaker/ashish.png" },
  { name: "Prof. Chandra Sekhar Sharma", title: "Head, Chemical Engineering", affiliation: "IIT Hyderabad, India", image: "/invited_speaker/sharma.png" },
  { name: "Prof. Tanushree Choudhury", title: "Assistant Research Professor, 2DCC-MIP", affiliation: "Penn State University", image: "/invited_speaker/tanu.png" },
  { name: "Prof. Soon Hyung Kang", title: "Professor", affiliation: "Chonnam National University, South Korea", image: "/invited_speaker/kang.jpg" },
  { name: "Prof. Sebastien Royer", title: "Professor", affiliation: "Université du Littoral Côte d'Opale, France", image: "/invited_speaker/royer.png" },
  { name: "Prof. Suman Kalyan Pal", title: "Professor", affiliation: "IIT Mandi, India", image: "/invited_speaker/pal.png" },
  { name: "Prof. Sandip Ghosh", title: "Professor", affiliation: "TIFR Mumbai, India", image: "/invited_speaker/gosh.png" },
  { name: "Prof. Abha Misra", title: "Professor", affiliation: "IISc Bangalore, India", image: "/invited_speaker/abha.jpg" },
  { name: "Prof. Pavan Nakula", title: "Professor", affiliation: "IISc Bangalore, India", image: "/invited_speaker/pavam.jpg" },
  { name: "Prof. Samaresh Das", title: "Faculty (CARE)", affiliation: "IIT Delhi, India", image: "/invited_speaker/das.jpg" },
  { name: "Prof. Bharat Jalan", title: "Professor", affiliation: "University of Minnesota, USA", image: "/invited_speaker/jalan.jpg" },
  { name: "Prof. Vilas Pol", title: "Professor", affiliation: "Purdue University, USA", image: "/invited_speaker/pol.jpg" },
  { name: "Prof. Sanjay Mathur", title: "Director, IIMC", affiliation: "University of Cologne, Germany", image: "/invited_speaker/mathur.jpg" },
  { name: "Dr. C. Kamal", title: "Scientist / Director", affiliation: "RRCAT, India", image: "/invited_speaker/kamal.jpg" },
  { name: "Prof. Kourosh Kalantar-Zadeh", title: "Professor & Academic Lead", affiliation: "University of Sydney, Australia", image: "/invited_speaker/zadeh.png" },
  { name: "Prof. Umesh V. Waghmare", title: "President", affiliation: "JNCASR, Bangalore, India", image: "/invited_speaker/umesh.png" },
  { name: "Prof. Robert Weatherup", title: "Associate Professor", affiliation: "University of Oxford, UK", image: "/invited_speaker/robert.jpg" },
  { name: "Prof. T. Venky Venkatesan", title: "Director, CQRT", affiliation: "University of Oklahoma, USA", image: "/invited_speaker/venky.png" },
  { name: "Prof. Kaustubh R. S. Priolkar", title: "Director", affiliation: "UGC-DAE CSR / Goa University, India", image: "/invited_speaker/priolkar.jpg" },
  { name: "Prof. Amlan J. Pal", title: "Former Director, UGC-DAE CSR", affiliation: "IACS Kolkata, India", image: "/invited_speaker/amlan.png" },
  { name: "Mr. Unmesh D. Malshe", title: "Director", affiliation: "RRCAT, India", image: "/invited_speaker/malshe.png" },
  { name: "Prof. Kalobaran Maiti", title: "Director", affiliation: "IACS Kolkata, India", image: "/invited_speaker/maiti.jpg" },
  { name: "Prof. Motohiko Ezawa", title: "Professor", affiliation: "University of Tokyo, Japan", image: "/invited_speaker/ezawa.jpg" },
  { name: "Dr. R. Balamuralikrishnan", title: "Outstanding Scientist / Director", affiliation: "DMRL Hyderabad, India", image: "/invited_speaker/bala.jpg" },
  { name: "Prof. Bikramjit Basu", title: "Director", affiliation: "CSIR-CGCRI, India", image: "/invited_speaker/basu.jpg" },
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
