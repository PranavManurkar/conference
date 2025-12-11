export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About the <span className="text-blue-600">Conference</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              2D materials are far more than a scientific curiosity; they represent a transformative frontier in materials science, poised to redefine performance boundaries across diverse technological domains.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              From the groundbreaking discovery of graphene to the emergence of advanced materials such as transition metal dichalcogenides, phosphorene, and MXenes, the 2D material landscape is reshaping the future of energy, healthcare, defense, electronics, photonics, flexible devices, aerospace, and quantum technologies.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              This conference aims to serve as a dynamic, interdisciplinary platform uniting scientists, engineers, industry leaders, and policymakers around the world.
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">IIT Indore</span>
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              Indian Institute of Technology Indore (IIT Indore) is an Institute of National Importance established in 2009 by the Ministry of Education, Govt. of India.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              Over the years, IIT Indore has emerged as a leading center for teaching, research, and innovation. It has consistently ranked among the top engineering institutions in India and has earned recognition for its global impact in higher education.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              The institute boasts cutting-edge research infrastructure, modern laboratories, and smart classrooms, fostering a vibrant environment for academic excellence and interdisciplinary collaboration.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
