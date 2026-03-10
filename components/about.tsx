"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="about" className="py-20 bg-[color:var(--nav)]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* SECTION 1 — Image top (mobile only), Text left, Image right (desktop) */}
        <motion.div
          className="bg-[color:var(--primary-foreground)] rounded-lg shadow flex flex-col md:grid md:grid-cols-4 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="md:col-span-2 p-6 order-last md:order-none">
            <div className="mb-4">
              <div className="h-1 w-10 bg-[color:var(--primary)] rounded mb-2" />
              <h2 className="text-2xl font-semibold text-[color:var(--nav)]">The
                <span className="text-[color:var(--primary)]"> Conference</span> </h2>
            </div>

            <div className="space-y-3 text-base text-[color:var(--nav)]/80 leading-relaxed">
              <p>
                2D materials are far more than a scientific curiosity; they
                represent a transformative frontier in materials science, poised to
                redefine performance boundaries across diverse technological
                domains.
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
              
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="mt-4 bg-[color:var(--primary)] border-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary)] hover:text-white transition-all"
                  >
                    Read More
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-[color:var(--primary-foreground)] border-[color:var(--primary)]/20">
                  <DialogHeader className="border-b border-[color:var(--primary)]/10 pb-4">
                    <DialogTitle className="text-3xl font-bold text-[color:var(--nav)]">
                      About the <span className="text-[color:var(--primary)]">Conference</span>
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription asChild>
                    <div className="overflow-y-auto pr-4 space-y-4 text-base text-[color:var(--nav)] leading-relaxed max-h-[calc(85vh-120px)]">
                      <p className="text-justify">
                        2D materials are far more than a scientific curiosity; they
                        represent a transformative frontier in materials science, poised to
                        redefine performance boundaries across diverse technological
                        domains. With their atomically thin, layered structures, these
                        materials exhibit unprecedented quantum, optical, and
                        electrochemical behaviors that are unattainable in bulk or other
                        morphological forms.
                      </p>
                      <p className="text-justify">
                        From the groundbreaking discovery of graphene to the emergence of
                        advanced materials such as transition metal dichalcogenides,
                        phosphorene, and MXenes, the 2D materials landscape is reshaping the
                        future of energy, healthcare, defense, electronics, photonics,
                        flexible devices, aerospace, and quantum technologies.
                      </p>
                      <p className="text-justify">
                        To capture the recent advancements in the field and dwell upon
                        its future prospects, we are pleased to inform you that an
                        International Conference on <span className="font-semibold text-[color:var(--primary)]">"2D MatTech Global: Fundamentals
                        to Applications"</span> is being organized by <span className="font-semibold">Indian Institute of
                        Technology Indore (IIT Indore)</span> in association with <span className="font-semibold">UGC-DAE
                        Consortium for Scientific Research (UGC-DAE CSR), Indore</span> and <span className="font-semibold">Raja Ramanna Centre for Advanced Technology (RRCAT), Indore</span>.
                      </p>
                      <p className="text-justify bg-[color:var(--primary)]/5 p-4 rounded-lg border-l-4 border-[color:var(--primary)]">
                        <span className="font-semibold text-[color:var(--primary)]">Important:</span> Selected high-quality submissions will be invited for 
                        publication in SCI journals or conference proceedings.
                      </p>
                      <p className="text-justify">
                        This conference aims to serve as a dynamic, interdisciplinary
                        platform uniting scientists, engineers, industry leaders, and
                        policymakers around the world. It offers a vital space for sharing
                        pioneering research, fostering interdisciplinary collaboration, and
                        catalyzing the next wave of innovation.
                      </p>
                      <p className="text-justify">
                        By bringing together prominent figures and emerging experts in the
                        field, the event seeks to accelerate the real-world integration of 2D
                        materials and unlock their vast potential for global impact.
                      </p>
                    </div>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="md:col-span-2 relative min-h-[260px] order-first md:order-none">
            <Image
              src="/poster1.png"
              alt="Conference"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
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
              src="https://www.youtube.com/embed/jvU_frtZP3Y?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&origin=https://tdmtg.iiti.ac.in"
              title="IIT Indore Video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 w-full h-full"
            />
            {/* <a
              href="https://youtu.be/jvU_frtZP3Y?si=BTo3fHtROxZoeegC"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10"
              aria-label="Open video on YouTube"
            /> */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-5" />
          </div>

          <div className="md:col-span-3 p-6 md:order-none order-last">
            <div className="mb-4">
              <div className="h-1 w-10 bg-[color:var(--primary)] rounded mb-2" />
              <h2 className="text-2xl font-semibold text-[color:var(--nav)]">
                <span className="text-[color:var(--primary)]"> IIT Indore</span></h2>
            </div>

            <div className="space-y-3 text-base text-[color:var(--nav)]/80 leading-relaxed">
              <p>
                The Indian Institute of Technology Indore (IITI), established in 2009 as a
                second-generation IIT, is located at Simrol on a 501-acre permanent campus
                that became fully operational in 2015.
              </p>

              <p>
                IITI offers a broad spectrum of undergraduate, postgraduate, doctoral, and
                interdisciplinary programs and was the first IIT to launch an MS in Data
                Science and Management in collaboration with IIM Indore.
              </p>

              <p>
                Recognized as an Institute of National Importance, IIT Indore consistently
                ranks among India’s leading institutions and has contributed over 7,500
                international publications and 165+ patents, reflecting its strong research
                and innovation ecosystem.
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
              <h2 className="text-2xl font-semibold text-[color:var(--nav)]">
                <span className="text-[color:var(--primary)]">Metallurgical Engineering and Materials Science</span>
              </h2>
            </div>

            <div className="space-y-3 text-base text-[color:var(--nav)]/80 leading-relaxed">
              <p>
                Department of Metallurgical Engineering and Materials Science (MEMS) at IIT Indore, established as a full-fledged department in 2016 from the Center for Materials Science Engineering, stands as a vibrant hub of innovation at the interface of science and engineering. Bringing together expertise from Basic Sciences and Engineering disciplines, MEMS drives cutting-edge, multidisciplinary research focused on understanding and engineering the process-structure-property relationship across metals, ceramics, polymers, composites, and functional materials.
              </p>

              <p>
                With a strong foundation in both fundamental science and applied research, MEMS actively addresses contemporary challenges in energy, sustainability, advanced manufacturing, and next-generation materials technology. MEMS offers undergraduate, postgraduate, and doctoral programs, supported by state-of-the-art laboratories in physical metallurgy, 2D materials, nanomaterials, functional and electronic materials, biomaterials, and computational materials science, creating a dynamic ecosystem for research excellence and technological impact
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

          <div className="md:col-span-2 relative min-h-[260px] order-first md:order-none">
            <Image
              src="/convocation.jpg"
              alt="MEMS IIT Indore"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </motion.div>

        <motion.div
          className="bg-[color:var(--primary-foreground)] rounded-lg shadow flex flex-col overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="p-6">
            <div className="mb-4">
              <div className="h-1 w-10 bg-[color:var(--primary)] rounded mb-2" />
              <h2 className="text-2xl font-semibold text-[color:var(--nav)]">
                <span className="text-[color:var(--primary)]">UGC-DAE CSR Indore</span>
              </h2>
            </div>

            <div className="space-y-3 text-base text-[color:var(--nav)]/80 leading-relaxed text-left">
              <p>
                UGC-DAE CSR, Indore is an Inter-University Research Centre of the University Grants Commission (UGC), New Delhi. The broad objective of the Consortium is developing competence and promoting research in front line areas of science and technology in Indian Universities and colleges by providing institutional framework for optimum utilization of major research facilities established by the Department of Atomic Energy as well as in-house facilities. Through active collaborations with universities and national laboratories, UGC-DAE CSR Indore plays a vital role in strengthening university-based research, promoting high-quality publications, training young researchers, and fostering interdisciplinary scientific advancement across India.
              </p>

              <p>
                For more information, visit the{" "}
                <a
                  href="https://www.csr.res.in/Indore_Centre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--primary)] underline hover:text-[color:var(--nav)]"
                >
                  UGC-DAE CSR website
                </a>.
              </p>
            </div>
          </div>
        </motion.div>



        <motion.div
          className="bg-[color:var(--primary-foreground)] rounded-lg shadow flex flex-col overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="p-6">
            <div className="mb-4">
              <div className="h-1 w-10 bg-[color:var(--primary)] rounded mb-2" />
              <h2 className="text-2xl font-semibold text-[color:var(--nav)]">
                <span className="text-[color:var(--primary)]">RRCAT Indore</span>
              </h2>
            </div>

            <div className="space-y-3 text-base text-[color:var(--nav)]/80 leading-relaxed text-left">
              <p>
              Raja Ramanna Centre for Advanced Technology (RRCAT), a premier unit of the Department of Atomic Energy, Govt. of India, is engaged in advanced non-nuclear R&D in lasers, particle accelerators, and related frontier technologies. Centre houses two national synchrotron radiation facilities:  Indus-1 and Indus-2. Indus-1 is a 450 MeV, 100 mA electron storage ring that delivers radiation from mid-infrared to soft X-ray region, with a critical wavelength of ~61 Å. Indus-2 is a 2.5 GeV 3rd generation synchrotron radiation source, indigenously designed and developed at RRCAT, producing high-brilliance photon beams from infrared to hard X-rays. With low-emittance operation, state-of-the-art accelerator systems, precision beam diagnostics, ultra-high vacuum infrastructure, and sophisticated beamline instrumentation, Indus-2 enables high-resolution structural, spectroscopic, and imaging studies across materials science, condensed matter physics, chemistry, biology, nanoscience, environmental science, and industrial R&D, serving as a key national platform for multidisciplinary research and strategic technological advancement.
              </p>

              <p>
                For more information, visit the{" "}
                <a
                  href="https://www.rrcat.gov.in/index_eng.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--primary)] underline hover:text-[color:var(--nav)]"
                >
                  RRCAT Indore website
                </a>.
              </p>
            </div>
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
              src="/indore.jpg"
              alt="Indore City"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>

          <div className="md:col-span-3 p-6 md:order-none order-last">
            <div className="mb-4">
              <div className="h-1 w-10 bg-[color:var(--primary)] rounded mb-2" />
              <h2 className="text-2xl font-semibold text-[color:var(--nav)]">
                <span className="text-[color:var(--primary)]">Indore </span> City</h2>
            </div>

            <div className="space-y-3 text-base text-[color:var(--nav)]/80 leading-relaxed">
              <p>
                Indore, the largest city and commercial capital of Madhya Pradesh, is located
                in the Malwa region and was established in the 16th century as a major trading
                hub along the Kanh and Saraswati rivers.
              </p>

              <p>
                The city is renowned for its rich heritage, vibrant culture, and cleanliness,
                with popular attractions such as Rajwada, Lal Bagh Palace, Kanch Mandir, and
                the Annapurna and Ganpati temples.
              </p>

              <p>
                Indore also serves as a gateway to prominent nearby destinations, including
                the Jyotirlingas at Ujjain and Omkareshwar, as well as Mandu, Maheshwar, and
                scenic spots like Patalpani and Choral Dam. June-July offers pleasant weather marking onset of monsoon with greenery all around, suitable for visitors.
              </p>
            </div>


          </div>
        </motion.div>

      </div>
    </section>
  );
}
