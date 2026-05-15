import React from "react"

const logos: string[] = [
  "/logo11.png",
  "/logo12.png",
  "/jeol.png",
  "/logo13.png",
  "/logo14.jpg",
  "/logo15.png",
  "/logo16.png",
  "/logo17.png",
  "/logo18.png",
]

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = []
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size))
  return res
}

export default function OurSponsorsPage() {
  const rows = chunk(logos, 3)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold mb-6">Our Sponsors</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="align-middle">
                  {row.map((logo, ci) => (
                    <td key={ci} className="p-6 text-center align-middle">
                      <img
                        src={logo}
                        alt={`Sponsor ${ri * 3 + ci + 1}`}
                        style={{ 
                          maxWidth: ri === 0 ? 300 : 240, 
                          maxHeight: ri === 0 ? 150 : 120, 
                          objectFit: "contain" 
                        }}
                      />
                    </td>
                  ))}
                  {row.length < 3 &&
                    Array.from({ length: 3 - row.length }).map((_, idx) => (
                      <td key={`empty-${idx}`} />
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
