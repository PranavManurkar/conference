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
    <section id="registration" className="py-20 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-4">
          <div className="h-1 w-12 bg-[var(--primary)] rounded" />
        </div>
        <h2 className="text-4xl font-bold text-center text-[var(--foreground)] mb-4">
          <span className="text-[var(--primary)]">Registration</span> Fees
        </h2>
        <p className="text-center text-[var(--muted-foreground)] mb-12 text-lg">Early Bird rates available until May 5, 2026</p>

        <Card className="border-0 shadow-lg bg-[var(--card)]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[var(--nav)] text-[var(--primary-foreground)]">
                  <TableRow>
                    <TableHead className="text-[var(--primary-foreground)] font-bold">Delegate Type</TableHead>
                    <TableHead className="text-[var(--primary-foreground)] font-bold">Indian (Early)</TableHead>
                    <TableHead className="text-[var(--primary-foreground)] font-bold">Indian (Final)</TableHead>
                    <TableHead className="text-[var(--primary-foreground)] font-bold">SAARC (Early)</TableHead>
                    <TableHead className="text-[var(--primary-foreground)] font-bold">SAARC (Final)</TableHead>
                    <TableHead className="text-[var(--primary-foreground)] font-bold">NON-SAARC (Early)</TableHead>
                    <TableHead className="text-[var(--primary-foreground)] font-bold">NON-SAARC (Final)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationData.map((row, idx) => (
                    <TableRow key={idx} className={idx % 2 === 0 ? "bg-[var(--card)]" : "bg-[var(--muted)]"}>
                      <TableCell className="font-semibold text-[var(--foreground)]">{row.type}</TableCell>
                      <TableCell className="text-[var(--muted-foreground)]">{row.IndianEarlyINR}</TableCell>
                      <TableCell className="text-[var(--muted-foreground)]">{row.IndianFinalINR}</TableCell>
                      <TableCell className="text-[var(--muted-foreground)]">{row.SaarcEarlyUSD}</TableCell>
                      <TableCell className="text-[var(--muted-foreground)]">{row.SaarcFinalUSD}</TableCell>
                      <TableCell className="text-[var(--muted-foreground)]">{row.NonSaarcEarlyUSD}</TableCell>
                      <TableCell className="text-[var(--muted-foreground)]">{row.NonSaarcFinalUSD}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 bg-[color:var(--primary)] rounded-lg shadow-lg p-8 text-[var(--primary-foreground)]">
  <h3 className="text-2xl font-bold mb-6">How to Register</h3>
  <div className="grid md:grid-cols-4 gap-6">
    
    {/* STEP 1: Account Creation */}
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--primary-foreground)]/20 flex items-center justify-center mb-4">
        <UserPlus className="h-6 w-6 text-[var(--primary-foreground)]" />
      </div>
      <div className="font-bold text-lg mb-2">Step 1</div>
      <p className="text-[var(--primary-foreground)]/80 text-sm">
        Create an account or login to your dashboard to begin the registration process
      </p>
    </div>

    {/* STEP 2: Fill Details & Calculate */}
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--primary-foreground)]/20 flex items-center justify-center mb-4">
        <FileText className="h-6 w-6 text-[var(--primary-foreground)]" />
      </div>
      <div className="font-bold text-lg mb-2">Step 2</div>
      <p className="text-[var(--primary-foreground)]/80 text-sm">
        Fill in your registration details in the dashboard. The system will automatically calculate your fee
      </p>
    </div>

    {/* STEP 3: Payment */}
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--primary-foreground)]/20 flex items-center justify-center mb-4">
        <CreditCard className="h-6 w-6 text-[var(--primary-foreground)]" />
      </div>
      <div className="font-bold text-lg mb-2">Step 3</div>
      <p className="text-[var(--primary-foreground)]/80 text-sm">
        Pay the amount using the bank details displayed in the dashboard and submit your Transaction ID
      </p>
    </div>

    {/* STEP 4: Verification */}
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--primary-foreground)]/20 flex items-center justify-center mb-4">
        <CheckCircle className="h-6 w-6 text-[var(--primary-foreground)]" />
      </div>
      <div className="font-bold text-lg mb-2">Step 4</div>
      <p className="text-[var(--primary-foreground)]/80 text-sm">
        Once your payment is verified and status shows "Accepted", your registration is complete
      </p>
    </div>
  </div>

  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
    <Button asChild size="lg" className="bg-[var(--primary-foreground)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]">
      <Link href="/auth/sign-up">
        Create Account
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
    <Button
      asChild
      size="lg"
      variant="outline"
      className="border-[var(--primary-foreground)] text-[var(--primary-foreground)] hover:text-white hover:bg-[var(--primary-foreground)]"
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
