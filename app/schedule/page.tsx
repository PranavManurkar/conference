"use client"

import { useState } from "react"

// ─── Color legend data ────────────────────────────────────────────────────────
const LEGEND = [
  { label: "Plenary Talk (PT)", bg: "bg-green-200", border: "border-green-400" },
  { label: "Invited Talk (IT)", bg: "bg-[#90EE90]", border: "border-green-500" },
  { label: "Contributary Talk (CT)", bg: "bg-orange-200", border: "border-orange-400" },
  { label: "Thesis Presentation", bg: "bg-cyan-300", border: "border-cyan-500" },
  { label: "Oral Presentation", bg: "bg-[#FFDAB9]", border: "border-orange-300" },
  { label: "Poster Presentation", bg: "bg-fuchsia-400", border: "border-fuchsia-600" },
  { label: "Meals", bg: "bg-gray-300", border: "border-gray-500" },
  { label: "Tea Break", bg: "bg-yellow-300", border: "border-yellow-500" },
  { label: "Travel", bg: "bg-purple-400", border: "border-purple-600" },
]

// ─── Types ───────────────────────────────────────────────────────────────────
type CellType =
  | "header"
  | "registration"
  | "breakfast"
  | "plenary"
  | "tea"
  | "break"
  | "invited"
  | "contributary"
  | "lunch"
  | "oral"
  | "thesis"
  | "poster"
  | "dinner"
  | "travel"
  | "valedictory"
  | "inauguration"
  | "normal"

interface ScheduleRow {
  time: string
  type: CellType
  content: string
  sessions?: {
    A?: string
    B?: string
    C?: string
    D?: string
  }
  colSpan?: boolean
  highlight?: boolean
}

// ─── Schedule Data ────────────────────────────────────────────────────────────
const day0: ScheduleRow[] = [
  {
    time: "4:00 – 6:00 pm",
    type: "registration",
    content: "Registration",
    colSpan: true,
    highlight: true,
  },
]

const day1: ScheduleRow[] = [
  { time: "8:00 – 9:15 am", type: "registration", content: "Registration", colSpan: true, highlight: true },
  { time: "9:00 – 9:30 am", type: "breakfast", content: "Breakfast", colSpan: true },
  { time: "9:30 – 11:00 am", type: "inauguration", content: "Inauguration + Inaugural talk", colSpan: true },
  { time: "11:00 – 11:30 am", type: "tea", content: "High Tea", colSpan: true, highlight: true },
  { time: "11:30 – 12:10 pm", type: "plenary", content: "PT 1.", colSpan: true },
  { time: "12:10 – 12:15", type: "break", content: "Break", colSpan: true },
  {
    time: "12:15 – 12:45 am",
    type: "invited",
    content: "",
    sessions: { A: "IT1.", B: "IT2.", C: "IT3.", D: "IT4." },
  },
  {
    time: "12:45 – 01:15 pm",
    type: "invited",
    content: "",
    sessions: { A: "IT5.", B: "IT6.", C: "IT7.", D: "IT8." },
  },
  { time: "01:15 – 02:15 pm", type: "lunch", content: "Lunch", colSpan: true },
  { time: "02:15 – 02:55 pm", type: "plenary", content: "PT 2.", colSpan: true },
  { time: "02:55 – 03:00 pm", type: "break", content: "Break", colSpan: true },
  {
    time: "03:00 – 3:30 pm",
    type: "invited",
    content: "",
    sessions: { A: "IT9.", B: "IT10.", C: "IT11.", D: "IT12." },
  },
  {
    time: "3:30 – 4:00 pm",
    type: "invited",
    content: "",
    sessions: { A: "IT13.", B: "IT14.", C: "IT15.", D: "IT16." },
  },
  { time: "4:00 – 4:15 pm", type: "tea", content: "Tea break", colSpan: true, highlight: true },
  {
    time: "4:15 – 5:45 pm",
    type: "oral",
    content: "",
    sessions: { A: "Oral", B: "Oral", C: "Oral", D: "Oral" },
  },
  {
    time: "5:45 – 6:15 pm",
    type: "invited",
    content: "",
    sessions: { A: "IT17.", B: "IT18.", C: "IT19.", D: "CT 1. / CT 2." },
  },
  { time: "Till Dinner", type: "thesis", content: "Thesis Poster presentation (Stage 1)", colSpan: true },
  { time: "7:30pm onwards", type: "dinner", content: "Dinner", colSpan: true },
]

const day2: ScheduleRow[] = [
  { time: "9:00 – 9:30 am", type: "breakfast", content: "Breakfast", colSpan: true },
  { time: "9:30 – 10:10 am", type: "plenary", content: "PT 3.", colSpan: true },
  { time: "10:10 – 10:30 am", type: "invited", content: "IP1.", colSpan: true },
  { time: "10:30 – 10:50 am", type: "invited", content: "IP2.", colSpan: true },
  { time: "10:50 – 11:05 am", type: "tea", content: "Tea Break", colSpan: true, highlight: true },
  {
    time: "11:05 – 11:35 am",
    type: "invited",
    content: "",
    sessions: { A: "IT20.", B: "IT21.", C: "IT22.", D: "IT23." },
  },
  {
    time: "11:35 – 12:05 pm",
    type: "invited",
    content: "",
    sessions: { A: "IT24.", B: "IT25.", C: "IT26.", D: "IT27." },
  },
  { time: "12:05 – 1:35 pm", type: "thesis", content: "Thesis Oral presentation (Stage 2)", colSpan: true },
  { time: "1:35 – 2:30 pm", type: "lunch", content: "Lunch", colSpan: true },
  { time: "2:30 – 3:10 pm", type: "plenary", content: "PT 4.", colSpan: true },
  { time: "3:10 – 3:30 pm", type: "invited", content: "IP3.", colSpan: true },
  { time: "3:30 – 3:50 pm", type: "invited", content: "IP4.", colSpan: true },
  { time: "3:50 – 4:05 pm", type: "tea", content: "Tea break", colSpan: true, highlight: true },
  {
    time: "4:05 – 4:35 pm",
    type: "invited",
    content: "",
    sessions: { A: "IT28.", B: "IT29.", C: "IT30.", D: "IT31." },
  },
  {
    time: "4:35 – 5:05 pm",
    type: "invited",
    content: "",
    sessions: { A: "IT32.", B: "IT33.", C: "IT34.", D: "IT35." },
  },
  {
    time: "5:05 – 5:20 pm",
    type: "contributary",
    content: "",
    sessions: { A: "CT3.", B: "CT4.", C: "CT5.", D: "CT6." },
  },
  { time: "5:20 – 6:45 pm", type: "poster", content: "Poster Presentation", colSpan: true },
  { time: "6:45 – 7:45 pm", type: "travel", content: "Travel toward Gala dinner", colSpan: true },
  { time: "8:00 pm onwards", type: "dinner", content: "Gala Dinner", colSpan: true, highlight: true },
]

const day3: ScheduleRow[] = [
  { time: "9:00 – 9:30 am", type: "breakfast", content: "Breakfast", colSpan: true },
  { time: "9:30 – 10:10 am", type: "plenary", content: "PT 5.", colSpan: true },
  { time: "10:10 – 10:50 am", type: "plenary", content: "PT 6.", colSpan: true },
  { time: "10:50 – 11:05 am", type: "tea", content: "Tea Break", colSpan: true, highlight: true },
  {
    time: "11:05 – 11:35 am",
    type: "invited",
    content: "",
    sessions: { A: "IT36.", B: "IT37.", C: "IT38.", D: "IT39." },
  },
  {
    time: "11:35 – 12:05 pm",
    type: "invited",
    content: "",
    sessions: { A: "IT40.", B: "IT41.", C: "IT42.", D: "IT43." },
  },
  {
    time: "12:05 – 12:20 pm",
    type: "contributary",
    content: "",
    sessions: { A: "CT7.", B: "CT8.", C: "CT9.", D: "CT10." },
  },
  {
    time: "12:20 – 01:20 pm",
    type: "oral",
    content: "",
    sessions: { A: "Oral", B: "Oral", C: "Oral", D: "Oral" },
  },
  { time: "1:20 – 2:30 pm", type: "lunch", content: "Lunch", colSpan: true },
  { time: "2:30 – 3:40pm", type: "poster", content: "Poster Presentation", colSpan: true },
  { time: "3:45 onwards", type: "valedictory", content: "Valedictory", colSpan: true },
]

// ─── Cell Styling ────────────────────────────────────────────────────────────
function getCellStyle(type: CellType, highlight?: boolean): string {
  const base = "text-sm font-medium"
  switch (type) {
    case "registration":
      return `${base} bg-[color:var(--nav)] text-white font-bold`
    case "breakfast":
    case "lunch":
    case "dinner":
      return `${base} bg-gray-200 text-gray-800`
    case "inauguration":
      return `${base} bg-gray-100 text-gray-800`
    case "plenary":
      return `${base} bg-green-200 text-green-900`
    case "tea":
      return `${base} bg-yellow-300 text-yellow-900 font-semibold`
    case "break":
      return `${base} bg-gray-100 text-gray-500 italic`
    case "invited":
      return `${base} bg-[#90EE90] text-green-900`
    case "contributary":
      return `${base} bg-orange-200 text-orange-900`
    case "oral":
      return `${base} bg-[#FFDAB9] text-orange-900`
    case "thesis":
      return `${base} bg-cyan-200 text-cyan-900`
    case "poster":
      return `${base} bg-fuchsia-300 text-fuchsia-900 font-semibold`
    case "travel":
      return `${base} bg-purple-300 text-purple-900`
    case "valedictory":
      return `${base} bg-[color:var(--primary)]/20 text-[color:var(--nav)] font-semibold`
    default:
      return `${base} bg-white text-gray-800`
  }
}

// ─── Session Hall Headers ─────────────────────────────────────────────────────
const HALLS = [
  { key: "A", label: "A (Maitreyi)", color: "text-blue-700" },
  { key: "B", label: "B – Gargi", color: "text-[color:var(--primary)]" },
  { key: "C", label: "C – Sandipani", color: "text-green-700" },
  { key: "D", label: "D – Kalidas", color: "text-orange-700" },
]

// ─── Row Component ────────────────────────────────────────────────────────────
function ScheduleRowComponent({ row }: { row: ScheduleRow }) {
  const cellStyle = getCellStyle(row.type, row.highlight)

  if (row.colSpan || !row.sessions) {
    return (
      <tr>
        <td className="px-3 py-2 text-xs font-semibold text-[color:var(--nav)]/70 whitespace-nowrap border-b border-gray-200 bg-white min-w-[130px]">
          {row.time}
        </td>
        <td colSpan={4} className={`px-4 py-2 border-b border-gray-200 text-center ${cellStyle}`}>
          {row.content}
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td className="px-3 py-2 text-xs font-semibold text-[color:var(--nav)]/70 whitespace-nowrap border-b border-gray-200 bg-white min-w-[130px]">
        {row.time}
      </td>
      {(["A", "B", "C", "D"] as const).map((hall) => (
        <td key={hall} className={`px-3 py-2 border-b border-gray-200 text-center ${cellStyle}`}>
          {row.sessions?.[hall] ?? ""}
        </td>
      ))}
    </tr>
  )
}

// ─── Day Table ────────────────────────────────────────────────────────────────
function DayTable({ rows }: { rows: ScheduleRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[color:var(--nav)] text-white">
            <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide w-[130px]">
              Time
            </th>
            {HALLS.map((h) => (
              <th key={h.key} className="px-3 py-3 text-center font-bold text-sm">
                <span className="block text-base">{h.key}</span>
                <span className="text-xs font-normal text-white/70">
                  {h.key === "A" ? "(Maitreyi)" : h.key === "B" ? "Gargi" : h.key === "C" ? "Sandipani" : "Kalidas"}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <ScheduleRowComponent key={i} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend() {
  const items = [
    { label: "Plenary Talk (PT)", cls: "bg-green-200 border-green-400" },
    { label: "Invited Talk (IT)", cls: "bg-[#90EE90] border-green-500" },
    { label: "Contributary Talk (CT)", cls: "bg-orange-200 border-orange-400" },
    { label: "Thesis Presentation", cls: "bg-cyan-200 border-cyan-500" },
    { label: "Oral Presentation", cls: "bg-[#FFDAB9] border-orange-300" },
    { label: "Poster Presentation", cls: "bg-fuchsia-300 border-fuchsia-600" },
    { label: "Meals", cls: "bg-gray-200 border-gray-400" },
    { label: "Tea Break", cls: "bg-yellow-300 border-yellow-500" },
    { label: "Travel", cls: "bg-purple-300 border-purple-500" },
  ]
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className={`inline-block w-5 h-5 rounded border ${item.cls} flex-shrink-0`}
          />
          <span className="text-xs text-[color:var(--nav)]/80">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Day Tab Button ───────────────────────────────────────────────────────────
function DayTab({
  label,
  date,
  active,
  onClick,
}: {
  label: string
  date: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
        active
          ? "bg-[color:var(--primary)] text-white border-[color:var(--primary)] shadow-lg scale-105"
          : "bg-white text-[color:var(--nav)] border-[color:var(--nav)]/15 hover:border-[color:var(--primary)]/50 hover:bg-[color:var(--primary)]/5"
      }`}
    >
      <span className="text-sm font-bold">{label}</span>
      <span className={`text-xs mt-0.5 ${active ? "text-white/80" : "text-[color:var(--nav)]/60"}`}>{date}</span>
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState(0)

  const days = [
    { label: "Day 0", date: "23 June 2026", subtitle: "Registration", rows: day0 },
    { label: "Day 1", date: "24 June 2026", subtitle: "Inauguration & Sessions", rows: day1 },
    { label: "Day 2", date: "25 June 2026", subtitle: "Full Conference Day", rows: day2 },
    { label: "Day 3", date: "26 June 2026", subtitle: "Final Day & Valedictory", rows: day3 },
  ]

  return (
    <main className="min-h-screen bg-[color:var(--primary-foreground)]">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="bg-[color:var(--nav)] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-1 w-12 bg-[color:var(--primary)] rounded mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Conference <span className="text-[color:var(--primary)]">Schedule</span>
          </h1>
          <p className="text-white/70 text-base max-w-2xl">
            Tentative program schedule for 2D MatTechGlobal 2026 at IIT Indore · June 23–26, 2026
          </p>
          <p className="text-white/50 text-xs mt-2 italic">
            * Schedule is tentative and subject to revision
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Day Tabs ────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
          {days.map((day, i) => (
            <DayTab
              key={i}
              label={day.label}
              date={day.date}
              active={activeDay === i}
              onClick={() => setActiveDay(i)}
            />
          ))}
        </div>

        {/* ── Active Day Card ──────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-1 w-8 bg-[color:var(--primary)] rounded" />
            <h2 className="text-xl font-bold text-[color:var(--nav)]">
              {days[activeDay].label}
              <span className="text-[color:var(--primary)] ml-2">·</span>
              <span className="ml-2 font-normal text-base text-[color:var(--nav)]/70">
                {days[activeDay].date}
              </span>
            </h2>
          </div>
          <p className="text-sm text-[color:var(--nav)]/60 ml-11">{days[activeDay].subtitle}</p>
        </div>

        {/* ── Schedule Table ───────────────────────────────────────────────── */}
        <div className="mb-10">
          <DayTable rows={days[activeDay].rows} />
        </div>

        {/* ── Session Halls Info ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { hall: "Hall A", name: "Maitreyi", color: "bg-blue-600" },
            { hall: "Hall B", name: "Gargi", color: "bg-[color:var(--primary)]" },
            { hall: "Hall C", name: "Sandipani", color: "bg-green-600" },
            { hall: "Hall D", name: "Kalidas", color: "bg-orange-600" },
          ].map((h) => (
            <div
              key={h.hall}
              className="rounded-xl border border-[color:var(--nav)]/10 bg-white p-4 flex items-center gap-3 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-lg ${h.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {h.hall.replace("Hall ", "")}
              </div>
              <div>
                <p className="text-xs text-[color:var(--nav)]/50 uppercase tracking-wide">{h.hall}</p>
                <p className="font-bold text-[color:var(--nav)] text-sm">{h.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Color Legend ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[color:var(--nav)]/10 shadow-sm p-6">
          <h3 className="text-sm font-bold text-[color:var(--nav)] uppercase tracking-widest mb-4">
            Color Legend
          </h3>
          <Legend />
        </div>

        {/* ── Note ─────────────────────────────────────────────────────────── */}
        <div className="mt-6 bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/20 rounded-xl p-4 text-sm text-[color:var(--nav)]/70">
          <strong className="text-[color:var(--primary)]">Note:</strong> PT = Plenary Talk, IT = Invited Talk, CT = Contributary Talk, IP = Invited Presentation.
        </div>
      </div>
    </main>
  )
}