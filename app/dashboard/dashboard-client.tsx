"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { logout, type User, getAccessToken, refreshAccessToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  PartyPopper,
  Loader2,
  Trash2,
  Info,
  ExternalLink,
} from "lucide-react"

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "https://tdmtg.iiti.ac.in"
const PAYMENT_URL = "https://payu.in/web/EB3AF4CBC22FB4C90B5ABC9A52E5CAC3"
const PAYMENT_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(PAYMENT_URL)}`

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
  food_preference: string | null
  beverage_choice: string | null
  payment_amount: number
  transaction_id: string | null
  transaction_screenshot: string | null
  payment_date: string | null
  status: string
  admin_notes: string | null
  created_at: string
  is_presenter: boolean
  abstract_id: string | null
  cmt_id: string | null
  abstract_title: string | null
  presentation_type: "oral" | "poster" | "thesis" | null
  oral_presentation: boolean
  poster_presentation: boolean
  accompanying_persons: number
}

// null means "user hasn't chosen yet"
type FormData = {
  full_name: string
  email: string
  phone: string
  institution_organization: string
  designation: string
  country: string
  delegate_type: string
  registration_period: string
  participant_region: string
  food_preference: string
  beverage_choice: string
  transaction_id: string
  transaction_screenshot: File | null
  payment_date: string
  abstract_id: string
  abstract_title: string
  accompanying_persons: number
  presentation_type: "oral" | "poster" | "thesis" | ""
  oral_presentation: boolean
  poster_presentation: boolean
  is_presenter: boolean | null // null = not yet chosen
}

async function authFetch(input: RequestInfo, init?: RequestInit) {
  const token = getAccessToken()
  const headers = new Headers(init?.headers || {})
  const isMultipart = init?.body instanceof FormData
  if (!isMultipart && !headers.get("Content-Type")) headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const res = await fetch(input, { ...init, headers })

  if (res.status === 401) {
    const newAccess = await refreshAccessToken()
    if (newAccess) {
      const retryHeaders = new Headers(init?.headers || {})
      if (!isMultipart && !retryHeaders.get("Content-Type")) retryHeaders.set("Content-Type", "application/json")
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

  const userEmail = user?.email || ""

  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: userEmail,
    phone: "",
    institution_organization: "",
    designation: "",
    country: "",
    delegate_type: "",
    registration_period: "",
    participant_region: "",
    food_preference: "",
    beverage_choice: "",
    transaction_id: "",
    transaction_screenshot: null,
    payment_date: "",
    abstract_id: "",
    abstract_title: "",
    accompanying_persons: 0,
    presentation_type: "",
    oral_presentation: false,
    poster_presentation: false,
    is_presenter: null, // ← null means "not yet selected"
  })

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (!userEmail) {
        console.error("CRITICAL: User email is missing.")
        setIsFetchingStatus(false)
        return
      }

      try {
        const listRes = await authFetch(`${DJANGO_API_URL}/api/registrations/`, { method: "GET" })

        if (listRes.ok) {
          const listData = await listRes.json()
          const reg = Array.isArray(listData) ? (listData[0] ?? null) : listData
          if (reg) {
            setExistingRegistration(reg)
            setFormData({
              full_name: reg.full_name || "",
              email: reg.email || userEmail,
              phone: reg.phone || "",
              institution_organization: reg.institution_organization || "",
              designation: reg.designation || "",
              country: reg.country || "",
              delegate_type: reg.delegate_type || "",
              registration_period: reg.registration_period || "",
              participant_region: reg.participant_region || "",
              food_preference: reg.food_preference || "",
              beverage_choice: reg.beverage_choice || "",
              transaction_id: reg.transaction_id || "",
              transaction_screenshot: null,
              payment_date: reg.payment_date || "",
              // is_presenter from DB is always a real boolean
              is_presenter: typeof reg.is_presenter === "boolean" ? reg.is_presenter : null,
              abstract_id: reg.cmt_id || reg.abstract_id || "",
              abstract_title: reg.abstract_title || "",
              accompanying_persons: reg.accompanying_persons || 0,
              presentation_type:
                reg.presentation_type || (reg.oral_presentation ? "oral" : reg.poster_presentation ? "poster" : ""),
              oral_presentation: !!reg.oral_presentation,
              poster_presentation: !!reg.poster_presentation,
            })
            setIsFetchingStatus(false)
            return
          }
        }

        if (userEmail) {
          const response = await authFetch(
            `${DJANGO_API_URL}/api/registrations/check-by-email/?email=${encodeURIComponent(userEmail)}`,
          )
          if (response.ok) {
            const data = await response.json()
            setExistingRegistration(data)
            setFormData({
              full_name: data.full_name || "",
              email: data.email || userEmail,
              phone: data.phone || "",
              institution_organization: data.institution_organization || "",
              designation: data.designation || "",
              country: data.country || "",
              delegate_type: data.delegate_type || "",
              registration_period: data.registration_period || "",
              participant_region: data.participant_region || "",
              food_preference: data.food_preference || "",
              beverage_choice: data.beverage_choice || "",
              transaction_id: data.transaction_id || "",
              transaction_screenshot: null,
              payment_date: data.payment_date || "",
              is_presenter: typeof data.is_presenter === "boolean" ? data.is_presenter : null,
              abstract_id: data.cmt_id || data.abstract_id || "",
              abstract_title: data.abstract_title || "",
              accompanying_persons: data.accompanying_persons || 0,
              presentation_type:
                data.presentation_type || (data.oral_presentation ? "oral" : data.poster_presentation ? "poster" : ""),
              oral_presentation: !!data.oral_presentation,
              poster_presentation: !!data.poster_presentation,
            })
          } else if (response.status === 404) {
            setExistingRegistration(null)
          }
        }
      } catch (err) {
        console.error("Fetch FAILED:", err)
        setError("Unable to connect to server.")
      } finally {
        setIsFetchingStatus(false)
      }
    }

    fetchRegistrationStatus()
  }, [user, userEmail])

  const calculatePaymentAmount = () => {
    type Region = "Indian" | "SAARC" | "Non-SAARC"
    type Period = "Early Bird" | "Final"
    type Delegate = "UG/PG Student" | "Research Scholar" | "Faculty" | "Industry"

    const fees: Record<Delegate, Record<Period, Record<Region, number>>> = {
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

    const accompany: Record<Delegate, Record<Period, Record<Region, number>>> = {
      "UG/PG Student": {
        "Early Bird": { Indian: 0, SAARC: 0, "Non-SAARC": 0 },
        Final: { Indian: 0, SAARC: 0, "Non-SAARC": 0 },
      },
      "Research Scholar": {
        "Early Bird": { Indian: 5000, SAARC: 170, "Non-SAARC": 210 },
        Final: { Indian: 6000, SAARC: 210, "Non-SAARC": 250 },
      },
      Faculty: {
        "Early Bird": { Indian: 7500, SAARC: 225, "Non-SAARC": 300 },
        Final: { Indian: 9000, SAARC: 300, "Non-SAARC": 375 },
      },
      Industry: {
        "Early Bird": { Indian: 11500, SAARC: 375, "Non-SAARC": 525 },
        Final: { Indian: 13000, SAARC: 500, "Non-SAARC": 640 },
      },
    }

    const { delegate_type, registration_period, participant_region, accompanying_persons } = formData

    if (delegate_type && registration_period && participant_region) {
      const base = fees[delegate_type as Delegate]?.[registration_period as Period]?.[participant_region as Region] || 0
      const acc =
        (accompany[delegate_type as Delegate]?.[registration_period as Period]?.[participant_region as Region] || 0) *
        (accompanying_persons || 0)
      return base + acc
    }
    return 0
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
      router.refresh()
    } catch {
      router.push("/")
      router.refresh()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // ── FIXED VALIDATION ──────────────────────────────────────────────────────
    // is_presenter === null means the user never clicked Yes or No yet
    const missingBasic =
      !formData.full_name.trim() ||
      !formData.email.trim() ||
      !formData.transaction_id.trim() ||
      !formData.payment_date.trim() ||
      !formData.food_preference.trim() ||
      !formData.beverage_choice.trim() ||
      !formData.transaction_screenshot

    if (missingBasic) {
      setError("Please fill in all required fields and upload the transaction screenshot.")
      setIsLoading(false)
      return
    }

    if (formData.is_presenter === null) {
      setError("Please indicate whether you are presenting a paper (Yes or No).")
      setIsLoading(false)
      return
    }
    // ──────────────────────────────────────────────────────────────────────────

    const isPresenter = formData.is_presenter === true

    // presenter-specific validation
    if (isPresenter) {
      if (!formData.abstract_id.trim()) {
        setError("Please provide the CMT ID since you are presenting a paper.")
        setIsLoading(false)
        return
      }
      if (!formData.abstract_title.trim()) {
        setError("Please provide the abstract title since you are presenting a paper.")
        setIsLoading(false)
        return
      }
      if (!formData.presentation_type) {
        setError("Please select Oral, Poster, or Thesis presentation type.")
        setIsLoading(false)
        return
      }
    }

    const paymentAmount = calculatePaymentAmount()

    try {
      const registrationData = new FormData()
      registrationData.append("full_name", formData.full_name)
      registrationData.append("email", formData.email)
      registrationData.append("phone", formData.phone)
      registrationData.append("institution_organization", formData.institution_organization)
      registrationData.append("designation", formData.designation)
      registrationData.append("country", formData.country)
      registrationData.append("delegate_type", formData.delegate_type)
      registrationData.append("registration_period", formData.registration_period)
      registrationData.append("participant_region", formData.participant_region)
      registrationData.append("food_preference", formData.food_preference)
      registrationData.append("beverage_choice", formData.beverage_choice)
      registrationData.append("transaction_id", formData.transaction_id)
      registrationData.append("payment_date", formData.payment_date)
      registrationData.append("payment_amount", String(paymentAmount))
      registrationData.append("is_presenter", String(isPresenter))
      registrationData.append("abstract_id", isPresenter ? formData.abstract_id : "")
      registrationData.append("cmt_id", isPresenter ? formData.abstract_id : "")
      registrationData.append("abstract_title", isPresenter ? formData.abstract_title : "")
      registrationData.append("presentation_type", isPresenter ? formData.presentation_type : "")
      registrationData.append("oral_presentation", String(isPresenter && formData.presentation_type === "oral"))
      registrationData.append("poster_presentation", String(isPresenter && formData.presentation_type === "poster"))
      registrationData.append("accompanying_persons", String(Number(formData.accompanying_persons || 0)))
      if (formData.transaction_screenshot) {
        registrationData.append("transaction_screenshot", formData.transaction_screenshot)
      }

      console.debug("Submitting payload:", registrationData)

      const isUpdate = !!existingRegistration
      const url = isUpdate
        ? `${DJANGO_API_URL}/api/registrations/${existingRegistration!.id}/`
        : `${DJANGO_API_URL}/api/registrations/`
      const method = isUpdate ? "PATCH" : "POST"

      const response = await authFetch(url, {
        method,
        body: registrationData,
      })

      const data = await response.json().catch(() => null)
      console.debug("Server response:", response.status, data)

      if (!response.ok) {
        if (data) {
          // Try to surface the most useful error message from DRF
          const fieldError =
              (data.food_preference?.[0] as string) ||
            (data.beverage_choice?.[0] as string) ||
            (data.payment_date?.[0] as string) ||
              (data.cmt_id?.[0] as string) ||
            (data.abstract_id?.[0] as string) ||
              (data.abstract_title?.[0] as string) ||
              (data.presentation_type?.[0] as string) ||
            (data.oral_presentation?.[0] as string) ||
            (data.poster_presentation?.[0] as string) ||
            (data.transaction_id?.[0] as string) ||
              (data.transaction_screenshot?.[0] as string) ||
            (data.email?.[0] as string) ||
            (data.non_field_errors?.[0] as string) ||
            (data.detail as string) ||
            (Object.values(data)[0] as any) ||
            "Failed to submit registration"
          throw new Error(typeof fieldError === "string" ? fieldError : JSON.stringify(fieldError))
        } else {
          throw new Error("Failed to submit registration. Please check your connection.")
        }
      }

      setExistingRegistration(data)
      setSuccess(
        isUpdate
          ? "Registration updated successfully!"
          : "Registration submitted successfully! Your application is now under review.",
      )

      // Sync local form state to what the server returned
      if (data) {
        setFormData((prev) => ({
          ...prev,
          is_presenter: typeof data.is_presenter === "boolean" ? data.is_presenter : prev.is_presenter,
          abstract_id: data.cmt_id || data.abstract_id || "",
          abstract_title: data.abstract_title || "",
          presentation_type:
            data.presentation_type || (data.oral_presentation ? "oral" : data.poster_presentation ? "poster" : ""),
          oral_presentation: !!data.oral_presentation,
          poster_presentation: !!data.poster_presentation,
          transaction_screenshot: null,
        }))
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
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
          transaction_screenshot: null,
          is_presenter: null, // reset to null so radio is unchecked
          abstract_id: "",
          abstract_title: "",
          presentation_type: "",
          poster_presentation: false,
          oral_presentation: false,
          accompanying_persons: 0,
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
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 px-4 py-1.5 text-sm font-semibold shadow-md">
            <CheckCircle className="mr-1.5 h-4 w-4" />
            Accepted
          </Badge>
        )
      case "Rejected":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 px-4 py-1.5 text-sm font-semibold shadow-md">
            <XCircle className="mr-1.5 h-4 w-4" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 px-4 py-1.5 text-sm font-semibold shadow-md">
            <Clock className="mr-1.5 h-4 w-4" />
            Under Review
          </Badge>
        )
    }
  }

  const canEdit = !existingRegistration

  const renderInfoGrid = (reg: Registration) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {[
        { label: "Full Name", value: reg.full_name },
        { label: "Email", value: reg.email },
        { label: "Phone", value: reg.phone },
        { label: "Institution", value: reg.institution_organization },
        { label: "Delegate Type", value: reg.delegate_type },
        { label: "Registration Period", value: reg.registration_period },
        { label: "Food Preference", value: reg.food_preference },
        { label: "Beverage Choice", value: reg.beverage_choice },
        {
          label: "Payment Amount",
          value:
            reg.participant_region === "Indian"
              ? `₹${reg.payment_amount}`
              : `$${reg.payment_amount}`,
        },
        { label: "Transaction ID", value: reg.transaction_id },
          { label: "Transaction Screenshot", value: reg.transaction_screenshot ? "Uploaded" : "—" },
      ].map((item) => (
        <div
          key={item.label}
          className="bg-white p-4 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow"
        >
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">{item.label}</p>
          <p className="font-semibold text-gray-900 break-words">{item.value || "—"}</p>
        </div>
      ))}
        {reg.is_presenter && (reg.cmt_id || reg.abstract_id) && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">CMT ID</p>
            <p className="font-semibold text-gray-900">{reg.cmt_id || reg.abstract_id}</p>
          </div>
        )}
        {reg.is_presenter && reg.abstract_title && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Abstract Title</p>
            <p className="font-semibold text-gray-900">{reg.abstract_title}</p>
        </div>
      )}
      {reg.is_presenter && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Presentation Mode</p>
          <p className="font-semibold text-gray-900">
              {reg.presentation_type === "oral"
                ? "Oral Presentation"
                : reg.presentation_type === "poster"
                  ? "Poster Presentation"
                  : reg.presentation_type === "thesis"
                    ? "Thesis Presentation"
                    : reg.oral_presentation
                      ? "Oral Presentation"
                      : reg.poster_presentation
                        ? "Poster Presentation"
                        : "—"}
          </p>
        </div>
      )}
    </div>
  )

  const renderStatusCard = () => {
    if (!existingRegistration) return null
    return (
      <Card className="mb-8 border-0 shadow-xl overflow-hidden">
        <CardHeader className="relative pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Registration Status
              </CardTitle>
              <CardDescription className="text-base mt-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Submitted on{" "}
                {new Date(existingRegistration.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
            {getStatusBadge(existingRegistration.status)}
          </div>
        </CardHeader>
        <CardContent className="relative space-y-6">
          {existingRegistration.status === "Accepted" && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-inner border-2 border-green-200">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-full shadow-lg">
                  <PartyPopper className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-900 mb-2">Congratulations! You're Registered! 🎉</h3>
                  <p className="text-base text-green-800 mb-6">
                    Your payment has been verified and registration is confirmed.
                  </p>
                  {renderInfoGrid(existingRegistration)}
                  {existingRegistration.admin_notes && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-l-4 border-blue-500">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-blue-900 mb-1">Message from Admin</p>
                          <p className="text-sm text-blue-800">{existingRegistration.admin_notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {existingRegistration.status === "Under Process" && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-full shadow-lg">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xl text-amber-900 mb-2">Your registration is being reviewed</p>
                  <p className="text-base text-amber-800 mb-4">
                    Our team is verifying your payment. This usually takes 2–3 business days.
                  </p>
                  {renderInfoGrid(existingRegistration)}
                </div>
              </div>
            </div>
          )}

          {existingRegistration.status === "Rejected" && (
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-red-500 to-rose-500 p-3 rounded-full shadow-lg">
                  <AlertCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xl text-red-900 mb-2">Registration Not Approved</p>
                  <p className="text-base text-red-800 mb-4">
                    Please review the reason below, delete this submission, and resubmit with correct details.
                  </p>
                  {existingRegistration.admin_notes && (
                    <div className="bg-white p-5 rounded-xl border-l-4 border-red-500 shadow-sm mb-4">
                      <p className="text-xs font-bold text-red-900 uppercase tracking-wide mb-2">Reason for Rejection</p>
                      <p className="text-sm text-red-800">{existingRegistration.admin_notes}</p>
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => deleteRegistration(existingRegistration.id)}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete & Resubmit
                      </>
                    )}
                  </Button>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl">
          <Loader2 className="h-20 w-20 text-blue-600 animate-spin mx-auto mb-6" />
          <p className="text-lg font-semibold text-gray-800 mb-2">Loading Your Dashboard</p>
          <p className="text-sm text-gray-500">Fetching your registration status…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 shadow-md">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900">Participant Dashboard</h1>
              <p className="text-gray-700 text-lg font-medium">2D MatTech Global 2026</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white hover:bg-blue-50 border-2 border-gray-300 shadow-md"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {existingRegistration && renderStatusCard()}

        {!existingRegistration && (
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="text-2xl font-bold text-gray-900">
                <span className="text-[color:var(--primary)]">Registration Form</span>
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Fill in your details to complete your registration. Include your Transaction ID for payment
                verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* ── Personal Information ───────────────────────────────────────────── */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-100">
                    <div className="w-1 h-8 bg-[color:var(--primary)] rounded-full" />
                    <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {[
                      { id: "full_name", label: "Full Name", required: true, placeholder: "Enter your full name" },
                      {
                        id: "email",
                        label: "Email Address",
                        required: true,
                        type: "email",
                        placeholder: "your.email@example.com",
                      },
                      { id: "phone", label: "Phone Number", required: true, type: "tel", placeholder: "+91 XXXXX XXXXX" },
                      { id: "country", label: "Country", required: true, placeholder: "Enter your country" },
                      {
                        id: "institution_organization",
                        label: "Institution/Organization",
                        required: true,
                        placeholder: "Your institution name",
                      },
                      { id: "designation", label: "Designation", placeholder: "Your job title" },
                    ].map(({ id, label, required, type = "text", placeholder }) => (
                      <div key={id} className="space-y-2">
                        <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
                          {label} {required && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                          id={id}
                          type={type}
                          required={required}
                          disabled={!canEdit}
                          value={(formData as any)[id]}
                          onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                          className="h-12 border-2 focus:border-blue-500 transition-colors"
                          placeholder={placeholder}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Delegate Information ───────────────────────────────────────────── */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-purple-100">
                    <div className="w-1 h-8 bg-[color:var(--primary)] rounded-full" />
                    <h3 className="text-xl font-bold text-gray-900">Delegate Information</h3>
                  </div>
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Delegate Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Delegate Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.delegate_type}
                        onValueChange={(v) => setFormData({ ...formData, delegate_type: v })}
                        disabled={!canEdit}
                        required
                      >
                        <SelectTrigger className="h-12 border-2">
                          <SelectValue placeholder="Select delegate type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {["UG/PG Student", "Research Scholar", "Faculty", "Industry"].map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Registration Period */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Registration Period <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.registration_period}
                        onValueChange={(v) => setFormData({ ...formData, registration_period: v })}
                        disabled={!canEdit}
                        required
                      >
                        <SelectTrigger className="h-12 border-2">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Early Bird">Early Bird (until May 5, 2026)</SelectItem>
                          <SelectItem value="Final">Final (after May 5, 2026)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Participant Region */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Participant Region <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.participant_region}
                        onValueChange={(v) => setFormData({ ...formData, participant_region: v })}
                        disabled={!canEdit}
                        required
                      >
                        <SelectTrigger className="h-12 border-2">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {["Indian", "SAARC", "Non-SAARC"].map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Accompanying Persons (not for students) */}
                    {formData.delegate_type && formData.delegate_type !== "UG/PG Student" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Accompanying Persons</Label>
                        <Select
                          value={String(formData.accompanying_persons ?? 0)}
                          onValueChange={(v) =>
                            setFormData({ ...formData, accompanying_persons: parseInt(v, 10) || 0 })
                          }
                          disabled={!canEdit}
                        >
                          <SelectTrigger className="h-12 border-2">
                            <SelectValue placeholder="0" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {["0", "1", "2", "3"].map((v) => (
                              <SelectItem key={v} value={v}>
                                {v}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* ── Food Preferences ───────────────────────────────────────────── */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-emerald-100">
                      <div className="w-1 h-8 bg-[color:var(--primary)] rounded-full" />
                      <h3 className="text-xl font-bold text-gray-900">Food Preferences</h3>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Food Preference <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.food_preference}
                          onValueChange={(v) => setFormData({ ...formData, food_preference: v })}
                          disabled={!canEdit}
                          required
                        >
                          <SelectTrigger className="h-12 border-2">
                            <SelectValue placeholder="Select food preference" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {[
                              { value: "Veg", label: "Veg" },
                              { value: "Non-Veg", label: "Non-Veg" },
                            ].map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Beverage Choice <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.beverage_choice}
                          onValueChange={(v) => setFormData({ ...formData, beverage_choice: v })}
                          disabled={!canEdit}
                          required
                        >
                          <SelectTrigger className="h-12 border-2">
                            <SelectValue placeholder="Select beverage choice" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {[
                              { value: "Alcoholic", label: "Alcoholic" },
                              { value: "Non-Alcoholic", label: "Non-Alcoholic" },
                            ].map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* ── Presenting Paper ──────────────────────────────────────────── */}
                  <div className="space-y-4 mt-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        Are you presenting a paper? <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        // When is_presenter is null (not chosen), pass empty string so nothing is selected
                        value={formData.is_presenter === null ? "" : formData.is_presenter ? "yes" : "no"}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            is_presenter: value === "yes",
                            abstract_id: value === "no" ? "" : formData.abstract_id,
                            ...(value === "no" ? { oral_presentation: false, poster_presentation: false } : {}),
                          })
                        }
                        disabled={!canEdit}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="presenting_yes" />
                          <Label htmlFor="presenting_yes" className="font-normal cursor-pointer">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="presenting_no" />
                          <Label htmlFor="presenting_no" className="font-normal cursor-pointer">
                            No
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* CMT ID + abstract title + presentation type — only shown when presenter = yes */}
                    {formData.is_presenter === true && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                          <Label htmlFor="abstract_title" className="text-sm font-semibold text-gray-700">
                            Abstract Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="abstract_title"
                            required
                            disabled={!canEdit}
                            value={formData.abstract_title}
                            onChange={(e) => setFormData({ ...formData, abstract_title: e.target.value })}
                            className="h-12 border-2 focus:border-purple-500 transition-colors"
                            placeholder="Enter your abstract title"
                          />
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            Title used in your CMT submission
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="abstract_id" className="text-sm font-semibold text-gray-700">
                            CMT ID <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="abstract_id"
                            required
                            disabled={!canEdit}
                            value={formData.abstract_id}
                            onChange={(e) => setFormData({ ...formData, abstract_id: e.target.value })}
                            className="h-12 border-2 focus:border-purple-500 transition-colors"
                            placeholder="Enter your CMT paper ID"
                          />
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            The CMT ID assigned after your submission
                          </p>
                        </div>

                        <fieldset className="mt-3">
                          <legend className="text-sm font-semibold text-gray-700">
                            Presentation Type <span className="text-red-500">*</span>
                          </legend>
                          <div className="grid gap-3 sm:grid-cols-3 mt-2">
                            {[
                              { value: "oral", label: "Oral Presentation" },
                              { value: "poster", label: "Poster Presentation" },
                              { value: "thesis", label: "Thesis Presentation" },
                            ].map((option) => (
                              <label
                                key={option.value}
                                className="flex items-center gap-2 cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3"
                              >
                                <input
                                  type="radio"
                                  name="presentation_type"
                                  value={option.value}
                                  checked={formData.presentation_type === option.value}
                                  disabled={!canEdit}
                                  onChange={() =>
                                    setFormData({
                                      ...formData,
                                      presentation_type: option.value as FormData["presentation_type"],
                                      oral_presentation: option.value === "oral",
                                      poster_presentation: option.value === "poster",
                                    })
                                  }
                                />
                                <span className="ml-1 text-sm">{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    )}
                  </div>

                  {/* Fee display */}
                  {formData.delegate_type && formData.registration_period && formData.participant_region && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200 shadow-lg">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <p className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-1">
                            Registration Fee
                          </p>
                          <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {formData.participant_region === "Indian" ? "₹" : "$"}
                            {calculatePaymentAmount()}
                          </p>
                        </div>
                        <div className="bg-white/80 px-4 py-3 rounded-xl border border-blue-200">
                          <p className="text-xs text-blue-700 font-medium">💡 Please pay before submitting</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Payment Information ────────────────────────────────────────────── */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-indigo-100">
                    <div className="w-1 h-8 bg-[color:var(--primary)] rounded-full" />
                    <h3 className="text-xl font-bold text-gray-900">Payment Information</h3>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Bank details */}
                    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border-2 border-gray-200 shadow-inner">
                      <p className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="h-5 w-5 text-[color:var(--primary)]" />
                        Bank Details for Payment
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {[
                          { label: "Account Name", value: "Indian Institute of Technology Indore" },
                          { label: "Account Number", value: "1476101027440" },
                          { label: "IFSC Code", value: "CNRB0006223" },
                          { label: "Bank Name", value: "Canara Bank, Simrol IIT Branch" },
                          { label: "SWIFT Code (International)", value: "CNRBINBBMSG" },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <p className="font-semibold text-gray-700 mb-1">{label}</p>
                            <p className="text-gray-900 font-mono">{value}</p>
                          </div>
                        ))}
                        <a
                          href={PAYMENT_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[color:var(--primary)] hover:opacity-90 text-white p-4 rounded-xl shadow-sm transition-all flex flex-col justify-center items-center text-center group cursor-pointer"
                        >
                          <span className="font-bold flex items-center gap-2 text-base">
                            Pay Now
                            <ExternalLink className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
                          </span>
                          <span className="text-xs opacity-90 mt-0.5">via PayU Gateway</span>
                        </a>
                      </div>
                    </div>
                    {/* QR Code */}
                    <div className="lg:w-80 bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                      <h4 className="text-lg font-bold text-[color:var(--primary)] mb-4">Scan to Pay</h4>
                      <div className="bg-white p-2 rounded-xl border-2 border-dashed border-gray-200">
                        <img src={PAYMENT_QR_URL} alt="Payment QR Code" className="w-48 h-48 object-contain" />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="transaction_id" className="text-sm font-semibold text-gray-700">
                        Transaction ID <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="transaction_id"
                        required
                        disabled={!canEdit}
                        value={formData.transaction_id}
                        onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                        placeholder="Bank transaction / reference ID"
                        className="h-12 border-2 focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment_date" className="text-sm font-semibold text-gray-700">
                        Payment Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="payment_date"
                        type="date"
                        required
                        disabled={!canEdit}
                        value={formData.payment_date}
                        onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                        className="h-12 border-2 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-2xl">
                    <Label htmlFor="transaction_screenshot" className="text-sm font-semibold text-gray-700">
                      Transaction Screenshot <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="transaction_screenshot"
                      type="file"
                      accept="image/*"
                      required
                      disabled={!canEdit}
                      onChange={(e) =>
                        setFormData({ ...formData, transaction_screenshot: e.target.files?.[0] || null })
                      }
                      className="h-12 border-2 focus:border-indigo-500 bg-white"
                    />
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Upload the payment receipt or bank screenshot as an image.
                    </p>
                  </div>
                </div>

                {/* ── Alerts ────────────────────────────────────────────────────────── */}
                {error && (
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 p-5 rounded-xl shadow-md">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-800 font-medium leading-relaxed">{error}</p>
                    </div>
                  </div>
                )}
                {success && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-xl shadow-md">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-green-800 font-medium leading-relaxed">{success}</p>
                    </div>
                  </div>
                )}

                {/* ── Submit ────────────────────────────────────────────────────────── */}
                {canEdit && (
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-bold bg-[color:var(--primary)] hover:opacity-90 shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Submit Registration"
                    )}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-gray-500 mt-8">
          Need help? Contact us at{" "}
          <a href="mailto:2dmtg@iiti.ac.in" className="text-[color:var(--primary)] underline">
            2dmtg@iiti.ac.in
          </a>
        </p>
      </div>
    </div>
  )
}