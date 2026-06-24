"use client"

import { useState } from "react"
import { Download } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────
type CellType =
  | "header"
  | "chairperson"
  | "registration"
  | "breakfast"
  | "plenary"
  | "tea"
  | "break"
  | "invited"
  | "contributary"
  | "industry"
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
    time: "04:00 – 06:00 pm",
    type: "registration",
    content: "Registration",
    colSpan: true,
    highlight: true,
  },
]

const day1: ScheduleRow[] = [
  { time: "08:00 – 09:15 am", type: "registration", content: "Registration", colSpan: true, highlight: true },
  { time: "09:00 – 09:30 am", type: "breakfast", content: "Breakfast", colSpan: true },
  { time: "09:30 – 11:00 am", type: "inauguration", content: "Inauguration + Inaugural talk (Nalanda Auditorium)", colSpan: true },
  { time: "11:00 – 11:30 am", type: "tea", content: "High Tea", colSpan: true, highlight: true },
  { time: "Chairperson", type: "chairperson", content: "", sessions:{A: "Prof. A. K Raychaudhuri"} },
  { time: "11:30 – 12:10 pm", type: "plenary", content: "", sessions:{A: "2DPL01 Prof. S. B. Ogale"} },
  { time: "12:10 – 12:15 pm", type: "break", content: "Break", colSpan: true },
  {
    time: "Chairpersons",
    type: "chairperson",
    content: "",
    sessions: {
      A: "Prof. A. K Raychaudhuri\nProf. Rajesh Kumar",
      B: "Prof. Priya Mahadevan\nDr. Venkata Vamsi Koruprolu",
      C: "Prof. Somnath C. Roy\nDr. Archana Lakhani",
      D: "Dr. Rajeev Rawat\nProf. Pankaj Koinkar",
    },
  },
  {
    time: "12:15 – 12:45 pm",
    type: "invited",
    content: "",
    sessions: {
      A: "2DIT01 Prof. Sandip Ghosh",
      B: "2DIT02 Dr. Rajamani Raghunathan",
      C: "2DIT03 Prof. Soon Hyung Kang",
      D: "2DIT04 Prof. Sumeet Walia",
    },
  },
  {
    time: "12:45 – 01:15 pm",
    type: "invited",
    content: "",
    sessions: {
      A: "2DIT05 Prof. Gopinadhan Kalon",
      B: "2DIT06 Prof. Pavan Nukala",
      C: "2DIT07 Dr. Sandip Patil",
      D: "2DIT08 Dr. Vikas Thakare",
    },
  },
  { time: "01:15 – 02:15 pm", type: "lunch", content: "Lunch", colSpan: true },
  { time: "Chairperson", type: "chairperson", content: "Prof. Sandip Ghosh", colSpan: true },
  { time: "02:15 – 02:55 pm", type: "plenary", content: "2DPL02 Prof. J. H. Kim", colSpan: true },
  { time: "02:55 – 03:00 pm", type: "break", content: "Break", colSpan: true },
  {
    time: "Chairpersons",
    type: "chairperson",
    content: "",
    sessions: {
      A: "Prof. Sandip Ghosh\nDr. Srinibas Satapathy",
      B: "Prof. Pavan Nukala\nProf. Biswarup Pathak",
      C: "Dr. Anjana Dogra\nDr. Mukul Gupta",
      D: "Dr. Vikas Thakare\nProf. Prashant Kodgire",
    },
  },
  {
    time: "03:00 – 03:30 pm",
    type: "invited",
    content: "",
    sessions: {
      A: "2DIT09 Prof. Chandra S. Sharma",
      B: "2DIT10 Prof. Priya Mahadevan",
      C: "2DIT11 Prof. Somnath C. Roy",
      D: "2DIT12 Dr. Dhiraj Bhatia",
    },
  },
  {
    time: "03:30 – 04:00 pm",
    type: "invited",
    content: "",
    sessions: {
      A: "2DIT13 Dr. Varun Natu",
      B: "2DIT14 Prof. Samaresh Das",
      C: "2DIT15 Prof. Ashish Mishra",
      D: "2DIT16 Dr. Nanasaheb. D. Thorat",
    },
  },
  { time: "04:00 – 04:15 pm", type: "tea", content: "Tea break", colSpan: true, highlight: true },
  {
    time: "Chairpersons",
    type: "chairperson",
    content: "",
    sessions: {
      A: "Prof. Gopinadhan Kalon\nProf. Ashish Mishra",
      B: "Dr. Himal Bhatt\nDr. J. P. Yadav",
      C: "Prof. Soon Hyung Kang\nDr. Vidyadhar Singh",
      D: "Prof. Sumeet Walia\nDr. Rohini Kitture",
    },
  },
  {
    time: "04:15 – 05:45 pm",
    type: "oral",
    content: "",
    sessions: {
      A: "2DOA01, 2DOA02, 2DOA03,\n2DOA04, 2DOA05, 2DOA06,\n2DOA07, 2DOA08, 2DOA09",
      B: "2DOB01, 2DOB02, 2DOB03,\n2DOB04, 2DOB05, 2DOB06,\n2DOB07, 2DOA13, 2DOC16",
      C: "2DOC13, 2DOC01, 2DOC02,\n2DOC03, 2DOC04, 2DOC05,\n2DOC06, 2DOC07, 2DOC14",
      D: "2DOD01, 2DOD02, 2DOD03,\n2DOD04, 2DOD05, 2DOD06,\n2DOD07, 2DOD08, 2DOD09",
    },
  },
  {
    // FIX: PDF shows A=IT17, B=IT18, C=IT19, D=CT01+CT02
    // Previous code wrongly merged IT18+IT19 into B and left C empty
    time: "05:45 – 06:15 pm",
    type: "invited",
    content: "",
    sessions: {
      A: "2DIT17 Prof. Babak Anasori",
      B: "2DIT18 Prof. Anirudha V. Sumant",
      C: "2DIT19 Prof. Vilas Pol",
      D: "2DCT01 Dr. Sarika Verma\n2DCT02 Dr. Tanmoy Paul",
    },
  },
  {
    time: "Till Dinner",
    type: "thesis",
    content: "Examiners: (Prof. S. B. Ogale / Prof. A. K Raychaudhuri / Prof. J. H. Kim / Prof. Yuan-Ron Ma / Prof. K. Pillai Vijayamohanan / Dr. Sunil Kumar)\n\nThesis Poster Presentation: 2DTH01 to 2DTH17",
    colSpan: true,
  },
  { time: "07:30 pm onwards", type: "dinner", content: "Dinner", colSpan: true },
]

const day2: ScheduleRow[] = [
  { time: "09:00 – 09:30 am", type: "breakfast", content: "Breakfast", colSpan: true },
  { time: "Chairperson", type: "chairperson", content: "Prof. K. Pillai Vijayamohanan", colSpan: true },
  { time: "09:30 – 10:10 am", type: "plenary", content: "2DPL03 Prof. Bikramjit Basu", colSpan: true },
  { time: "10:10 – 10:30 am", type: "industry", content: "2DIL01 Kevin Yang (AdNaNo-Tek, Taiwan, Industry Talk)", colSpan: true },
  { time: "10:30 – 10:50 am", type: "industry", content: "2DIL02 Dr. B. Karthik (Thermo Scientific, Industry Talk)", colSpan: true },
  { time: "10:50 – 11:05 am", type: "tea", content: "Tea Break", colSpan: true, highlight: true },
  {
    // FIX: PDF order is A=Dr. Manav Saxena/Dr. Umesh A. Kshirsagar,
    // B=Prof. Devendra Deshmukh/Dr. Dilip Gupta,
    // C=Dr. Tarun Sharma/Prof. Parasharam M. Shirage,
    // D=Prof. Pavan Kankar/Dr. S. D. Koushik
    // Previous code had A and D swapped
    time: "Chairpersons",
    type: "chairperson",
    content: "",
    sessions: {
      A: "Dr. Manav Saxena\nDr. Umesh A. Kshirsagar",
      B: "Prof. Devendra Deshmukh\nDr. Dilip Gupta",
      C: "Dr. Tarun Sharma\nProf. Parasharam M. Shirage",
      D: "Prof. Pavan Kankar\nDr. S. D. Koushik",
    },
  },
  {
    time: "11:05 – 11:35 am",
    type: "invited",
    content: "",
    sessions: {
      A: "2DIT20 Dr. Sanjoy Mahatha",
      B: "2DIT21 Dr. Anjana Dogra",
      C: "2DIT22 Prof. Rajendra Dhaka",
      D: "2DIT23 Prof. Pratap Sahoo",
    },
  },
  {
    time: "11:35 – 12:05 pm",
    type: "invited",
    content: "",
    sessions: {
      A: "2DIT24 Dr. Tanushree Choudhury",
      B: "2DIT25 Prof. B. Ranjit K. Nanda",
      C: "2DIT26 Dr. N. Sriram Gopal",
      D: "2DIT27 Prof. Saket Asthana",
    },
  },
  {
    time: "12:05 – 01:35 pm",
    type: "thesis",
    content: "Examiners: (Prof. S. B. Ogale / Prof. A. K Raychaudhuri / Prof. J. H. Kim / Prof. Yuan-Ron Ma / Prof. K. Pillai Vijayamohanan / Dr. Sunil Kumar)\n\nThesis Oral presentation: 2DTH01 to 2DTH17",
    colSpan: true,
  },
  { time: "01:35 – 02:30 pm", type: "lunch", content: "Lunch", colSpan: true },
  { time: "Chairperson", type: "chairperson", content: "Prof. Yuan-Ron Ma", colSpan: true },
  { time: "02:30 – 03:10 pm", type: "plenary", content: "2DPL04 Prof. K. Pillai Vijayamohanan", colSpan: true },
  { time: "03:10 – 03:30 pm", type: "industry", content: "2DIL03 Dr. Mangesh Mahajan (sponsored talk by industry)", colSpan: true },
  { time: "03:30 – 03:50 pm", type: "industry", content: "2DIL04 Dr. Rohini Kitture (Sponsored talk by Wiley)", colSpan: true },
  { time: "03:50 – 04:05 pm", type: "tea", content: "Tea break", colSpan: true, highlight: true },
  {
    // FIX: PDF order is A=Prof. Saket Asthana/Dr. Abhinav Raghuvanshi,
    // B=Prof. B. Ranjit K. Nanda/Prof. Krushna Mavani,
    // C=Prof. Rajendra Dhaka/Prof. M. H. Modi,
    // D=Prof. Pratap Sahoo/Prof. Preeti Bhobe
    // Previous code had all four scrambled
    time: "Chairpersons",
    type: "chairperson",
    content: "",
    sessions: {
      A: "Prof. Saket Asthana\nDr. Abhinav Raghuvanshi",
      B: "Prof. B. Ranjit K. Nanda\nProf. Krushna Mavani",
      C: "Prof. Rajendra Dhaka\nProf. M. H. Modi",
      D: "Prof. Pratap Sahoo\nProf. Preeti Bhobe",
    },
  },
  {
    time: "04:05 – 04:35 pm",
    type: "invited",
    content: "",
    sessions: {
      A: "2DIT28 Prof. Dhanvir S. Rana",
      B: "2DIT29 Dr. C. Kamal",
      C: "2DIT30 Dr. Ashutosh K Singh",
      D: "2DIT31 Dr. Sanjay K Rai",
    },
  },
  {
    time: "04:35 – 05:05 pm",
    type: "invited",
    content: "",
    sessions: {
      A: "2DIT32 Dr. Himal Bhatt",
      B: "2DIT33 Prof. Biswarup Pathak",
      C: "2DIT34 Dr. Nishad Deshpande",
      D: "2DIT35 Dr. S. D. Koushik",
    },
  },
  {
    time: "05:05 – 05:20 pm",
    type: "contributary",
    content: "",
    sessions: {
      A: "2DCT03 Dr. Vidyadhar Singh",
      B: "2DCT04 Dr. Manoj K. Gupta",
      C: "2DCT05 Dr. J. P. Yadav",
      D: "2DCT06 Dr. Harishchandra Singh",
    },
  },
  { time: "05:20 – 06:45 pm", type: "poster", content: "Poster Presentation: 2DPA01 to 2DPA15, 2DPB01 to 2DPB08, 2DPC01 to 2DPC22, 2DPD01 to 2DPD14", colSpan: true },
  { time: "06:45 – 07:45 pm", type: "travel", content: "Travel toward Gala dinner", colSpan: true },
  { time: "08:00 pm onwards", type: "dinner", content: "Gala Dinner", colSpan: true, highlight: true },
]

const day3: ScheduleRow[] = [
  { time: "09:00 – 09:30 am", type: "breakfast", content: "Breakfast", colSpan: true },
  {
    time: "Chairpersons",
    type: "chairperson",
    content: "",
    sessions: {
      A: "Dr. S. Majumdar\nProf. I. A. Palani",
      B: "Prof. Dhirendra Kumar Rai\nDr. C. Kamal",
      C: "Dr. Rajib Batabyal\nDr. Himanshu Srivastava",
      D: "Dr. Ravindra Makde\nDr. Dinesh Shukla",
    },
  },
  {
    time: "09:30 – 10:00 am",
    type: "invited",
    content: "",
    sessions: {
      A: "2DIT36 Prof. Suman K. Pal",
      B: "2DIT37 Prof. Surajit Saha",
      C: "2DIT38 Prof. Toshihiro Moriga",
      D: "2DIT39 Prof. Abha Misra",
    },
  },
  {
    time: "10:00 – 10:30 am",
    type: "invited",
    content: "",
    sessions: {
      A: "2DIT40 Prof. Rajendra Dhayal",
      B: "2DIT41 Prof. Rajesh Kumar",
      C: "2DIT42 Prof. Pankaj Koinkar",
      D: "2DIT43 Dr. K. D. M. Rao",
    },
  },
  {
    time: "Chairpersons",
    type: "chairperson",
    content: "",
    sessions: {
      A: "Prof. Suman K. Pal\nDr. Nishad Deshpande",
      B: "Dr. Ashutosh K Singh\nDr. Manoj Kumar Gupta",
      C: "Prof. J. H. Kim\nProf. Rajendra Dhayal",
      D: "Dr. K. D. M. Rao\nDr. Harishchandra Singh",
    },
  },
  {
    time: "10:35 – 10:50 am",
    type: "contributary",
    content: "",
    sessions: {
      A: "2DCT07 Dr. Anupma Thakur",
      B: "2DCT08 Dr. Kingshuk Roy",
      C: "2DCT09 Dr. Manav Saxena",
      D: "2DCT10 Dr. Varun Harbola",
    },
  },
  {
    time: "10:50 – 11:50 am",
    type: "oral",
    content: "",
    sessions: {
      A: "2DOA10, 2DOA11, 2DOA12,\n2DOA14, 2DOA15, 2DOA16",
      B: "2DOC15, 2DOC18, 2DOC19,\n2DOA17, 2DOA18, 2DOD16",
      C: "2DOC08, 2DOC09, 2DOC10,\n2DOC11, 2DOC12, 2DOC17",
      D: "2DOD10, 2DOD11, 2DOD12,\n2DOD13, 2DOD14, 2DOD15",
    },
  },
  { time: "11:50 – 12:05 pm", type: "tea", content: "Tea Break", colSpan: true, highlight: true },
  { time: "Chairperson", type: "chairperson", content: "Dr. Mangesh Borage", colSpan: true },
  { time: "12:05 – 12:45 pm", type: "plenary", content: "2DPL05 Prof. Yuan-Ron Ma", colSpan: true },
  { time: "12:45 – 01:25 pm", type: "plenary", content: "2DPL06 Prof. Umesh V. Waghmare", colSpan: true },
  { time: "01:25 – 02:30 pm", type: "lunch", content: "Lunch", colSpan: true },
  { time: "02:00 – 03:30 pm", type: "poster", content: "Poster Presentation: 2DPA16 to 2DPA31, 2DPB09 to 2DPB16, 2DPC23 to 2DPC43, 2DPD15 to 2DPD28", colSpan: true },
  { time: "03:45 pm onwards", type: "valedictory", content: "Valedictory Function", colSpan: true },
]

// ─── Cell Styling ────────────────────────────────────────────────────────────
function getCellStyle(type: CellType, highlight?: boolean): string {
  const base = "text-sm font-medium whitespace-pre-wrap leading-relaxed"
  switch (type) {
    case "chairperson":
      return `${base} bg-blue-50 text-blue-900 italic text-xs`
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
    case "industry":
      return `${base} bg-blue-200 text-blue-900 font-semibold`
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
        <td className="px-3 py-2 text-xs font-semibold text-[color:var(--nav)]/70 whitespace-nowrap border-b border-gray-200 bg-white min-w-[130px] align-top">
          {row.time}
        </td>
        <td colSpan={4} className={`px-4 py-3 border-b border-gray-200 text-center align-middle ${cellStyle}`}>
          {row.content}
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td className="px-3 py-2 text-xs font-semibold text-[color:var(--nav)]/70 whitespace-nowrap border-b border-gray-200 bg-white min-w-[130px] align-top">
        {row.time}
      </td>
      {(["A", "B", "C", "D"] as const).map((hall) => (
        <td key={hall} className={`px-3 py-3 border-b border-gray-200 text-center align-middle ${cellStyle}`}>
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
    { label: "Industry Talk / Sponsored (IL)", cls: "bg-blue-200 border-blue-400" },
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
      <div className="bg-[color:var(--nav)] text-white py-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
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

          <a
            href="/Final_Schedule_2DMTG.pdf"
            download
            className="flex items-center gap-2 bg-[color:var(--primary)] hover:opacity-90 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </a>
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
          <strong className="text-[color:var(--primary)]">Note:</strong> PT = Plenary Talk, IT = Invited Talk, CT = Contributary Talk, IL = Industry/Sponsored Talk.
        </div>
      </div>
    </main>
  )
}