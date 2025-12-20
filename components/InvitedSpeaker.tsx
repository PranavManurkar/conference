"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { Mail, Globe, Briefcase } from "lucide-react"

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

  return (
    <section id="invited-speakers" className="py-20 bg-gray-50">
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
            <div className="h-1 w-12 bg-blue-600 rounded" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-blue-600">Invited</span> Speakers
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
              variants={fadeUp}
            >
              {/* Image Section */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden">
                {speaker.image ? (
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="text-center">
                      <Briefcase className="h-12 w-12 text-white mx-auto mb-2 opacity-50" />
                      <span className="text-white text-sm opacity-70">Speaker</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {speaker.name}
                </h3>

                {/* Title and Affiliation */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-semibold text-blue-600">{speaker.title}</p>
                  <p className="text-sm text-gray-700 font-medium">{speaker.affiliation}</p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    Distinguished Speaker
                  </p>
                </div>
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
          <p className="text-gray-600 mb-6">
            More speakers and session details coming soon. Stay tuned for updates!
          </p>
          <button className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg">
            View Full Schedule
          </button>
        </motion.div>
      </div>
    </section>
  )
}
