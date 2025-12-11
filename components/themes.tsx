const ThemeCategory = ({ title, description, topics }: { title: string; description: string; topics: string[] }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 className="text-xl font-bold text-blue-900 mb-3">{title}</h3>
    <p className="text-gray-600 mb-4 text-sm">{description}</p>
    <ul className="space-y-2">
      {topics.map((topic, idx) => (
        <li key={idx} className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span className="text-gray-700 text-sm">{topic}</span>
        </li>
      ))}
    </ul>
  </div>
)

export default function Themes() {
  const themes = [
    {
      title: 'A: Science & Engineering of 2D Materials',
      description: 'Core materials science and engineering fundamentals',
      topics: [
        'Physics, Chemistry, and simulations',
        'Synthesis, exfoliation, and functionalization',
        '2D Material-based composites and membranes',
        '3D Printing of 2D materials',
        'MAX and MXene Families',
        'Epitaxial and layered heterostructures',
      ],
    },
    {
      title: 'B: Advanced Characterization Techniques',
      description: 'State-of-the-art analytical methods',
      topics: [
        'Advances in surface technology',
        'Spectroscopy and microscopy',
        'Synchrotron-based characterization',
        'Electronics and optoelectronics',
        'Sensing and Shielding applications',
      ],
    },
    {
      title: 'C: Energy Applications',
      description: 'Clean energy and sustainability focus',
      topics: [
        'Energy storage applications',
        'Energy conversion applications',
        'Green hydrogen generation',
        'Hydrogen storage solutions',
        'Sustainable technologies',
      ],
    },
    {
      title: 'D: Emerging Technologies',
      description: 'Next-generation applications',
      topics: [
        'Sensors and EMI Shielding',
        'Memory devices and memristor',
        'Biomedical applications',
        'Quantum computing',
        'Photonics and flexible electronics',
      ],
    },
  ]

  return (
    <section id="themes" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Conference <span className="text-blue-600">Themes</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Explore cutting-edge research across four major themes covering materials science, characterization, energy applications, and emerging technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {themes.map((theme, idx) => (
            <ThemeCategory key={idx} {...theme} />
          ))}
        </div>
      </div>
    </section>
  )
}
