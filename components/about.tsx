"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

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
};


export default function About() {
  return (
    <section id="about" className="py-20 bg-[color:var(--nav)]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* SECTION 1 — Image top (mobile only), Text left, Image right (desktop) */}
        <motion.div
          className="bg-[color:var(--primary-foreground)] rounded-lg shadow flex flex-col md:grid md:grid-cols-5 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="md:col-span-3 p-6 order-last md:order-none">
            <div className="mb-4">
              <div className="h-1 w-10 bg-[color:var(--primary)] rounded mb-2" />
              <h2 className="text-2xl font-semibold text-[color:var(--nav)]">The Conference</h2>
            </div>

            <div className="space-y-3 text-base text-[color:var(--nav)]/80 leading-relaxed">
              <p>
                2D materials are far more than a scientific curiosity; they represent a
                transformative frontier in materials science, poised to redefine
                performance boundaries across diverse technological domains.
              </p>
              <p>
                From graphene to transition metal dichalcogenides, phosphorene, and
                MXenes, the 2D materials ecosystem is reshaping energy, electronics,
                photonics, healthcare, aerospace, and quantum technologies.
              </p>
              <p>
                This conference serves as an interdisciplinary platform connecting
                academia, industry, and policy makers worldwide.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 relative min-h-[260px] order-first md:order-none">
            <Image
              src="/images/conference.jpg"
              alt="Conference"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </motion.div>

        {/* SECTION 2 — Video top (mobile only), Text right (desktop) */}
        <motion.div
          className="bg-[color:var(--primary-foreground)] rounded-lg shadow flex flex-col md:grid md:grid-cols-5 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="md:col-span-2 relative min-h-[260px] bg-black flex items-center justify-center group cursor-pointer overflow-hidden md:order-none order-first">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/jvU_frtZP3Y?si=BTo3fHtROxZoeegC&autoplay=1&mute=1&controls=0"
              title="IIT Indore Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            />
            <a
              href="https://youtu.be/jvU_frtZP3Y?si=BTo3fHtROxZoeegC"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10"
              aria-label="Open video on YouTube"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-5" />
          </div>

          <div className="md:col-span-3 p-6 md:order-none order-last">
            <div className="mb-4">
              <div className="h-1 w-10 bg-[color:var(--primary)] rounded mb-2" />
              <h2 className="text-2xl font-semibold text-[color:var(--nav)]">About 
                <span className="text-[color:var(--primary)]"> IIT Indore</span></h2>
            </div>

            <div className="space-y-3 text-base text-[color:var(--nav)]/80 leading-relaxed">
              <p>
                IIT Indore was established in 2009 as a second-generation IIT and is
                located on a 501-acre permanent campus at Simrol. The institute shifted
                fully to its permanent campus in 2015.
              </p>
              <p>
                The institute offers undergraduate, postgraduate, doctoral, and
                interdisciplinary programs and was the first IIT to launch an MS in
                Data Science & Management with IIM Indore.
              </p>
              <p>
                IIT Indore consistently ranks among India’s top institutes and has
                produced over 7,500 international publications and 165+ patents.
              </p>
                <p>
                For more information, visit the{" "}
                <a
                  href="https://iiti.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--primary)] underline hover:text-[color:var(--nav)]"
                >
                 IIT Indore website
                </a>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* SECTION 3 — Image top (mobile only), Text left, Image right (desktop) */}
        <motion.div
          className="bg-[color:var(--primary-foreground)] rounded-lg shadow flex flex-col md:grid md:grid-cols-5 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="md:col-span-3 p-6 order-last md:order-none">
            <div className="mb-4">
              <div className="h-1 w-10 bg-[color:var(--primary)] rounded mb-2" />
              <h2 className="text-2xl font-semibold text-[color:var(--nav)]">Indore City</h2>
            </div>

            <div className="space-y-3 text-base text-[color:var(--nav)]/80 leading-relaxed">
              <p>
                Indore is the commercial capital of Madhya Pradesh and a major trading
                hub since the 16th century, located in the Malwa region along the Kanh
                and Saraswati rivers.
              </p>
              <p>
                The city is known for its heritage, vibrant food culture, cleanliness,
                and proximity to Ujjain, Omkareshwar, Mandu, and Maheshwar.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 relative min-h-[260px] order-first md:order-none">
            <Image
              src="/indore.jpg"
              alt="Indore City"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </motion.div>

        {/* SECTION 4 — Image top (mobile only), Image left, Text right (desktop) */}
        <motion.div
          className="bg-[color:var(--primary-foreground)] rounded-lg shadow flex flex-col md:grid md:grid-cols-5 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="md:col-span-2 relative min-h-[260px] md:order-none order-first">
            <Image
              src="/convocation.jpg"
              alt="MEMS IIT Indore"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>

          <div className="md:col-span-3 p-6 md:order-none order-last">
            <div className="mb-4">
              <div className="h-1 w-10 bg-[color:var(--primary)] rounded mb-2" />
              <h2 className="text-2xl font-semibold text-[color:var(--nav)]">
                Department of Metallurgical Engineering and Materials Science
              </h2>
            </div>

            <div className="space-y-3 text-base text-[color:var(--nav)]/80 leading-relaxed">
              <p>
                The MEMS department at IIT Indore was established in 2009 and focuses on
                both fundamental and applied research in metallurgy and materials
                science.
              </p>
              <p>
                The department houses advanced laboratories in physical metallurgy,
                nanomaterials, functional materials, biomaterials, and computational
                materials science, and offers BTech, MTech, MS, and PhD programs.
              </p>
              <p>
                For more information, visit the{" "}
                <a
                  href="https://mems.iiti.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--primary)] underline hover:text-[color:var(--nav)]"
                >
                  MEMS IIT Indore website
                </a>.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
