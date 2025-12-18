// About.jsx
// Note: install framer-motion if you haven't already:
// npm install framer-motion
"use client";

import React from "react";
import { motion } from "framer-motion";

const slideUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top — existing content: Conference & IIT Indore */}
        <div className="">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >

            <div className="mb-6">
              <div className="h-1 w-12 bg-green-500 rounded mb-3" />
              <h2 className="text-4xl font-bold text-gray-900">
                The <span className="text-blue-600">Conference</span>
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              2D materials are far more than a scientific curiosity; they represent a transformative frontier in materials science, poised to redefine performance boundaries across diverse technological domains.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              From the groundbreaking discovery of graphene to the emergence of advanced materials such as transition metal dichalcogenides, phosphorene, and MXenes, the 2D material landscape is reshaping the future of energy, healthcare, defense, electronics, photonics, flexible devices, aerospace, and quantum technologies.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              This conference aims to serve as a dynamic, interdisciplinary platform uniting scientists, engineers, industry leaders, and policymakers around the world.
            </p>
          </motion.div>

          {/* <motion.div
            className="bg-white p-6 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >

            <div className="mb-6">
              <div className="h-1 w-12 bg-green-500 rounded mb-3" />
              <h2 className="text-4xl font-bold text-gray-900">
                <span className="text-blue-600">IIT Indore</span>
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              Indian Institute of Technology Indore (IIT Indore) is an Institute of National Importance established in 2009 by the Ministry of Education, Govt. of India.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              Over the years, IIT Indore has emerged as a leading center for teaching, research, and innovation. It has consistently ranked among the top engineering institutions in India and has earned recognition for its global impact in higher education.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              The institute boasts cutting-edge research infrastructure, modern laboratories, and smart classrooms, fostering a vibrant environment for academic excellence and interdisciplinary collaboration.
            </p>
          </motion.div> */}
        </div>

        {/* New — About IIT Indore (full-width long content) */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >

          <div className="mb-6">
              <div className="h-1 w-12 bg-green-500 rounded mb-3" />
              <h2 className="text-4xl font-bold text-gray-900">
                About <span className="text-blue-600">IIT Indore</span>
              </h2>
            </div>
          <p className="text-gray-700 leading-relaxed mb-3">
            Indian Institute of Technology Indore (IITI), established in 2009 by the Ministry of Human Resource Development (MHRD), Government of India, under The Institutes of Technology (Amendment) Act, is among the 2nd generation of IITs. Located at Simrol, its permanent campus spans 501.4 acres, including 200 acres of forest area. Initially functioning from temporary locations, the institute shifted to its permanent campus in December 2015.
          </p>

          <p className="text-gray-700 leading-relaxed mb-3">
            IITI began with BTech programs in CSE, EE, and ME in 2009 and PhD programs in 2010, later expanding to offer 9 BTech programs, 19 PhD programs, 15 MTech programs, 5 MS (Research) programs, and 5 MSc (2-year) programs. It is also the first IIT to introduce an MS program in Data Science and Management in collaboration with IIM Indore and has established 8 interdisciplinary centers in futuristic areas.
          </p>

          <p className="text-gray-700 leading-relaxed mb-3">
            Renowned for academic and research excellence, IITI is one of India’s "Institutes of National Importance" and has consistently ranked among the top 16 in the NIRF rankings since 2016, peaking at 10 in 2020 and currently ranked 16 in 2024. With over 7,500 international publications and 165+ patents to its credit, the institute has developed close to 150 technologies at various TRL levels, ready for technology translation. Industry-sponsored Centers of Excellence have been established by renowned companies like Case New Holland, L&T, and Raj Ratan Gloabal Wires.
          </p>

          <p className="text-gray-700 leading-relaxed mb-3">
            Additionally, under the National Mission for Interdisciplinary Cyber-Physical Systems (NM-ICPS), IITI has established the DRISHTI center focusing on modeling, simulation, and visualization of CPS. The campus, spread over 2.1 km² along Khandwa Road, is located 25 km from Indore, the financial capital of Madhya Pradesh and India's cleanest city. Boasting state-of-the-art facilities like the Central Laboratory, high-performance computing centers, and affiliated laboratories, the institute is home to 230 faculty members, 3,000 students, and 400 staff.
          </p>

          <p className="text-gray-700 leading-relaxed mb-0">
            With over 4,500 undergraduates, 3,500 postgraduates, and 800 PhD scholars graduated in science, engineering, and social sciences disciplines, IITI continues to shape the future of higher education with its steadfast commitment to academic development, innovation, and industry engagement.
          </p>
        </motion.div>

        {/* New — Two-column: Indore city & Department of Mechanical Engineering */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >

            <div className="flex items-center mb-4">
              <div className="h-1 w-12 bg-green-500 rounded mr-3" />
              <h4 className="text-xl font-semibold text-gray-900">Indore city</h4>
            </div>

            <p className="text-gray-700 leading-relaxed mb-3">
              Indore is the largest city and is the commercial capital of the state of Madhya Pradesh (MP). It is located in the western region of MP, also known as Malwa region. It was founded on the banks of Kanh and Saraswati rivers in the 16th century as a trading hub between the Deccan and Delhi.
            </p>

            <p className="text-gray-700 leading-relaxed mb-0">
              Indore city has many worth-visiting places namely Rajwada, Lalbag Palace, Gandhi Hall, Central Museum, Annapurna temple, Bada Ganpati temple, Khajrana Ganpati temple, Kanch Mandir, Gommatgiri Jain temples. Nearby tourist places include two Jyotirlingas (Mahakaleshwar — Ujjain) and Omkareshwar located at 60 km distance from Indore, Maheshwar, Mandu, Choral dam, Patalpani. Indore weather is pleasant during December with mild winter; warm sweaters, jackets, and blankets are sufficient for such weather.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >

            <div className="flex items-center mb-4">
              <div className="h-1 w-12 bg-green-500 rounded mr-3" />
              <h4 className="text-xl font-semibold text-gray-900">Department of Mechanical Engineering</h4>
            </div>

            <p className="text-gray-700 leading-relaxed mb-3">
              The Mechanical Engineering Department was established in 2009. Presently it is the largest department of IIT Indore with 29 regular faculty members. It has many state-of-art research and teaching labs in the areas of design, industrial manufacturing, and thermal engineering including the Center of Excellence in Gear Engineering established under FIST program of the DST.
            </p>

            <p className="text-gray-700 leading-relaxed mb-0">
              The Department offers BTech, PhD program, 4 MTech programs, and MS (R) program. Many faculty members contribute to different interdisciplinary centers.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
