"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { logout, type User, getAccessToken, refreshAccessToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LogOut, CheckCircle, Clock, XCircle, AlertCircle, PartyPopper, Loader2, Trash2 } from "lucide-react"

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000"

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
  transaction_id: string | null
  payment_date: string | null
  // removed abstract/presentation fields per request
  status: string
  admin_notes: string | null
  created_at: string
}

async function authFetch(input: RequestInfo, init?: RequestInit) {
  const token = getAccessToken()
  const headers = new Headers(init?.headers || {})
  if (!headers.get("Content-Type")) headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const res = await fetch(input, { ...init, headers })

  if (res.status === 401) {
    const newAccess = await refreshAccessToken()
    if (newAccess) {
      const retryHeaders = new Headers(init?.headers || {})
      if (!retryHeaders.get("Content-Type")) retryHeaders.set("Content-Type", "application/json")
      retryHeaders.set("Authorization", `Bearer ${newAccess}`)
      return fetch(input, { ...init, headers: retryHeaders })
    }
  }

  return res
}

export default function DashboardClient({ user }: { user: User }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingStatus, setIsFetchingStatus] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [existingRegistration, setExistingRegistration] = useState<Registration | null>(null)

  const [formData, setFormData] = useState({
    full_name: "",
    email: user.email || "",
    phone: "",
    institution_organization: "",
    designation: "",
    country: "",
    delegate_type: "",
    registration_period: "",
    participant_region: "",
    transaction_id: "",
    payment_date: "",
  })
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      // 1. DEBUG: Log the user object to see if email exists
      console.log("DEBUG: User Object received:", user);
      
      // If user is missing or email is missing, we log it but DON'T return yet 
      // just to test if the fetch works.
      const userEmail = user?.email || ""; 
      
      if (!userEmail) {
         console.error("CRITICAL: User email is missing. Check your auth logic.");
         // We will try to fetch anyway using the 'list' endpoint which relies on Token, not email param
      }

      try {
        console.log("DEBUG: Attempting to fetch list from:", `${DJANGO_API_URL}/api/registrations/`);
        
        // Try listing registrations (This relies on the Token in headers, not the email variable)
        const listRes = await authFetch(`${DJANGO_API_URL}/api/registrations/`, { method: "GET" });
        
        console.log("DEBUG: List Fetch Status:", listRes.status);

        if (listRes.ok) {
          const listData = await listRes.json();
          console.log("DEBUG: List Data received:", listData);
          
          const reg = Array.isArray(listData) ? listData[0] ?? null : listData;
          if (reg) {
            setExistingRegistration(reg);
            // ... (your setFormData logic here) ...
            setIsFetchingStatus(false);
            return;
          }
        }

        // Fallback: check-by-email (Only run this if we actually have an email)
        if (userEmail) {
            console.log("DEBUG: Attempting check-by-email for:", userEmail);
            const response = await authFetch(`${DJANGO_API_URL}/api/registrations/check-by-email/?email=${encodeURIComponent(userEmail)}`);
            
            if (response.ok) {
              const data = await response.json();
              setExistingRegistration(data);
              // ... (your setFormData logic here) ...
            } else if (response.status === 404) {
              console.log("DEBUG: No registration found (404)");
              setExistingRegistration(null);
            }
        } else {
             console.warn("Skipping check-by-email because email is empty");
        }

      } catch (err) {
        console.error("DEBUG: Fetch FAILED with error:", err);
        setError("Unable to connect to server.");
      } finally {
        setIsFetchingStatus(false);
      }
    }

    fetchRegistrationStatus();
  }, [user]); // Change dependency to just [user] to be safe

  const calculatePaymentAmount = () => {
    const fees: Record<string, Record<string, Record<string, number>>> = {
      "UG/PG Student": {
        "Early Bird": { Indian: 4000, SAARC: 75, "Non-SAARC": 125 },
        Final: { Indian: 4500, SAARC: 100, "Non-SAARC": 150 },
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
        "Early Bird": { Indian: 15000, SAARC: 500, "Non-SAARC": 700 },
        Final: { Indian: 17000, SAARC: 650, "Non-SAARC": 850 },
      },
    }

    const { delegate_type, registration_period, participant_region } = formData

    if (delegate_type && registration_period && participant_region) {
      return fees[delegate_type]?.[registration_period]?.[participant_region] || 0
    }
    return 0
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // client-side validation
    if (!formData.full_name || !formData.email || !formData.transaction_id || !formData.payment_date) {
      setError("Please fill in required fields: Full name, Email, Transaction ID, Payment Date.")
      setIsLoading(false)
      return
    }

    const paymentAmount = calculatePaymentAmount()

    try {
      const registrationData = {
        ...formData,
        payment_amount: paymentAmount,
      }

      const isUpdate = !!existingRegistration
      const url = isUpdate ? `${DJANGO_API_URL}/api/registrations/${existingRegistration!.id}/` : `${DJANGO_API_URL}/api/registrations/`
      const method = isUpdate ? "PATCH" : "POST"

      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        if (data) {
          const fieldError = (data.transaction_id?.[0] as string) || (data.email?.[0] as string) || (data.detail as string) || Object.values(data)[0] as any || "Failed to submit registration"
          throw new Error(typeof fieldError === "string" ? fieldError : JSON.stringify(fieldError))
        } else {
          throw new Error("Failed to submit registration")
        }
      }

      setExistingRegistration(data)
      setSuccess(isUpdate ? "Registration updated successfully!" : "Registration submitted successfully! Your application is now under review.")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to delete your registration? You can resubmit after deletion.")) return
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await authFetch(`${DJANGO_API_URL}/api/registrations/${id}/`, { method: "DELETE" })
      if (res.status === 204 || res.ok) {
        setExistingRegistration(null)
        // reset form (keep email)
        setFormData((prev) => ({
          ...prev,
          full_name: "",
          phone: "",
          institution_organization: "",
          designation: "",
          country: "",
          delegate_type: "",
          registration_period: "",
          participant_region: "",
          transaction_id: "",
          payment_date: "",
        }))
        setSuccess("Registration deleted. You can now refill and resubmit.")
      } else {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || "Failed to delete registration")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
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

  const canEdit = !existingRegistration || existingRegistration.status === "Rejected"

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
          {/* Accepted view */}
          {existingRegistration.status === "Accepted" && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900">You're registered!</h3>
                  <p className="text-sm text-gray-700 mt-1">Thank you — your payment has been verified and your registration is confirmed.</p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">{existingRegistration.full_name}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{existingRegistration.email}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Delegate Type</p>
                      <p className="font-medium">{existingRegistration.delegate_type}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Registration Period</p>
                      <p className="font-medium">{existingRegistration.registration_period}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Payment Amount</p>
                      <p className="font-medium">{existingRegistration.participant_region === "Indian" ? `₹${existingRegistration.payment_amount}` : `$${existingRegistration.payment_amount}`}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Transaction ID</p>
                      <p className="font-medium">{existingRegistration.transaction_id}</p>
                    </div>
                  </div>

                  {existingRegistration.admin_notes && (
                    <div className="mt-4 bg-blue-50 p-3 rounded">
                      <p className="text-sm font-semibold text-blue-900">Admin Notes</p>
                      <p className="text-sm text-blue-800">{existingRegistration.admin_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Under Process view */}
          {existingRegistration.status === "Under Process" && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">Your registration is being reviewed</p>
                  <p className="text-sm text-yellow-800">Our team is verifying your payment details. This usually takes 2-3 business days.</p>
                  <div className="mt-3 bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Submitted details</p>
                    <p className="text-sm font-medium">{existingRegistration.full_name} • {existingRegistration.email}</p>
                    <p className="text-sm">Transaction: {existingRegistration.transaction_id} • Paid: {existingRegistration.payment_date}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rejected view with delete/resubmit */}
          {existingRegistration.status === "Rejected" && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900 mb-1">Registration Not Approved</p>
                  <p className="text-sm text-red-800 mb-2">You can delete this submission, edit your details and resubmit.</p>
                  {existingRegistration.admin_notes && (
                    <div className="mt-3 bg-white p-3 rounded border border-red-200">
                      <p className="text-xs font-semibold text-red-900 mb-1">Reason for Rejection:</p>
                      <p className="text-sm text-red-800">{existingRegistration.admin_notes}</p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" onClick={() => deleteRegistration(existingRegistration.id)} disabled={isLoading}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete & Refill
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (isFetchingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading your registration status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
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

        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>
              {canEdit
                ? "Fill in your details to complete your registration. Make sure to include your Transaction ID for payment verification."
                : "Your registration has been submitted and cannot be edited while it is under review or after acceptance."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                        <SelectItem value="Early Bird">Early Bird (until May 5, 2026)</SelectItem>
                        <SelectItem value="Final">Final (after May 5, 2026)</SelectItem>
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

                {formData.delegate_type && formData.registration_period && formData.participant_region && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">Registration Fee:</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">
                      {formData.participant_region === "Indian" ? "₹" : "$"}
                      {calculatePaymentAmount()}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Please pay this amount using the bank details below before submitting
                    </p>
                  </div>
                )}
              </div>

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
                    <p>
                      <span className="font-medium">SWIFT Code:</span> CNRBINBBMSG (for international transfers)
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="transaction_id">Transaction ID *</Label>
                    <Input
                      id="transaction_id"
                      required
                      disabled={!canEdit}
                      value={formData.transaction_id || ""}
                      onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                      placeholder="Enter your payment transaction ID"
                    />
                    <p className="text-xs text-gray-500">Enter the transaction/reference ID from your bank payment</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment_date">Payment Date *</Label>
                    <Input
                      id="payment_date"
                      type="date"
                      required
                      disabled={!canEdit}
                      value={formData.payment_date || ""}
                      onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              {canEdit && (
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : existingRegistration ? (
                    "Update Registration"
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
