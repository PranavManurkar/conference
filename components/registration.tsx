"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Registration() {
  const registrationData = [
    {
      type: "UG/PG Students",
      saarcEarlyINR: "₹4,000",
      saarcFinalINR: "₹4,500",
      nonSaarcEarlyINR: "₹4,500",
      nonSaarcFinalINR: "₹5,000",
      earlyBirdUSD: "$75",
      finalUSD: "$100-150",
    },
    {
      type: "Research Scholars",
      saarcEarlyINR: "₹6,000",
      saarcFinalINR: "₹7,000",
      nonSaarcEarlyINR: "₹6,500",
      nonSaarcFinalINR: "₹7,500",
      earlyBirdUSD: "$200",
      finalUSD: "$250-300",
    },
    {
      type: "Faculty",
      saarcEarlyINR: "₹10,000",
      saarcFinalINR: "₹12,000",
      nonSaarcEarlyINR: "₹11,000",
      nonSaarcFinalINR: "₹13,000",
      earlyBirdUSD: "$300",
      finalUSD: "$400-500",
    },
    {
      type: "Industry",
      saarcEarlyINR: "₹15,000",
      saarcFinalINR: "₹17,000",
      nonSaarcEarlyINR: "₹16,000",
      nonSaarcFinalINR: "₹18,000",
      earlyBirdUSD: "$500-700",
      finalUSD: "$650-850",
    },
  ]

  return (
    <section id="registration" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          <span className="text-blue-600">Registration</span> Fees
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">Early Bird rates available until May 5, 2026</p>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-blue-900 text-white">
                  <TableRow>
                    <TableHead className="text-white font-bold">Delegate Type</TableHead>
                    <TableHead className="text-white font-bold">SAARC (Early)</TableHead>
                    <TableHead className="text-white font-bold">SAARC (Final)</TableHead>
                    <TableHead className="text-white font-bold">Non-SAARC (Early)</TableHead>
                    <TableHead className="text-white font-bold">Non-SAARC (Final)</TableHead>
                    <TableHead className="text-white font-bold">USD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationData.map((row, idx) => (
                    <TableRow key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                      <TableCell className="font-semibold text-gray-900">{row.type}</TableCell>
                      <TableCell className="text-gray-700">{row.saarcEarlyINR}</TableCell>
                      <TableCell className="text-gray-700">{row.saarcFinalINR}</TableCell>
                      <TableCell className="text-gray-700">{row.nonSaarcEarlyINR}</TableCell>
                      <TableCell className="text-gray-700">{row.nonSaarcFinalINR}</TableCell>
                      <TableCell className="text-gray-700 text-xs">
                        {row.earlyBirdUSD} / {row.finalUSD}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Bank Details</h4>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <span className="font-semibold">Bank:</span> Canara Bank
                </li>
                <li>
                  <span className="font-semibold">Branch:</span> Simrol IIT Branch
                </li>
                <li>
                  <span className="font-semibold">Account Number:</span> 1476101027440
                </li>
                <li>
                  <span className="font-semibold">IFSC Code:</span> CNRB0006223
                </li>
                <li>
                  <span className="font-semibold">MICR Code:</span> 452015003
                </li>
                <li>
                  <span className="font-semibold">Account Holder:</span> Indian Institute of Technology Indore
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Account Information</h4>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <span className="font-semibold">GST No:</span> 23AAAAI7115H122
                </li>
                <li>
                  <span className="font-semibold">PAN:</span> AAAAI7115H
                </li>
                <li>
                  <span className="font-semibold">TAN:</span> BPLI01163B
                </li>
                <li>
                  <span className="font-semibold">SWIFT Code:</span> CNRBINBBMSG
                </li>
                <li>
                  <span className="font-semibold">Contact:</span> arrnd@iiti.ac.in
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
