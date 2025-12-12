"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle, CreditCard, FileText, UserPlus } from "lucide-react"

export default function Registration() {
  const registrationData = [
    {
      type: "UG/PG Students",
      IndianEarlyINR: "₹4,000",
      IndianFinalINR: "₹4,500",
      SaarcEarlyUSD: "$75",
      SaarcFinalUSD: "$100",
      NonSaarcEarlyUSD: "$125",
      NonSaarcFinalUSD: "$150",
    },
    {
      type: "Research Scholars",
      IndianEarlyINR: "₹6,000",
      IndianFinalINR: "₹7,000",
      SaarcEarlyUSD: "$200",
      SaarcFinalUSD: "$250",
      NonSaarcEarlyUSD: "$250",
      NonSaarcFinalUSD: "$300",
    },
    {
      type: "Faculty",
      IndianEarlyINR: "₹10,000",
      IndianFinalINR: "₹12,000",
      SaarcEarlyUSD: "$300",
      SaarcFinalUSD: "$400",
      NonSaarcEarlyUSD: "$400",
      NonSaarcFinalUSD: "$500",
    },
    {
      type: "Industry",
      IndianEarlyINR: "₹15,000",
      IndianFinalINR: "₹17,000",
      SaarcEarlyUSD: "$500",
      SaarcFinalUSD: "$650",
      NonSaarcEarlyUSD: "$700",
      NonSaarcFinalUSD: "$850",
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
                    <TableHead className="text-white font-bold">Indian (Early)</TableHead>
                    <TableHead className="text-white font-bold">Indian (Final)</TableHead>
                    <TableHead className="text-white font-bold">SAARC (Early)</TableHead>
                    <TableHead className="text-white font-bold">SAARC (Final)</TableHead>
                    <TableHead className="text-white font-bold">NON-SAARC (Early)</TableHead>
                    <TableHead className="text-white font-bold">NON-SAARC (Final)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationData.map((row, idx) => (
                    <TableRow key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                      <TableCell className="font-semibold text-gray-900">{row.type}</TableCell>
                      <TableCell className="text-gray-700">{row.IndianEarlyINR}</TableCell>
                      <TableCell className="text-gray-700">{row.IndianFinalINR}</TableCell>
                      <TableCell className="text-gray-700">{row.SaarcEarlyUSD}</TableCell>
                      <TableCell className="text-gray-700">{row.SaarcFinalUSD}</TableCell>
                      <TableCell className="text-gray-700">{row.NonSaarcEarlyUSD}</TableCell>
                      <TableCell className="text-gray-700">{row.NonSaarcFinalUSD}</TableCell>
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

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">How to Register</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="font-bold text-lg mb-2">Step 1</div>
              <p className="text-blue-100 text-sm">
                Pay the registration fee based on your delegate type and registration period using the bank details
                above
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <UserPlus className="h-6 w-6" />
              </div>
              <div className="font-bold text-lg mb-2">Step 2</div>
              <p className="text-blue-100 text-sm">
                Create an account or login to your dashboard using the button below
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <div className="font-bold text-lg mb-2">Step 3</div>
              <p className="text-blue-100 text-sm">
                Fill in your details and enter the Transaction ID for payment verification
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="font-bold text-lg mb-2">Step 4</div>
              <p className="text-blue-100 text-sm">
                Once your payment is verified and status shows "Accepted", you can attend the conference
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link href="/auth/sign-up">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/auth/login">
                Login to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        {/* End of How to Register section */}
      </div>
    </section>
  )
}
