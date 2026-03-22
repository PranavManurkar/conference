"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import Image from "next/image"

export default function Paper_publish() {
  const wileyJournals = [
    {
      srNo: 1,
      name: "Small",
      impactFactor: "12.1",
      href: "https://onlinelibrary.wiley.com/journal/16136829",
      logo: "/S.jpg",
    },
    {
      srNo: 2,
      name: "Small Structures",
      impactFactor: "11.3",
      href: "https://onlinelibrary.wiley.com/journal/26884062",
      logo: "/SS.jpg",
    },
    {
      srNo: 3,
      name: "Small Methods",
      impactFactor: "9.1",
      href: "https://onlinelibrary.wiley.com/journal/23669608",
      logo: "SM.jpg",
    },
    {
      srNo: 4,
      name: "Advanced Materials Interfaces",
      impactFactor: "4.4",
      href: "https://advanced.onlinelibrary.wiley.com/journal/21967350",
      logo: "/AMI.jpg",
    },
    {
      srNo: 5,
      name: "Advanced Physics Research",
      impactFactor: "2.8",
      href: "https://advanced.onlinelibrary.wiley.com/journal/27511200",
      logo: "/APR.jpg",
    },
    {
      srNo: 6,
      name: "Physica status solidi (RRL) – Rapid Research Letters",
      impactFactor: "2",
      href: "https://onlinelibrary.wiley.com/journal/18626270",
      logo: "/PSS.jpg",
    },
  ]

  return (
    <section id="publication" className="py-20 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-4">
          <div className="h-1 w-12 bg-[var(--primary)] rounded" />
        </div>

        <h2 className="text-4xl font-bold text-center text-[var(--foreground)] mb-4">
          <span className="text-[var(--primary)]">Journals</span> For Publishing
        </h2>

        <p className="text-center text-[var(--muted-foreground)] mb-6 text-lg">
          Selected high-quality submissions will be considered
          for publication in WILEY journals
        </p>

        <Card className="border-0 shadow-lg bg-[var(--card)]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[var(--nav)] text-xl text-[var(--primary-foreground)]">
                  <TableRow>
                    <TableHead className="text-[var(--primary-foreground)] text-xl font-bold text-center">Sr. No.</TableHead>
                    <TableHead className="text-[var(--primary-foreground)] text-xl font-bold text-center">Name of Journal</TableHead>
                    <TableHead className="text-[var(--primary-foreground)] text-xl font-bold text-center">Impact Factor</TableHead>
                    <TableHead className="text-[var(--primary-foreground)] text-xl font-bold text-center">Logo</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {wileyJournals.map((journal, idx) => (
                    <TableRow key={journal.srNo} className={idx % 2 === 0 ? "bg-[var(--card)]" : "bg-[var(--muted)]"}>
                      <TableCell className="font-semibold text-[var(--foreground)] text-xl text-center">{journal.srNo}</TableCell>

                      <TableCell className="font-bold text-black text-xl text-center">
                        <Link
                          href={journal.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {journal.name}
                        </Link>
                      </TableCell>

                      <TableCell className="font-bold text-black text-xl text-center">{journal.impactFactor}</TableCell>

                      <TableCell className="text-center">
                        <Link
                          href={journal.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${journal.name}`}
                          className="inline-flex items-center justify-center"
                        >
                          <div className="relative h-24 w-36 sm:h-28 sm:w-40 flex items-center justify-center rounded-lg bg-white border border-gray-200 p-2 shadow-sm">
                            <Image
                              src={journal.logo}
                              alt={journal.name}
                              fill
                              className="object-contain"
                              sizes="160px"
                            />
                          </div>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-[var(--muted-foreground)] mb-0 text-lg">
          Manuscripts submitted to the (Wiley) journals in the Special Collection will undergo our standard and rigorous editorial evaluation process.
        </p>
        <p className="text-center text-[var(--muted-foreground)] mb-12 text-lg">
          Only articles deemed suitable after editorial evaluation will be peer reviewed, like any other manuscript submitted to that journal
        </p>
      </div>
    </section>
  )
}