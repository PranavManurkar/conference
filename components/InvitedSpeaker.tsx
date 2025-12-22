"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { Mail, Globe, Briefcase } from "lucide-react"
import Link from "next/link"

interface Speaker {
  id?: number
  name: string
  title: string
  affiliation: string
  specialization?: string
  bio?: string
  image?: string
  email?: string
  website?: string
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export default function InvitedSpeaker() {
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
  // { name: "Prof. Kourosh Kalantar-Zadeh", title: "Professor & Academic Lead", affiliation: "University of Sydney, Australia", image: "/invited_speaker/zadeh.png" },
  // { name: "Prof. Umesh V. Waghmare", title: "President", affiliation: "JNCASR, Bangalore, India", image: "/invited_speaker/umesh.png" },
  // { name: "Prof. Robert Weatherup", title: "Associate Professor", affiliation: "University of Oxford, UK", image: "/invited_speaker/robert.jpg" },
  // { name: "Prof. T. Venky Venkatesan", title: "Director, CQRT", affiliation: "University of Oklahoma, USA", image: "/invited_speaker/venky.png" },
  // { name: "Prof. Kaustubh R. S. Priolkar", title: "Director", affiliation: "UGC-DAE CSR / Goa University, India", image: "/invited_speaker/priolkar.jpg" },
  // { name: "Prof. Amlan J. Pal", title: "Former Director, UGC-DAE CSR", affiliation: "IACS Kolkata, India", image: "/invited_speaker/amlan.png" },
  // { name: "Mr. Unmesh D. Malshe", title: "Director", affiliation: "RRCAT, India", image: "/invited_speaker/malshe.png" },
  // { name: "Prof. Kalobaran Maiti", title: "Director", affiliation: "IACS Kolkata, India", image: "/invited_speaker/maiti.jpg" },
  // { name: "Prof. Motohiko Ezawa", title: "Professor", affiliation: "University of Tokyo, Japan", image: "/invited_speaker/ezawa.jpg" },
  // { name: "Dr. R. Balamuralikrishnan", title: "Outstanding Scientist / Director", affiliation: "DMRL Hyderabad, India", image: "/invited_speaker/bala.jpg" },
  // { name: "Prof. Bikramjit Basu", title: "Director", affiliation: "CSIR-CGCRI, India", image: "/invited_speaker/basu.jpg" },
]


  return (
    <section id="invited-speakers" className="py-20 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="inline-block mb-4">
            <div className="h-1 w-12 bg-[var(--primary)] rounded" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            <span className="text-[var(--primary)]">Invited</span> Speakers
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
            Distinguished experts and thought leaders from around the world sharing insights on
            cutting-edge research and applications in 2D materials technology.
          </p>
        </motion.div>

        {/* Speakers Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {speakers.map((speaker, idx) => (
            <motion.div
              key={idx}
              className="bg-[var(--card)] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[var(--border)] hover:border-[var(--primary)]"
              variants={fadeUp}
            >
              {/* Image Section */}
              <div className="flex items-center justify-center py-6 bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--nav)]">
                {speaker.image ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[color:var(--primary-foreground)] shadow-lg flex-shrink-0 bg-white">
                    <Image
                      src={speaker.image}
                      alt={speaker.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                      priority={false}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[color:var(--nav)]/10 to-[color:var(--nav)]/30 flex flex-col items-center justify-center border-4 border-[color:var(--primary-foreground)] shadow-lg">
                    <Briefcase className="h-12 w-12 text-white opacity-70 mb-2" />
                    <span className="text-white text-xs opacity-60">No Photo</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Name */}
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 line-clamp-2">
                  {speaker.name}
                </h3>

                {/* Title and Affiliation */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-semibold text-[var(--primary)]">{speaker.title}</p>
                  <p className="text-sm text-[var(--muted-foreground)] font-medium">{speaker.affiliation}</p>
                </div>

                {/* Divider */}
                {/* <div className="border-t border-[var(--border)] pt-4">
                  <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide font-semibold">
                    Distinguished Speaker
                  </p>
                </div> */}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <p className="text-[var(--muted-foreground)] mb-6">
            More speakers and session details coming soon. Stay tuned for updates!
          </p>
          <Link href="/schedule">
            <button className="inline-block px-8 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold rounded-lg hover:bg-[var(--nav)] hover:text-[var(--primary)] transition-colors duration-200 shadow-md hover:shadow-lg">
              View Full Schedule
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
