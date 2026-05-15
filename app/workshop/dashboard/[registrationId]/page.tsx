"use client"

import type { FormEvent } from "react"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, Clock, ExternalLink, Loader2, MapPin, Send, ShieldCheck, Users } from "lucide-react"

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "https://tdmtg.iiti.ac.in"
const PAYMENT_URL = "https://payu.in/web/EB3AF4CBC22FB4C90B5ABC9A52E5CAC3"

type AgendaItem = {
  time: string
  title: string
  speaker?: string
  speakerRole?: string
  isBreak?: boolean
  highlight?: boolean
}

type WorkshopRegistration = {
  id: number
  registration_id: string
  workshop_id: number
  workshop_title: string
  full_name: string
  email: string
  phone: string
  institution: string
  designation: string
  participant_type: string
  fee_amount: string
  transaction_id: string | null
  transaction_screenshot: string | null
  status: string
  status_display: string
  admin_notes: string | null
  created_at: string
  updated_at: string
}

type StatusTheme = {
  accent: string
  accentSoft: string
  text: string
  border: string
  label: string
  panel: string
}

const STATUS_THEME: Record<string, StatusTheme> = {
  "Under Process": {
    accent: "bg-slate-500",
    accentSoft: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    label: "Under Process",
    panel: "bg-slate-50",
  },
  "Approved for Payment": {
    accent: "bg-amber-500",
    accentSoft: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    label: "Approved for Payment",
    panel: "bg-amber-50",
  },
  "Payment Submitted": {
    accent: "bg-sky-500",
    accentSoft: "bg-sky-100",
    text: "text-sky-700",
    border: "border-sky-200",
    label: "Payment Submitted",
    panel: "bg-sky-50",
  },
  Accepted: {
    accent: "bg-emerald-500",
    accentSoft: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    label: "Accepted",
    panel: "bg-emerald-50",
  },
  Rejected: {
    accent: "bg-rose-500",
    accentSoft: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
    label: "Rejected",
    panel: "bg-rose-50",
  },
}

const agenda: AgendaItem[] = [
  {
    time: "10:30 – 11:30",
    title: "Latest Trends & Advancements in X-ray Diffraction (XRD)",
    speaker: "Dr. Mangesh Mahajan",
    speakerRole: "Senior Applications Specialist, Malvern Panalytical",
  },
  {
    time: "11:30 – 11:45",
    title: "Tea Break",
    isBreak: true,
  },
  {
    time: "11:45 – 12:30",
    title: "Role of Particle Size, Zeta Potential & Rheology in Powders & Slurries",
    speaker: "Mr. Tejas Kharva",
    speakerRole: "Application Specialist, Aimil",
    highlight: true,
  },
  {
    time: "12:30 – 01:30",
    title: "Elemental Analysis Using X-ray Fluorescence (XRF)",
    speaker: "Dr. Dhrubajyoti Gupta",
    speakerRole: "Applications Specialist, Malvern Panalytical",
  },
  {
    time: "01:30 – 02:30",
    title: "Lunch Break",
    isBreak: true,
  },
  {
    time: "02:30 – 03:30",
    title: "Advanced Particle Characterization: Solutions from Malvern Panalytical",
    speaker: "Mr. Kunal Sharma",
    speakerRole: "Application Specialist, Malvern Panalytical",
  },
  {
    time: "03:30 – 04:15",
    title: "Sample Handling & Preparation Best Practices",
    speaker: "Workshop Faculty",
    speakerRole: "XRD and XRF sample handling guidance",
  },
  {
    time: "04:15 – 04:30",
    title: "Tea Break",
    isBreak: true,
  },
  {
    time: "04:30 – 05:30",
    title: "Live Demonstration: Multi-Purpose Empyrean XRD & Zetasizer",
    speaker: "Industry Experts",
    speakerRole: "Hands-on live demo",
  },
  {
    time: "05:30",
    title: "Networking & End of Programme",
    isBreak: true,
  },
]

const agenda2: AgendaItem[] = [
  { time: "09:30 – 10:00 AM", title: "Registration & Welcome Tea" },
  { time: "10:00 – 10:30 AM", title: "Inauguration & Opening Remarks" },
  { time: "10:30 – 11:05 AM", title: "Lecture 1: X-ray diffraction and Its Applications", speaker: "Dr. Archna Sagdeo, ISUD/ RRCAT" },
  { time: "11:05 – 11:40 AM", title: "Lecture 2: XANES and EXAFS measurements and Its Applications", speaker: "Prof. Preeti A. Bhobe, IIT Indore" },
  { time: "11:40 AM – 12:25 PM", title: "Lecture 3: X-ray photo-electron spectroscopy and Its Applications", speaker: "Dr. Soma Banik, ISUD RRCAT" },
  { time: "12:25 – 02:00 PM", title: "Lunch Break", isBreak: true },
  { time: "02:00 – 03:00 PM", title: "Travel to RRCAT (Indus-2 Facility)" },
  { time: "03:00 – 03:30 PM", title: "Introduction to the Indus-2 Synchrotron Facility" },
  { time: "03:30 – 05:30 PM", title: "Hands-on Session / Demonstration at Beamlines" },
  { time: "05:30 – 06:00 PM", title: "Discussion, Feedback, and Certificate Distribution" },
]

const WORKSHOP_DETAILS: Record<number, { title: string; description: string; date: string; venue: string; partners: string }> = {
  1: {
    title: "Workshop 1: XRD & XRF Characterization",
    description:
      "A full-day pre-conference workshop on XRD & XRF fundamentals, particle characterization, sample preparation best practices, and a live Empyrean XRD & Zetasizer demonstration.",
    date: "June 23, 2026",
    venue: "IIT Indore",
    partners: "Malvern Panalytical & Aimil",
  },
  2: {
    title: "Workshop 2: Synchrotron-Based Techniques for Materials Characterization",
    description:
      "Morning lectures on XRD, XANES/EXAFS and XPS at IIT Indore, followed by travel to RRCAT (Indus-2) for hands-on beamline demonstrations and discussions.",
    date: "June 23, 2026",
    venue: "Morning: IIT Indore; Afternoon: RRCAT (Indus-2)",
    partners: "RRCAT / IIT Indore",
  },
}

function AgendaTable({ items }: { items: AgendaItem[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[color:var(--nav)]/10 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[color:var(--nav)] text-white">
            <th className="py-3 px-4 text-left font-semibold whitespace-nowrap w-32">Time</th>
            <th className="py-3 px-4 text-left font-semibold">Session Title</th>
            <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Speaker</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            if (item.isBreak) {
              return (
                <tr key={index} className="bg-[color:var(--primary)]/5 border-y border-[color:var(--primary)]/10">
                  <td className="py-2 px-4 text-xs text-[color:var(--nav)]/60 font-medium whitespace-nowrap">{item.time}</td>
                  <td colSpan={2} className="py-2 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-[color:var(--nav)]/60 font-semibold text-xs uppercase tracking-widest">
                      {item.title.toLowerCase().includes("tea") && <Clock size={12} />}
                      {item.title.toLowerCase().includes("lunch") && <Users size={12} />}
                      {item.title}
                    </span>
                  </td>
                </tr>
              )
            }

            return (
              <tr
                key={index}
                className={`border-b border-[color:var(--nav)]/5 ${item.highlight ? "bg-yellow-50" : index % 2 === 0 ? "bg-[color:var(--primary-foreground)]" : "bg-[color:var(--nav)]/[0.02]"}`}
              >
                <td className="py-3 px-4 text-xs font-semibold text-[color:var(--primary)] whitespace-nowrap align-top">{item.time}</td>
                <td className="py-3 px-4 align-top">
                  <p className={`font-semibold text-[color:var(--nav)] ${item.highlight ? "text-yellow-800" : ""}`}>{item.title}</p>
                </td>
                <td className="py-3 px-4 align-top">
                  <div>
                    <p className={`font-semibold text-xs ${item.highlight ? "text-yellow-800" : "text-[color:var(--nav)]"}`}>{item.speaker}</p>
                    <p className="text-[10px] text-[color:var(--nav)]/60 mt-0.5 leading-snug">{item.speakerRole}</p>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function WorkshopRegistrationStatusPage() {
  const router = useRouter()
  const params = useParams() as { registrationId?: string }
  const searchParams = useSearchParams()

  const registrationId = decodeURIComponent(params.registrationId || "")
  const email = searchParams.get("email") || ""

  const [registration, setRegistration] = useState<WorkshopRegistration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [agendaOpen, setAgendaOpen] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [transactionScreenshot, setTransactionScreenshot] = useState<File | null>(null)
  const [submittingTransaction, setSubmittingTransaction] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const theme = useMemo(() => STATUS_THEME[registration?.status || "Under Process"] ?? STATUS_THEME["Under Process"], [registration?.status])
  const showWorkshopDetails = registration?.status === "Approved for Payment" || registration?.status === "Payment Submitted" || registration?.status === "Accepted"
  const workshopDetails = registration ? WORKSHOP_DETAILS[registration.workshop_id] : undefined
  const agendaItems = registration?.workshop_id === 2 ? agenda2 : agenda
  const canSubmitTransaction = registration?.status === "Approved for Payment" && !registration?.transaction_id

  useEffect(() => {
    if (!registrationId) {
      setLoading(false)
      setError("Missing workshop reference in the URL.")
      return
    }

    const loadRegistration = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.set("registration_reference", registrationId)
        if (email) params.set("email", email)

        const res = await fetch(`${DJANGO_API_URL}/api/workshop-registrations/lookup/?${params.toString()}`)
        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          setError(data?.detail || "Workshop registration not found.")
          setRegistration(null)
          return
        }

        setRegistration(data)
        setTransactionId(data.transaction_id || "")
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "workshop_registration",
            JSON.stringify({ registration_id: data.registration_id, email: data.email, workshop_id: data.workshop_id }),
          )
        }
      } catch {
        setError("Could not connect to the workshop registration service.")
      } finally {
        setLoading(false)
      }
    }

    void loadRegistration()
  }, [registrationId, email])

  const submitTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!registration || !transactionId.trim() || !transactionScreenshot) {
      setError("Enter the transaction ID and upload the transaction screenshot before submitting.")
      return
    }

    setSubmittingTransaction(true)
    setError(null)
    setMessage(null)

    try {
      const payload = new FormData()
      payload.append("registration_id", String(registration.id))
      payload.append("email", registration.email)
      payload.append("transaction_id", transactionId.trim())
      payload.append("transaction_screenshot", transactionScreenshot)

      const res = await fetch(`${DJANGO_API_URL}/api/workshop-registrations/submit-transaction/`, {
        method: "PATCH",
        body: payload,
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.detail || "Unable to submit transaction ID.")
        return
      }

      setRegistration(data)
      setTransactionScreenshot(null)
      setMessage("Transaction ID and screenshot submitted. Your payment is now awaiting admin verification.")
    } catch {
      setError("Could not submit the transaction ID right now.")
    } finally {
      setSubmittingTransaction(false)
    }
  }

  const statusCopy: Record<string, string> = {
    "Under Process": "Your application is under review. The payment field is locked until the committee approves it.",
    "Approved for Payment": "Your registration is approved for payment. Submit your transaction ID below.",
    "Payment Submitted": "Your transaction ID has been received and is waiting for admin verification.",
    Accepted: "Your workshop registration is confirmed.",
    Rejected: "Your workshop registration was rejected by the committee.",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--primary-foreground)] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-[color:var(--nav)]/10 bg-white px-8 py-10 shadow-lg text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[color:var(--primary)]" />
          <p className="mt-4 text-[color:var(--nav)]/70">Loading workshop registration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.panel} from-white via-white to-[color:var(--primary)]/5`}>
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
        <div className={`rounded-[2rem] border ${theme.border} bg-white shadow-xl overflow-hidden`}>
          <div className={`h-2 ${theme.accent}`} />
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="max-w-2xl">
                <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.text} mb-2`}>Workshop Registration Status</p>
                <h1 className="text-3xl md:text-4xl font-bold text-[color:var(--nav)]">{registration?.registration_id || registrationId}</h1>
                <p className="mt-3 text-[color:var(--nav)]/70">
                  {statusCopy[registration?.status || "Under Process"]}
                </p>
                {error && (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {message && (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}
              </div>

              <div className={`rounded-2xl ${theme.accentSoft} ${theme.text} border ${theme.border} px-4 py-3 self-start`}>
                <p className="text-xs uppercase tracking-wide font-semibold">Status</p>
                <p className="text-lg font-bold mt-1">{registration?.status_display || theme.label}</p>
              </div>
            </div>

            {registration && (
              <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--primary-foreground)] p-4">
                      <p className="text-xs uppercase tracking-wide text-[color:var(--nav)]/50">Name</p>
                      <p className="mt-1 font-semibold text-[color:var(--nav)]">{registration.full_name}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--primary-foreground)] p-4">
                      <p className="text-xs uppercase tracking-wide text-[color:var(--nav)]/50">Email</p>
                      <p className="mt-1 font-semibold text-[color:var(--nav)] break-all">{registration.email}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--primary-foreground)] p-4">
                      <p className="text-xs uppercase tracking-wide text-[color:var(--nav)]/50">Participant Type</p>
                      <p className="mt-1 font-semibold text-[color:var(--nav)] capitalize">{registration.participant_type}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--primary-foreground)] p-4">
                      <p className="text-xs uppercase tracking-wide text-[color:var(--nav)]/50">Fee</p>
                      <p className="mt-1 font-semibold text-[color:var(--nav)]">INR {registration.fee_amount}</p>
                    </div>
                  </div>

                  <div className={`rounded-3xl border ${theme.border} ${theme.panel} p-5 md:p-6`}>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${theme.text}`}>Committee update</p>
                        <h2 className="text-xl font-bold text-[color:var(--nav)] mt-1">{registration.status_display}</h2>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${theme.accentSoft} ${theme.text}`}>
                        {registration.registration_id}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-[color:var(--nav)]/75 leading-relaxed">{statusCopy[registration.status] || statusCopy["Under Process"]}</p>
                  </div>

                  {showWorkshopDetails && (
                    <div className="rounded-3xl border border-[color:var(--nav)]/10 bg-white p-5 md:p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)] mb-2">Workshop Details</p>
                          <h2 className="text-2xl font-bold text-[color:var(--nav)]">
                            {workshopDetails?.title || registration.workshop_title}
                          </h2>
                          <p className="mt-2 text-[color:var(--nav)]/70 max-w-3xl">
                            {workshopDetails?.description || "Workshop details will be shared after approval."}
                          </p>
                        </div>
                        <a
                          href="/workshop"
                          className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-[color:var(--primary)] hover:bg-[color:var(--primary)] hover:text-white transition-colors"
                        >
                          View Workshop Page <ExternalLink size={14} />
                        </a>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3 text-sm">
                        <div className="rounded-2xl bg-[color:var(--primary-foreground)] p-4 border border-[color:var(--nav)]/10">
                          <p className="text-[color:var(--nav)]/50 text-xs uppercase tracking-wide">Date</p>
                          <p className="font-semibold text-[color:var(--nav)] mt-1">{workshopDetails?.date || "June 23, 2026"}</p>
                        </div>
                        <div className="rounded-2xl bg-[color:var(--primary-foreground)] p-4 border border-[color:var(--nav)]/10">
                          <p className="text-[color:var(--nav)]/50 text-xs uppercase tracking-wide">Venue</p>
                          <p className="font-semibold text-[color:var(--nav)] mt-1">{workshopDetails?.venue || "IIT Indore"}</p>
                        </div>
                        <div className="rounded-2xl bg-[color:var(--primary-foreground)] p-4 border border-[color:var(--nav)]/10">
                          <p className="text-[color:var(--nav)]/50 text-xs uppercase tracking-wide">Partners</p>
                          <p className="font-semibold text-[color:var(--nav)] mt-1">{workshopDetails?.partners || ""}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--nav)]/10 bg-[color:var(--nav)]/5 px-4 py-3 text-sm text-[color:var(--nav)]/75">
                        <span className="font-semibold text-[color:var(--nav)]">Agenda</span>
                        <button
                          type="button"
                          onClick={() => setAgendaOpen((value) => !value)}
                          className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--nav)]/10 bg-white px-4 py-2 font-semibold text-[color:var(--nav)] hover:bg-[color:var(--primary)] hover:text-white hover:border-[color:var(--primary)] transition-colors"
                        >
                          {agendaOpen ? <><ChevronUp size={14} /> Hide Agenda</> : <><ChevronDown size={14} /> View Full Agenda</>}
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                <div className="space-y-6">
                  {registration.status === "Approved for Payment" && (
                    <div className="rounded-3xl border border-amber-200 bg-[linear-gradient(180deg,rgba(245,158,11,0.10),rgba(255,255,255,0.96))] p-6 shadow-lg">
                      <div className="flex items-center gap-3 pb-3 border-b border-amber-100">
                        <div className="w-1 h-8 bg-amber-500 rounded-full" />
                        <h2 className="text-xl font-bold text-[color:var(--nav)]">Payment Information</h2>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/70 bg-white p-4 shadow-sm">
                          <p className="text-xs uppercase tracking-wide text-[color:var(--nav)]/50">Workshop Fee</p>
                          <p className="mt-1 text-lg font-semibold text-[color:var(--nav)]">INR {registration.fee_amount}</p>
                          <p className="mt-2 text-sm text-[color:var(--nav)]/65">Please use the PayU gateway below to complete payment.</p>
                        </div>

                        <a
                          href={PAYMENT_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-2xl bg-[color:var(--primary)] text-white p-4 shadow-sm transition-all hover:opacity-90 flex flex-col justify-center items-center text-center group min-h-[96px]"
                        >
                          <span className="font-bold flex items-center gap-2 text-lg">
                            Pay Now
                            <ExternalLink className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
                          </span>
                          <span className="text-xs opacity-90 mt-0.5">via PayU Gateway</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="rounded-3xl border border-[color:var(--nav)]/10 bg-[linear-gradient(180deg,rgba(8,84,120,0.08),rgba(255,255,255,0.9))] p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`rounded-2xl ${theme.accentSoft} p-3 ${theme.text}`}>
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[color:var(--nav)]">Payment status</h2>
                        <p className="text-sm text-[color:var(--nav)]/65">Transaction ID is available only after approval for payment.</p>
                      </div>
                    </div>

                    {canSubmitTransaction ? (
                      <form onSubmit={submitTransaction} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-[color:var(--nav)] mb-2">Transaction ID</label>
                          <input
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="Enter payment transaction ID"
                            className="w-full rounded-xl border border-[color:var(--nav)]/15 px-4 py-3 outline-none focus:border-[color:var(--primary)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[color:var(--nav)] mb-2">Transaction Screenshot</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setTransactionScreenshot(e.target.files?.[0] || null)}
                            className="w-full rounded-xl border border-[color:var(--nav)]/15 px-4 py-3 outline-none focus:border-[color:var(--primary)] bg-white"
                          />
                          <p className="mt-2 text-xs text-[color:var(--nav)]/55">Upload the payment receipt or screenshot as an image.</p>
                        </div>
                        <button
                          type="submit"
                          disabled={submittingTransaction}
                          className="w-full rounded-xl bg-[linear-gradient(135deg,var(--primary),#8a2d73)] px-5 py-3 font-semibold text-white shadow-md hover:shadow-lg hover:translate-y-[-1px] transition-all disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2"
                        >
                          {submittingTransaction ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                          {submittingTransaction ? "Submitting..." : "Submit Transaction ID"}
                        </button>
                      </form>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[color:var(--nav)]/15 bg-white/70 p-4 text-sm text-[color:var(--nav)]/65 leading-relaxed">
                        {registration.transaction_id
                          ? registration.transaction_screenshot
                            ? `Transaction ID and screenshot already submitted: ${registration.transaction_id}`
                            : `Transaction ID already submitted: ${registration.transaction_id}`
                          : "The transaction field unlocks after the committee selects you for payment."}
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-[color:var(--nav)]/10 bg-white p-6 shadow-lg">
                    <h2 className="text-lg font-bold text-[color:var(--nav)] mb-3">Workflow</h2>
                    <ol className="space-y-3 text-sm text-[color:var(--nav)]/75">
                      <li className="flex gap-3"><span className="font-bold text-[color:var(--primary)]">1.</span> Register for your workshop without paying.</li>
                      <li className="flex gap-3"><span className="font-bold text-[color:var(--primary)]">2.</span> Wait for the committee to approve or reject your request.</li>
                      <li className="flex gap-3"><span className="font-bold text-[color:var(--primary)]">3.</span> If approved for payment, submit the transaction ID here.</li>
                      <li className="flex gap-3"><span className="font-bold text-[color:var(--primary)]">4.</span> Final acceptance or rejection is recorded by the admin team.</li>
                    </ol>
                  </div>
                </div>

                {showWorkshopDetails && agendaOpen && (
                  <div className="lg:col-span-2 rounded-3xl border border-[color:var(--nav)]/10 bg-white p-5 md:p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)] mb-2">Workshop Agenda</p>
                        <h2 className="text-2xl font-bold text-[color:var(--nav)]">Full Day Schedule</h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAgendaOpen(false)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--nav)]/10 bg-[color:var(--nav)]/5 px-4 py-2 text-sm font-semibold text-[color:var(--nav)] hover:bg-[color:var(--primary)] hover:text-white hover:border-[color:var(--primary)] transition-colors"
                      >
                        Hide Agenda <ChevronUp size={14} />
                      </button>
                    </div>
                    <AgendaTable items={agendaItems} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {registration?.status === "Rejected" && (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700 text-sm">
            This workshop registration has been rejected. You may contact the organizers if you need clarification.
          </div>
        )}
      </div>
    </div>
  )
}
