"use client"

import { useState, useEffect, useRef } from "react"
import {
  Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle,
  Loader2, X, ChevronDown, ChevronUp, ExternalLink, Coffee, Utensils
} from "lucide-react"

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "https://tdmtg.iiti.ac.in"

type AgendaItem = {
  time: string
  title: string
  topics?: string[]
  speaker?: string
  speakerRole?: string
  isBreak?: boolean
  highlight?: boolean
}

const agenda: AgendaItem[] = [
  {
    time: "10:30 – 11:30",
    title: "Latest Trends & Advancements in X-ray Diffraction (XRD)",
    topics: [
      "Physics behind XRD for better experimental setup",
      "Phase identification & quantification (powders, solids, thin films)",
      "In-situ & in-operando analysis",
    ],
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
    speakerRole: "Application Specialist",
    highlight: true,
  },
  {
    time: "12:30 – 01:30",
    title: "Elemental Analysis Using X-ray Fluorescence (XRF)",
    topics: [
      "Non-destructive elemental testing (powders, solids, liquids, thin films)",
      "Sample preparation: pressed pellet & fused bead",
    ],
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
    topics: [
      "XRD Sample Handling — Dr. Mangesh Mahajan: Choosing the right sample holder · Managing material fluorescence · Best practices for high-quality data",
      "XRF Sample Handling — Dr. Dhrubajyoti Gupta: Pressed pellet & fused bead methods · Dos & don'ts for optimal results",
    ],
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

function AgendaTable({ items = agenda }: { items?: AgendaItem[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[color:var(--nav)]/10 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[color:var(--nav)] text-white">
            <th className="py-3 px-4 text-left font-semibold whitespace-nowrap w-32">Time</th>
            <th className="py-3 px-4 text-left font-semibold">Session Title</th>
            <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Speaker</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            if (item.isBreak) {
              return (
                <tr key={i} className="bg-[color:var(--primary)]/5 border-y border-[color:var(--primary)]/10">
                  <td className="py-2 px-4 text-xs text-[color:var(--nav)]/60 font-medium whitespace-nowrap">{item.time}</td>
                  <td colSpan={2} className="py-2 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-[color:var(--nav)]/60 font-semibold text-xs uppercase tracking-widest">
                      {item.title.toLowerCase().includes("tea") && <Coffee size={12} />}
                      {item.title.toLowerCase().includes("lunch") && <Utensils size={12} />}
                      {item.title}
                    </span>
                  </td>
                </tr>
              )
            }
            return (
              <tr
                key={i}
                className={`border-b border-[color:var(--nav)]/5 ${item.highlight
                    ? "bg-yellow-50"
                    : i % 2 === 0
                      ? "bg-[color:var(--primary-foreground)]"
                      : "bg-[color:var(--nav)]/[0.02]"
                  }`}
              >
                <td className="py-3 px-4 text-xs font-semibold text-[color:var(--primary)] whitespace-nowrap align-top">
                  {item.time}
                </td>
                <td className="py-3 px-4 align-top">
                  <p className={`font-semibold text-[color:var(--nav)] ${item.highlight ? "text-yellow-800" : ""}`}>
                    {item.title}
                  </p>
                  {item.topics && item.topics.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {item.topics.map((t, ti) => (
                        <li key={ti} className="text-xs text-[color:var(--nav)]/70 flex items-start gap-1.5">
                          <span className="text-[color:var(--primary)] mt-0.5 flex-shrink-0">•</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="py-3 px-4 align-top">
                  {item.speaker && (
                    <div>
                      <p className={`font-semibold text-xs ${item.highlight ? "text-yellow-800" : "text-[color:var(--nav)]"}`}>
                        {item.speaker}
                      </p>
                      {item.speakerRole && (
                        <p className="text-[10px] text-[color:var(--nav)]/60 mt-0.5 leading-snug">
                          {item.speakerRole}
                        </p>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

type FormData = {
  full_name: string
  email: string
  phone: string
  institution: string
  designation: string
  participant_type: "student" | "other"
}

type RegistrationState = "idle" | "submitting" | "success" | "full" | "duplicate" | "error"

function RegistrationModal({
  open,
  onClose,
  workshopId,
  workshopTitle,
}: {
  open: boolean
  onClose: () => void
  workshopId: number
  workshopTitle: string
}) {
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: "",
    phone: "",
    institution: "",
    designation: "",
    participant_type: "student",
  })
  const [state, setState] = useState<RegistrationState>("idle")
  const [regId, setRegId] = useState<string>("")
  const submittingRef = useRef(false)

  useEffect(() => {
    if (open) {
      setState("idle")
      setFormData({ full_name: "", email: "", phone: "", institution: "", designation: "", participant_type: "student" })
      setRegId("")
      submittingRef.current = false
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Prevent double submission — critical for race condition handling
    if (submittingRef.current || state === "submitting") return
    submittingRef.current = true
    setState("submitting")

    try {
      const res = await fetch(`${DJANGO_API_URL}/api/workshop-registrations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshop_id: workshopId,
          full_name: formData.full_name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          institution: formData.institution.trim(),
          designation: formData.designation.trim(),
          participant_type: formData.participant_type,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.status === 201 || res.ok) {
        const registrationReference = data.registration_id || data.registration_reference || data.id || `WS${workshopId}-${Date.now()}`
        setRegId(registrationReference)
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "workshop_registration",
            JSON.stringify({
              registration_id: registrationReference,
              email: formData.email.trim().toLowerCase(),
              workshop_id: workshopId,
            }),
          )
        }
        setState("success")
        return
      }

      const errorCode = data?.error || data?.code || ""
      const errorMsg = (data?.message || data?.detail || "").toLowerCase()

      if (
        res.status === 409 ||
        errorCode === "workshop_full" ||
        errorMsg.includes("full") ||
        errorMsg.includes("capacity") ||
        errorMsg.includes("maximum")
      ) {
        setState("full")
      } else if (
        errorCode === "duplicate_email" ||
        errorMsg.includes("already") ||
        errorMsg.includes("duplicate") ||
        (data?.email && Array.isArray(data.email))
      ) {
        setState("duplicate")
      } else {
        setState("error")
      }
    } catch {
      setState("error")
    } finally {
      submittingRef.current = false
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[color:var(--primary-foreground)] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[color:var(--nav)]/10">
          <div>
            <h2 className="text-xl font-bold text-[color:var(--nav)]">
              <span className="text-[color:var(--primary)]">Workshop</span> Registration
            </h2>
            <p className="text-xs text-[color:var(--nav)]/60 mt-1 leading-snug pr-4">{workshopTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[color:var(--nav)]/10 transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* SUCCESS */}
          {state === "success" && (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-9 w-9 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--nav)] mb-1">Registration Confirmed!</h3>
                <p className="text-sm text-[color:var(--nav)]/70">Your spot has been reserved.</p>
                {regId && (
                  <div className="mt-3 bg-[color:var(--nav)]/5 rounded-lg px-4 py-2 inline-block">
                    <p className="text-xs text-[color:var(--nav)]/50">Registration ID</p>
                    <p className="font-mono font-bold text-[color:var(--primary)] text-sm">{regId}</p>
                  </div>
                )}
              </div>

              <div className="bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/20 rounded-xl p-5 text-left space-y-3">
                <p className="font-semibold text-[color:var(--nav)] text-sm">Next Steps</p>
                <div className="space-y-2 text-sm text-[color:var(--nav)]/80">
                  <div className="flex gap-2">
                    <span className="text-[color:var(--primary)] font-bold flex-shrink-0">1.</span>
                    <span>Your registration is under process and will be reviewed by the workshop committee.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[color:var(--primary)] font-bold flex-shrink-0">2.</span>
                    <span>If selected for payment, the dashboard will unlock the transaction ID field.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[color:var(--primary)] font-bold flex-shrink-0">3.</span>
                    <span>You will receive an email once the admin approves or rejects your application.</span>
                  </div>
                </div>
              </div>

              <a
                href="/workshop/dashboard"
                className="inline-flex items-center gap-2 w-full justify-center bg-[color:var(--primary)] text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
              >
                Open Workshop Dashboard <ExternalLink size={16} />
              </a>
              <button
                onClick={onClose}
                className="text-sm text-[color:var(--nav)]/50 hover:text-[color:var(--nav)] transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* WORKSHOP FULL */}
          {state === "full" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-9 w-9 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-[color:var(--nav)]">Workshop is Full</h3>
              <p className="text-sm text-[color:var(--nav)]/70">
                We've reached maximum capacity for this workshop. Please contact the organizers to be added to the waitlist.
              </p>
              <a
                href="mailto:2dmtg@iiti.ac.in"
                className="inline-block text-[color:var(--primary)] font-semibold text-sm hover:underline"
              >
                2dmtg@iiti.ac.in
              </a>
              <button
                onClick={onClose}
                className="block w-full mt-2 text-sm text-[color:var(--nav)]/50 hover:text-[color:var(--nav)] transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* DUPLICATE */}
          {state === "duplicate" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-9 w-9 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-[color:var(--nav)]">Already Registered</h3>
              <p className="text-sm text-[color:var(--nav)]/70">
                This email is already registered for this workshop. Check your inbox for your confirmation details, or contact us if you need assistance.
              </p>
              <button onClick={() => setState("idle")} className="text-sm text-[color:var(--primary)] font-semibold hover:underline">
                Try a different email
              </button>
            </div>
          )}

          {/* ERROR */}
          {state === "error" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-9 w-9 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-[color:var(--nav)]">Something went wrong</h3>
              <p className="text-sm text-[color:var(--nav)]/70">
                We couldn't process your registration. Please try again or contact us directly at 2dmtg@iiti.ac.in.
              </p>
              <button
                onClick={() => { setState("idle"); submittingRef.current = false }}
                className="bg-[color:var(--primary)] text-white font-semibold py-2 px-6 rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          )}

          {/* FORM */}
          {(state === "idle" || state === "submitting") && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[color:var(--primary)]/5 border-l-4 border-[color:var(--primary)] rounded-r-lg p-3 text-sm text-[color:var(--nav)]/80">
                <strong className="text-[color:var(--primary)]">Register First, Pay Later</strong> — Submit your details to secure a spot, then complete payment via PayU to confirm.
              </div>

              {[
                { id: "full_name", label: "Full Name", type: "text", placeholder: "Dr. Jane Smith", required: true },
                { id: "email", label: "Email Address", type: "email", placeholder: "jane@university.edu", required: true },
                { id: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true },
                { id: "institution", label: "Institution / Organization", type: "text", placeholder: "IIT Indore", required: true },
                { id: "designation", label: "Designation", type: "text", placeholder: "Research Scholar", required: false },
              ].map(({ id, label, type, placeholder, required }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-semibold text-[color:var(--nav)] mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id={id}
                    type={type}
                    required={required}
                    disabled={state === "submitting"}
                    value={formData[id as keyof FormData]}
                    onChange={(e) => setFormData((p) => ({ ...p, [id]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 border border-[color:var(--nav)]/20 rounded-lg focus:ring-2 focus:ring-[color:var(--primary)]/30 focus:border-[color:var(--primary)] outline-none text-sm transition-colors disabled:opacity-50 bg-white"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-[color:var(--nav)] mb-1.5">
                  Participant Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: "student", title: "Student", note: "INR 1000" },
                    { value: "other", title: "Others", note: "INR 2000" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition-colors ${
                        formData.participant_type === option.value
                          ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5"
                          : "border-[color:var(--nav)]/15 bg-white hover:border-[color:var(--primary)]/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="participant_type"
                        value={option.value}
                        checked={formData.participant_type === option.value}
                        onChange={() => setFormData((p) => ({ ...p, participant_type: option.value as FormData["participant_type"] }))}
                        className="sr-only"
                      />
                      <span className="block font-semibold text-[color:var(--nav)]">{option.title}</span>
                      <span className="block text-xs text-[color:var(--nav)]/60 mt-0.5">{option.note}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-full bg-[color:var(--primary)] text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {state === "submitting" ? (
                  <><Loader2 size={18} className="animate-spin" /> Registering…</>
                ) : (
                  "Register for Workshop"
                )}
              </button>

              <p className="text-[10px] text-center text-[color:var(--nav)]/40 leading-relaxed">
                Submitting this form places you under review. Only selected participants will be asked to submit payment.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

type WorkshopCard = {
  id: number
  title: string
  tagline?: string
  date: string
  time?: string
  venue?: string
  partners?: string
  status: "open" | "coming_soon" | "closed"
  description: string
  hasAgenda?: boolean
}

const workshops: WorkshopCard[] = [
  {
    id: 1,
    title: "X-ray Diffraction (XRD) & X-ray Fluorescence (XRF)",
    tagline: "Advanced Characterization Techniques",
    date: "June 23, 2026",
    time: "10:30 AM – 05:30 PM",
    venue: "IIT Indore",
    partners: "Malvern Panalytical",
    status: "open",
    description:
      "A full-day pre-conference workshop on XRD & XRF fundamentals, particle characterization, sample preparation best practices, and a live Empyrean XRD & Zetasizer demonstration.",
    hasAgenda: true,
  },
  {
    id: 2,
    title: "Synchrotron-Based Techniques for Materials Characterization",
    tagline: "Synchrotron Methods & Beamline Demonstration",
    date: "June 23, 2026",
    time: "09:30 AM – 06:00 PM",
    venue: "Morning: IIT Indore · Afternoon: RRCAT (Indus-2)",
    partners: "RRCAT / IIT Indore",
    status: "open",
    description:
      "Morning lectures on XRD, XANES/EXAFS and XPS at IIT Indore, followed by travel to RRCAT (Indus-2) for hands-on beamline demonstrations and discussions.",
    hasAgenda: true,
  },
]

export default function WorkshopPage() {
  const [agendaOpen, setAgendaOpen] = useState(false)
  const [agenda2Open, setAgenda2Open] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopCard | null>(null)

  return (
    <div className="min-h-screen bg-[color:var(--primary-foreground)]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <div className="h-1 w-12 bg-[color:var(--primary)] rounded mb-4" />
          <h1 className="text-4xl font-bold text-[color:var(--nav)] mb-3">
            Pre-Conference <span className="text-[color:var(--primary)]">Workshops</span>
          </h1>
          <p className="text-[color:var(--nav)]/70 text-lg max-w-2xl">
            Hands-on workshops on June 23, 2026 — the day before the main conference. Seats are limited; register early to secure your spot.
          </p>
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="flex items-center gap-2 text-sm text-[color:var(--nav)]/70">
              <Calendar size={16} className="text-[color:var(--primary)]" />
              June 23, 2026
            </div>
            <div className="flex items-center gap-2 text-sm text-[color:var(--nav)]/70">
              <MapPin size={16} className="text-[color:var(--primary)]" />
              IIT Indore Campus
            </div>
            <div className="flex items-center gap-2 text-sm text-[color:var(--nav)]/70">
              <Users size={16} className="text-[color:var(--primary)]" />
              Limited seats per workshop
            </div>
            <a
              href="/workshop/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-[color:var(--primary)] hover:bg-[color:var(--primary)] hover:text-white transition-colors shadow-sm"
            >
              Already registered? Open dashboard
            </a>
          </div>
          <div className="mt-4 inline-flex items-center rounded-full bg-[color:var(--primary)]/5 px-4 py-2 text-sm text-[color:var(--nav)]/70">
            Each participant may register for only one workshop.
          </div>
        </div>

        {/* Workshop Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {workshops.map((ws) => (
            <div
              key={ws.id}
              className="bg-[color:var(--primary-foreground)] border border-[color:var(--nav)]/10 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden"
            >
              {/* Card top accent */}
              <div className={`h-1.5 w-full ${ws.status === "open" ? "bg-[color:var(--primary)]" : "bg-[color:var(--nav)]/20"}`} />

              <div className="p-6 flex flex-col flex-1">
                {/* Status badge */}
                <div className="mb-4">
                  {ws.status === "open" && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Registration Open
                    </span>
                  )}
                  {ws.status === "coming_soon" && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[color:var(--nav)]/10 text-[color:var(--nav)]/50 px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  {ws.status === "closed" && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-100 text-red-600 px-3 py-1 rounded-full">
                      Registration Closed
                    </span>
                  )}
                </div>

                {ws.tagline && (
                  <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--primary)] mb-2">
                    {ws.tagline}
                  </p>
                )}
                <h2 className="text-lg font-bold text-[color:var(--nav)] mb-3 leading-snug">
                  {ws.title}
                </h2>
                <p className="text-sm text-[color:var(--nav)]/70 mb-4 leading-relaxed flex-1">
                  {ws.description}
                </p>

                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex items-center gap-2 text-[color:var(--nav)]/70">
                    <Calendar size={14} className="text-[color:var(--primary)] flex-shrink-0" />
                    {ws.date}
                  </div>
                  {ws.time && (
                    <div className="flex items-center gap-2 text-[color:var(--nav)]/70">
                      <Clock size={14} className="text-[color:var(--primary)] flex-shrink-0" />
                      {ws.time}
                    </div>
                  )}
                  {ws.venue && (
                    <div className="flex items-center gap-2 text-[color:var(--nav)]/70">
                      <MapPin size={14} className="text-[color:var(--primary)] flex-shrink-0" />
                      {ws.venue}
                    </div>
                  )}
                  {ws.partners && (
                    <div className="flex items-start gap-2 text-[color:var(--nav)]/70">
                      <span className="text-[color:var(--primary)] flex-shrink-0 mt-0.5 text-xs font-bold">🤝</span>
                      <span className="text-xs">Powered by {ws.partners}</span>
                    </div>
                  )}
                </div>

                {ws.status === "open" && (
                  <button
                    onClick={() => { setSelectedWorkshop(ws); setModalOpen(true) }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[linear-gradient(135deg,var(--primary),#8a2d73)] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:translate-y-[-1px] transition-all text-sm"
                  >
                    Register Now
                  </button>
                )}
                {ws.status === "coming_soon" && (
                  <button disabled className="w-full bg-[color:var(--nav)]/8 text-[color:var(--nav)]/45 font-semibold py-3 px-4 rounded-xl text-sm cursor-not-allowed border border-[color:var(--nav)]/10">
                    Details Coming Soon
                  </button>
                )}
                {ws.status === "closed" && (
                  <button disabled className="w-full bg-red-50 text-red-500 font-semibold py-3 px-4 rounded-xl text-sm cursor-not-allowed border border-red-100">
                    Registration Closed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Workshop 1 Full Details */}
        <div className="bg-[color:var(--primary-foreground)] border border-[color:var(--nav)]/10 rounded-2xl shadow-md overflow-hidden mb-10">
          <div className="bg-[color:var(--nav)] px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[color:var(--primary)] text-xs font-semibold uppercase tracking-widest mb-1">
                  IIT Indore — Workshop Agenda — 23rd June (Pre Event)
                </p>
                <h2 className="text-white text-xl font-bold">
                  Workshop 1: XRD & XRF Characterization
                </h2>
              </div>
              <button
                onClick={() => setAgendaOpen((p) => !p)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                {agendaOpen ? <><ChevronUp size={16} /> Hide Agenda</> : <><ChevronDown size={16} /> View Full Agenda</>}
              </button>
            </div>
          </div>

          {agendaOpen && (
            <div className="p-6">
              <AgendaTable />
            </div>
          )}

          {!agendaOpen && (
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {[
                  { label: "Speakers", value: "4 Industry Experts" },
                  { label: "Duration", value: "Full Day (7 hrs)" },
                  { label: "Date", value: "June 23, 2026" },
                  { label: "Partners", value: "Malvern Panalytical" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-[color:var(--nav)]/50 text-xs uppercase tracking-wide">{item.label}</p>
                    <p className="font-semibold text-[color:var(--nav)] mt-0.5 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Workshop 2 Full Details */}
        <div className="bg-[color:var(--primary-foreground)] border border-[color:var(--nav)]/10 rounded-2xl shadow-md overflow-hidden mb-10">
          <div className="bg-[color:var(--nav)] px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[color:var(--primary)] text-xs font-semibold uppercase tracking-widest mb-1">
                  IIT Indore / RRCAT — Workshop Agenda — 23rd June (Pre Event)
                </p>
                <h2 className="text-white text-xl font-bold">
                  Workshop 2: Synchrotron-Based Techniques for Materials Characterization
                </h2>
              </div>
              <button
                onClick={() => setAgenda2Open((p) => !p)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                {agenda2Open ? <><ChevronUp size={16} /> Hide Agenda</> : <><ChevronDown size={16} /> View Full Agenda</>}
              </button>
            </div>
          </div>

          {agenda2Open && (
            <div className="p-6">
              <AgendaTable items={agenda2} />
            </div>
          )}

          {!agenda2Open && (
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {[
                  { label: "Speakers", value: "3 Leading Experts" },
                  { label: "Duration", value: "Full Day (8.5 hrs incl. travel)" },
                  { label: "Date", value: "June 23, 2026" },
                  { label: "Partners", value: "RRCAT, IIT Indore" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-[color:var(--nav)]/50 text-xs uppercase tracking-wide">{item.label}</p>
                    <p className="font-semibold text-[color:var(--nav)] mt-0.5 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/15 rounded-xl p-5 text-sm text-[color:var(--nav)]/80">
          <p className="font-semibold text-[color:var(--nav)] mb-2">Important Note</p>
          <ul className="space-y-1.5 list-none">
            {[
              "Only one workshop can be selected per participant.",
              "Workshop registration is separate from the main conference registration.",
              "Seats are limited and allotted on a first-come, first-served basis",
              "Register first to secure seat allotment",
              "Complete payment after allotment to confirm participation",
              "Registration is confirmed only after payment",
              "For queries, contact: 2dmtg@iiti.ac.in",
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[color:var(--primary)] mt-0.5 flex-shrink-0">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Registration Modal */}
      {modalOpen && selectedWorkshop && (
        <RegistrationModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedWorkshop(null) }}
          workshopId={selectedWorkshop.id}
          workshopTitle={selectedWorkshop.title}
        />
      )}
    </div>
  )
}