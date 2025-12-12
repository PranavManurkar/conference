"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LogOut, CheckCircle, Clock, XCircle, AlertCircle, PartyPopper } from "lucide-react"

type User = {
  id: string
  email?: string
}

type Registration = {
  id: string
  full_name: string
  email: string
  phone: string
  institution_organization: string
  designation: string
  country: string
  delegate_type: string
  registration_period: string
  participant_region: string
  payment_amount: number
  payment_reference_number: string | null
  payment_date: string | null
  abstract_title: string | null
  presentation_preference: string | null
  status: string
  admin_notes: string | null
  created_at: string
}

export default function DashboardClient({
  user,
  existingRegistration,
}: {
  user: User
  existingRegistration: Registration | null
}) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: existingRegistration?.full_name || "",
    email: existingRegistration?.email || user.email || "",
    phone: existingRegistration?.phone || "",
    institution_organization: existingRegistration?.institution_organization || "",
    designation: existingRegistration?.designation || "",
    country: existingRegistration?.country || "",
    delegate_type: existingRegistration?.delegate_type || "",
    registration_period: existingRegistration?.registration_period || "",
    participant_region: existingRegistration?.participant_region || "",
    payment_reference_number: existingRegistration?.payment_reference_number || "",
    payment_date: existingRegistration?.payment_date || "",
    abstract_title: existingRegistration?.abstract_title || "",
    presentation_preference: existingRegistration?.presentation_preference || "",
  })

  // Calculate payment amount based on selections
  const calculatePaymentAmount = () => {
    const fees: Record<string, Record<string, Record<string, number>>> = {
      "UG/PG Student": {
        "Early Bird": { Indian: 4000, SAARC: 75, "Non-SAARC": 100 },
        Final: { Indian: 4500, SAARC: 125, "Non-SAARC": 150 },
      },
      "Research Scholar": {
        "Early Bird": { Indian: 6000, SAARC: 200, "Non-SAARC": 250 },
        Final: { Indian: 7000, SAARC: 250, "Non-SAARC": 300 },
      },
      Faculty: {
        "Early Bird": { Indian: 10000, SAARC: 300, "Non-SAARC": 400 },
        Final: { Indian: 12000, SAARC: 400, "Non-SAARC": 500 },
      },
      Industry: {
        "Early Bird": { Indian: 15000, SAARC: 500, "Non-SAARC": 650 },
        Final: { Indian: 17000, SAARC: 700, "Non-SAARC": 850 },
      },
    }

    const { delegate_type, registration_period, participant_region } = formData

    if (delegate_type && registration_period && participant_region) {
      return fees[delegate_type]?.[registration_period]?.[participant_region] || 0
    }
    return 0
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const paymentAmount = calculatePaymentAmount()

    try {
      const registrationData = {
        user_id: user.id,
        ...formData,
        payment_amount: paymentAmount,
      }

      if (existingRegistration) {
        const { error: updateError } = await supabase
          .from("registrations")
          .update(registrationData)
          .eq("id", existingRegistration.id)

        if (updateError) throw updateError
        setSuccess("Registration updated successfully!")
      } else {
        const { error: insertError } = await supabase.from("registrations").insert([registrationData])

        if (insertError) throw insertError
        setSuccess("Registration submitted successfully!")
      }

      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Accepted":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        )
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="mr-1 h-3 w-3" />
            Under Process
          </Badge>
        )
    }
  }

  const canEdit = !existingRegistration || existingRegistration.status === "Under Process"

  const renderStatusCard = () => {
    if (!existingRegistration) return null

    return (
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Registration Status</CardTitle>
            {getStatusBadge(existingRegistration.status)}
          </div>
          <CardDescription>
            Submitted on {new Date(existingRegistration.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Accepted status message */}
          {existingRegistration.status === "Accepted" && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <PartyPopper className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 mb-1">Congratulations! Your registration is confirmed.</p>
                  <p className="text-sm text-green-800">
                    Your payment has been verified and you are now registered for 2D MatTech Global 2026. We look
                    forward to seeing you at the conference!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rejected status message with admin notes */}
          {existingRegistration.status === "Rejected" && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 mb-1">Registration Not Approved</p>
                  <p className="text-sm text-red-800 mb-2">
                    Unfortunately, your registration could not be approved. Please see the reason below and contact us
                    if you have questions.
                  </p>
                  {existingRegistration.admin_notes && (
                    <div className="mt-3 bg-white p-3 rounded border border-red-200">
                      <p className="text-xs font-semibold text-red-900 mb-1">Reason for Rejection:</p>
                      <p className="text-sm text-red-800">{existingRegistration.admin_notes}</p>
                    </div>
                  )}
                  <p className="text-xs text-red-700 mt-3">Contact: arrnd@iiti.ac.in for assistance</p>
                </div>
              </div>
            </div>
          )}

          {/* Under process status message */}
          {existingRegistration.status === "Under Process" && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">Your registration is being reviewed</p>
                  <p className="text-sm text-yellow-800">
                    Our team is verifying your payment details. This usually takes 2-3 business days. You will be
                    notified once your registration is approved.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Admin notes for non-rejected statuses */}
          {existingRegistration.admin_notes && existingRegistration.status !== "Rejected" && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-1">Admin Notes:</p>
              <p className="text-sm text-blue-800">{existingRegistration.admin_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Participant Dashboard</h1>
            <p className="text-gray-600 mt-1">2D MatTech Global 2026</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>

        {renderStatusCard()}

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>
              {canEdit
                ? "Fill in your details to complete your registration. Make sure to include your Transaction ID for payment verification."
                : "Your registration has been processed and cannot be edited"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      required
                      disabled={!canEdit}
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      disabled={!canEdit}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      disabled={!canEdit}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      required
                      disabled={!canEdit}
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution_organization">Institution/Organization *</Label>
                    <Input
                      id="institution_organization"
                      required
                      disabled={!canEdit}
                      value={formData.institution_organization}
                      onChange={(e) => setFormData({ ...formData, institution_organization: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      disabled={!canEdit}
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Delegate Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Delegate Information</h3>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="delegate_type">Delegate Type *</Label>
                    <Select
                      value={formData.delegate_type}
                      onValueChange={(value) => setFormData({ ...formData, delegate_type: value })}
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UG/PG Student">UG/PG Student</SelectItem>
                        <SelectItem value="Research Scholar">Research Scholar</SelectItem>
                        <SelectItem value="Faculty">Faculty</SelectItem>
                        <SelectItem value="Industry">Industry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration_period">Registration Period *</Label>
                    <Select
                      value={formData.registration_period}
                      onValueChange={(value) => setFormData({ ...formData, registration_period: value })}
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Early Bird">Early Bird</SelectItem>
                        <SelectItem value="Final">Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="participant_region">Participant Region *</Label>
                    <Select
                      value={formData.participant_region}
                      onValueChange={(value) => setFormData({ ...formData, participant_region: value })}
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Indian">Indian</SelectItem>
                        <SelectItem value="SAARC">SAARC</SelectItem>
                        <SelectItem value="Non-SAARC">Non-SAARC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Payment Amount Display */}
                {formData.delegate_type && formData.registration_period && formData.participant_region && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">Registration Fee:</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">
                      {formData.participant_region === "Indian" ? "₹" : "$"}
                      {calculatePaymentAmount()}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Information</h3>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Bank Details:</p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Account Name:</span> Indian Institute of Technology Indore
                    </p>
                    <p>
                      <span className="font-medium">Account Number:</span> 1476101027440
                    </p>
                    <p>
                      <span className="font-medium">IFSC Code:</span> CNRB0006223
                    </p>
                    <p>
                      <span className="font-medium">Bank:</span> Canara Bank, Simrol IIT Branch
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="payment_reference_number">Payment Reference Number</Label>
                    <Input
                      id="payment_reference_number"
                      disabled={!canEdit}
                      value={formData.payment_reference_number}
                      onChange={(e) => setFormData({ ...formData, payment_reference_number: e.target.value })}
                      placeholder="Transaction/Reference ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment_date">Payment Date</Label>
                    <Input
                      id="payment_date"
                      type="date"
                      disabled={!canEdit}
                      value={formData.payment_date}
                      onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Abstract Submission (Optional) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Abstract Submission (Optional)</h3>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="abstract_title">Abstract Title</Label>
                    <Input
                      id="abstract_title"
                      disabled={!canEdit}
                      value={formData.abstract_title}
                      onChange={(e) => setFormData({ ...formData, abstract_title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="presentation_preference">Presentation Preference</Label>
                    <Select
                      value={formData.presentation_preference}
                      onValueChange={(value) => setFormData({ ...formData, presentation_preference: value })}
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oral">Oral</SelectItem>
                        <SelectItem value="Poster">Poster</SelectItem>
                        <SelectItem value="No Preference">No Preference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}

              {canEdit && (
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Submitting..." : existingRegistration ? "Update Registration" : "Submit Registration"}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
