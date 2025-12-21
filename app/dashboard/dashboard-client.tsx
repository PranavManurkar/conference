


// "use client"

// import React, { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { logout, type User, getAccessToken, refreshAccessToken } from "@/lib/auth"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { LogOut, CheckCircle, Clock, XCircle, AlertCircle, PartyPopper, Loader2, Trash2 } from "lucide-react"

// const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000"

// type Registration = {
//   id: string
//   full_name: string
//   email: string
//   phone: string
//   institution_organization: string
//   designation: string
//   country: string
//   delegate_type: string
//   registration_period: string
//   participant_region: string
//   payment_amount: number
//   transaction_id: string | null
//   payment_date: string | null
//   // removed abstract/presentation fields per request
//   status: string
//   admin_notes: string | null
//   created_at: string
// }

// async function authFetch(input: RequestInfo, init?: RequestInit) {
//   const token = getAccessToken()
//   const headers = new Headers(init?.headers || {})
//   if (!headers.get("Content-Type")) headers.set("Content-Type", "application/json")
//   if (token) headers.set("Authorization", `Bearer ${token}`)

//   const res = await fetch(input, { ...init, headers })

//   if (res.status === 401) {
//     const newAccess = await refreshAccessToken()
//     if (newAccess) {
//       const retryHeaders = new Headers(init?.headers || {})
//       if (!retryHeaders.get("Content-Type")) retryHeaders.set("Content-Type", "application/json")
//       retryHeaders.set("Authorization", `Bearer ${newAccess}`)
//       return fetch(input, { ...init, headers: retryHeaders })
//     }
//   }

//   return res
// }

// export default function DashboardClient({ user }: { user: User }) {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)
//   const [isFetchingStatus, setIsFetchingStatus] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)
//   const [existingRegistration, setExistingRegistration] = useState<Registration | null>(null)

//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: user.email || "",
//     phone: "",
//     institution_organization: "",
//     designation: "",
//     country: "",
//     delegate_type: "",
//     registration_period: "",
//     participant_region: "",
//     transaction_id: "",
//     payment_date: "",
//   })
//   useEffect(() => {
//     const fetchRegistrationStatus = async () => {
//       // 1. DEBUG: Log the user object to see if email exists
//       console.log("DEBUG: User Object received:", user);
      
//       // If user is missing or email is missing, we log it but DON'T return yet 
//       // just to test if the fetch works.
//       const userEmail = user?.email || ""; 
      
//       if (!userEmail) {
//          console.error("CRITICAL: User email is missing. Check your auth logic.");
//          // We will try to fetch anyway using the 'list' endpoint which relies on Token, not email param
//       }

//       try {
//         console.log("DEBUG: Attempting to fetch list from:", `${DJANGO_API_URL}/api/registrations/`);
        
//         // Try listing registrations (This relies on the Token in headers, not the email variable)
//         const listRes = await authFetch(`${DJANGO_API_URL}/api/registrations/`, { method: "GET" });
        
//         console.log("DEBUG: List Fetch Status:", listRes.status);

//         if (listRes.ok) {
//           const listData = await listRes.json();
//           console.log("DEBUG: List Data received:", listData);
          
//           const reg = Array.isArray(listData) ? listData[0] ?? null : listData;
//           if (reg) {
//             setExistingRegistration(reg);
//             // ... (your setFormData logic here) ...
//             setIsFetchingStatus(false);
//             return;
//           }
//         }

//         // Fallback: check-by-email (Only run this if we actually have an email)
//         if (userEmail) {
//             console.log("DEBUG: Attempting check-by-email for:", userEmail);
//             const response = await authFetch(`${DJANGO_API_URL}/api/registrations/check-by-email/?email=${encodeURIComponent(userEmail)}`);
            
//             if (response.ok) {
//               const data = await response.json();
//               setExistingRegistration(data);
//               // ... (your setFormData logic here) ...
//             } else if (response.status === 404) {
//               console.log("DEBUG: No registration found (404)");
//               setExistingRegistration(null);
//             }
//         } else {
//              console.warn("Skipping check-by-email because email is empty");
//         }

//       } catch (err) {
//         console.error("DEBUG: Fetch FAILED with error:", err);
//         setError("Unable to connect to server.");
//       } finally {
//         setIsFetchingStatus(false);
//       }
//     }

//     fetchRegistrationStatus();
//   }, [user]); // Change dependency to just [user] to be safe

//   const calculatePaymentAmount = () => {
//     const fees: Record<string, Record<string, Record<string, number>>> = {
//       "UG/PG Student": {
//         "Early Bird": { Indian: 4000, SAARC: 75, "Non-SAARC": 125 },
//         Final: { Indian: 4500, SAARC: 100, "Non-SAARC": 150 },
//       },
//       "Research Scholar": {
//         "Early Bird": { Indian: 6000, SAARC: 200, "Non-SAARC": 250 },
//         Final: { Indian: 7000, SAARC: 250, "Non-SAARC": 300 },
//       },
//       Faculty: {
//         "Early Bird": { Indian: 10000, SAARC: 300, "Non-SAARC": 400 },
//         Final: { Indian: 12000, SAARC: 400, "Non-SAARC": 500 },
//       },
//       Industry: {
//         "Early Bird": { Indian: 15000, SAARC: 500, "Non-SAARC": 700 },
//         Final: { Indian: 17000, SAARC: 650, "Non-SAARC": 850 },
//       },
//     }

//     const { delegate_type, registration_period, participant_region } = formData

//     if (delegate_type && registration_period && participant_region) {
//       return fees[delegate_type]?.[registration_period]?.[participant_region] || 0
//     }
//     return 0
//   }

//   const handleLogout = () => {
//     logout()
//     router.push("/")
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError(null)
//     setSuccess(null)

//     // client-side validation
//     if (!formData.full_name || !formData.email || !formData.transaction_id || !formData.payment_date) {
//       setError("Please fill in required fields: Full name, Email, Transaction ID, Payment Date.")
//       setIsLoading(false)
//       return
//     }

//     const paymentAmount = calculatePaymentAmount()

//     try {
//       const registrationData = {
//         ...formData,
//         payment_amount: paymentAmount,
//       }

//       const isUpdate = !!existingRegistration
//       const url = isUpdate ? `${DJANGO_API_URL}/api/registrations/${existingRegistration!.id}/` : `${DJANGO_API_URL}/api/registrations/`
//       const method = isUpdate ? "PATCH" : "POST"

//       const response = await authFetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(registrationData),
//       })

//       const data = await response.json().catch(() => null)

//       if (!response.ok) {
//         if (data) {
//           const fieldError = (data.transaction_id?.[0] as string) || (data.email?.[0] as string) || (data.detail as string) || Object.values(data)[0] as any || "Failed to submit registration"
//           throw new Error(typeof fieldError === "string" ? fieldError : JSON.stringify(fieldError))
//         } else {
//           throw new Error("Failed to submit registration")
//         }
//       }

//       setExistingRegistration(data)
//       setSuccess(isUpdate ? "Registration updated successfully!" : "Registration submitted successfully! Your application is now under review.")
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "An error occurred")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const deleteRegistration = async (id: string) => {
//     if (!confirm("Are you sure you want to delete your registration? You can resubmit after deletion.")) return
//     setIsLoading(true)
//     setError(null)
//     setSuccess(null)
//     try {
//       const res = await authFetch(`${DJANGO_API_URL}/api/registrations/${id}/`, { method: "DELETE" })
//       if (res.status === 204 || res.ok) {
//         setExistingRegistration(null)
//         // reset form (keep email)
//         setFormData((prev) => ({
//           ...prev,
//           full_name: "",
//           phone: "",
//           institution_organization: "",
//           designation: "",
//           country: "",
//           delegate_type: "",
//           registration_period: "",
//           participant_region: "",
//           transaction_id: "",
//           payment_date: "",
//         }))
//         setSuccess("Registration deleted. You can now refill and resubmit.")
//       } else {
//         const data = await res.json().catch(() => ({}))
//         throw new Error(data.detail || "Failed to delete registration")
//       }
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "An error occurred")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "Accepted":
//         return (
//           <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
//             <CheckCircle className="mr-1 h-3 w-3" />
//             Accepted
//           </Badge>
//         )
//       case "Rejected":
//         return (
//           <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
//             <XCircle className="mr-1 h-3 w-3" />
//             Rejected
//           </Badge>
//         )
//       default:
//         return (
//           <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
//             <Clock className="mr-1 h-3 w-3" />
//             Under Process
//           </Badge>
//         )
//     }
//   }

//   const canEdit = !existingRegistration || existingRegistration.status === "Rejected"

//   const renderStatusCard = () => {
//     if (!existingRegistration) return null

//     return (
//       <Card className="mb-8">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>Registration Status</CardTitle>
//             {getStatusBadge(existingRegistration.status)}
//           </div>
//           <CardDescription>
//             Submitted on {new Date(existingRegistration.created_at).toLocaleDateString()}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {/* Accepted view */}
//           {existingRegistration.status === "Accepted" && (
//             <div className="bg-white p-6 rounded-lg shadow-sm border">
//               <div className="flex items-start gap-4">
//                 <div className="flex-shrink-0">
//                   <CheckCircle className="h-8 w-8 text-green-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-green-900">You're registered!</h3>
//                   <p className="text-sm text-gray-700 mt-1">Thank you — your payment has been verified and your registration is confirmed.</p>

//                   <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="bg-gray-50 p-3 rounded">
//                       <p className="text-xs text-gray-500">Name</p>
//                       <p className="font-medium">{existingRegistration.full_name}</p>
//                     </div>
//                     <div className="bg-gray-50 p-3 rounded">
//                       <p className="text-xs text-gray-500">Email</p>
//                       <p className="font-medium">{existingRegistration.email}</p>
//                     </div>
//                     <div className="bg-gray-50 p-3 rounded">
//                       <p className="text-xs text-gray-500">Delegate Type</p>
//                       <p className="font-medium">{existingRegistration.delegate_type}</p>
//                     </div>
//                     <div className="bg-gray-50 p-3 rounded">
//                       <p className="text-xs text-gray-500">Registration Period</p>
//                       <p className="font-medium">{existingRegistration.registration_period}</p>
//                     </div>
//                     <div className="bg-gray-50 p-3 rounded">
//                       <p className="text-xs text-gray-500">Payment Amount</p>
//                       <p className="font-medium">{existingRegistration.participant_region === "Indian" ? `₹${existingRegistration.payment_amount}` : `$${existingRegistration.payment_amount}`}</p>
//                     </div>
//                     <div className="bg-gray-50 p-3 rounded">
//                       <p className="text-xs text-gray-500">Transaction ID</p>
//                       <p className="font-medium">{existingRegistration.transaction_id}</p>
//                     </div>
//                   </div>

//                   {existingRegistration.admin_notes && (
//                     <div className="mt-4 bg-blue-50 p-3 rounded">
//                       <p className="text-sm font-semibold text-blue-900">Admin Notes</p>
//                       <p className="text-sm text-blue-800">{existingRegistration.admin_notes}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Under Process view */}
//           {existingRegistration.status === "Under Process" && (
//             <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
//               <div className="flex items-start gap-3">
//                 <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
//                 <div>
//                   <p className="font-semibold text-yellow-900 mb-1">Your registration is being reviewed</p>
//                   <p className="text-sm text-yellow-800">Our team is verifying your payment details. This usually takes 2-3 business days.</p>
//                   <div className="mt-3 bg-gray-50 p-3 rounded">
//                     <p className="text-xs text-gray-500">Submitted details</p>
//                     <p className="text-sm font-medium">{existingRegistration.full_name} • {existingRegistration.email}</p>
//                     <p className="text-sm">Transaction: {existingRegistration.transaction_id} • Paid: {existingRegistration.payment_date}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Rejected view with delete/resubmit */}
//           {existingRegistration.status === "Rejected" && (
//             <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
//               <div className="flex items-start gap-3">
//                 <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="font-semibold text-red-900 mb-1">Registration Not Approved</p>
//                   <p className="text-sm text-red-800 mb-2">You can delete this submission, edit your details and resubmit.</p>
//                   {existingRegistration.admin_notes && (
//                     <div className="mt-3 bg-white p-3 rounded border border-red-200">
//                       <p className="text-xs font-semibold text-red-900 mb-1">Reason for Rejection:</p>
//                       <p className="text-sm text-red-800">{existingRegistration.admin_notes}</p>
//                     </div>
//                   )}

//                   <div className="mt-4 flex gap-2">
//                     <Button variant="outline" onClick={() => deleteRegistration(existingRegistration.id)} disabled={isLoading}>
//                       <Trash2 className="mr-2 h-4 w-4" /> Delete & Refill
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     )
//   }

//   if (isFetchingStatus) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
//           <p className="text-gray-600">Loading your registration status...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
//       <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Participant Dashboard</h1>
//             <p className="text-gray-600 mt-1">2D MatTech Global 2026</p>
//           </div>
//           <Button onClick={handleLogout} variant="outline">
//             <LogOut className="mr-2 h-4 w-4" />
//             Log Out
//           </Button>
//         </div>

//         {renderStatusCard()}

//         <Card>
//           <CardHeader>
//             <CardTitle>Registration Form</CardTitle>
//             <CardDescription>
//               {canEdit
//                 ? "Fill in your details to complete your registration. Make sure to include your Transaction ID for payment verification."
//                 : "Your registration has been submitted and cannot be edited while it is under review or after acceptance."
//               }
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Personal Information</h3>

//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div className="space-y-2">
//                     <Label htmlFor="full_name">Full Name *</Label>
//                     <Input
//                       id="full_name"
//                       required
//                       disabled={!canEdit}
//                       value={formData.full_name}
//                       onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email *</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       required
//                       disabled={!canEdit}
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="phone">Phone Number *</Label>
//                     <Input
//                       id="phone"
//                       type="tel"
//                       required
//                       disabled={!canEdit}
//                       value={formData.phone}
//                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="country">Country *</Label>
//                     <Input
//                       id="country"
//                       required
//                       disabled={!canEdit}
//                       value={formData.country}
//                       onChange={(e) => setFormData({ ...formData, country: e.target.value })}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="institution_organization">Institution/Organization *</Label>
//                     <Input
//                       id="institution_organization"
//                       required
//                       disabled={!canEdit}
//                       value={formData.institution_organization}
//                       onChange={(e) => setFormData({ ...formData, institution_organization: e.target.value })}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="designation">Designation</Label>
//                     <Input
//                       id="designation"
//                       disabled={!canEdit}
//                       value={formData.designation}
//                       onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Delegate Information</h3>

//                 <div className="grid gap-4 md:grid-cols-3">
//                   <div className="space-y-2">
//                     <Label htmlFor="delegate_type">Delegate Type *</Label>
//                     <Select
//                       value={formData.delegate_type}
//                       onValueChange={(value) => setFormData({ ...formData, delegate_type: value })}
//                       disabled={!canEdit}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="UG/PG Student">UG/PG Student</SelectItem>
//                         <SelectItem value="Research Scholar">Research Scholar</SelectItem>
//                         <SelectItem value="Faculty">Faculty</SelectItem>
//                         <SelectItem value="Industry">Industry</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="registration_period">Registration Period *</Label>
//                     <Select
//                       value={formData.registration_period}
//                       onValueChange={(value) => setFormData({ ...formData, registration_period: value })}
//                       disabled={!canEdit}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select period" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Early Bird">Early Bird (until May 5, 2026)</SelectItem>
//                         <SelectItem value="Final">Final (after May 5, 2026)</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="participant_region">Participant Region *</Label>
//                     <Select
//                       value={formData.participant_region}
//                       onValueChange={(value) => setFormData({ ...formData, participant_region: value })}
//                       disabled={!canEdit}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select region" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Indian">Indian</SelectItem>
//                         <SelectItem value="SAARC">SAARC</SelectItem>
//                         <SelectItem value="Non-SAARC">Non-SAARC</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {formData.delegate_type && formData.registration_period && formData.participant_region && (
//                   <div className="bg-blue-50 p-4 rounded-lg">
//                     <p className="text-sm font-semibold text-blue-900">Registration Fee:</p>
//                     <p className="text-2xl font-bold text-blue-700 mt-1">
//                       {formData.participant_region === "Indian" ? "₹" : "$"}
//                       {calculatePaymentAmount()}
//                     </p>
//                     <p className="text-xs text-blue-600 mt-1">
//                       Please pay this amount using the bank details below before submitting
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Payment Information</h3>

//                 <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                   <p className="text-sm font-semibold text-gray-900 mb-2">Bank Details:</p>
//                   <div className="text-sm text-gray-700 space-y-1">
//                     <p>
//                       <span className="font-medium">Account Name:</span> Indian Institute of Technology Indore
//                     </p>
//                     <p>
//                       <span className="font-medium">Account Number:</span> 1476101027440
//                     </p>
//                     <p>
//                       <span className="font-medium">IFSC Code:</span> CNRB0006223
//                     </p>
//                     <p>
//                       <span className="font-medium">Bank:</span> Canara Bank, Simrol IIT Branch
//                     </p>
//                     <p>
//                       <span className="font-medium">SWIFT Code:</span> CNRBINBBMSG (for international transfers)
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div className="space-y-2">
//                     <Label htmlFor="transaction_id">Transaction ID *</Label>
//                     <Input
//                       id="transaction_id"
//                       required
//                       disabled={!canEdit}
//                       value={formData.transaction_id || ""}
//                       onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
//                       placeholder="Enter your payment transaction ID"
//                     />
//                     <p className="text-xs text-gray-500">Enter the transaction/reference ID from your bank payment</p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="payment_date">Payment Date *</Label>
//                     <Input
//                       id="payment_date"
//                       type="date"
//                       required
//                       disabled={!canEdit}
//                       value={formData.payment_date || ""}
//                       onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {error && (
//                 <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
//                   <AlertCircle className="h-4 w-4" />
//                   {error}
//                 </div>
//               )}

//               {success && (
//                 <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
//                   <CheckCircle className="h-4 w-4" />
//                   {success}
//                 </div>
//               )}

//               {canEdit && (
//                 <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Submitting...
//                     </>
//                   ) : existingRegistration ? (
//                     "Update Registration"
//                   ) : (
//                     "Submit Registration"
//                   )}
//                 </Button>
//               )}
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


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
import { LogOut, CheckCircle, Clock, XCircle, AlertCircle, PartyPopper, Loader2, Trash2, Info } from "lucide-react"

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
  status: string
  admin_notes: string | null
  created_at: string
  presenting_paper: boolean
  abstract_id: string | null
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

  const userEmail = user?.email || ""

  const [formData, setFormData] = useState({
    full_name: "",
    email: userEmail,
    phone: "",
    institution_organization: "",
    designation: "",
    country: "",
    delegate_type: "",
    registration_period: "",
    participant_region: "",
    transaction_id: "",
    payment_date: "",
    presenting_paper: "",
    abstract_id: "",
  })

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      console.log("DEBUG: User Object received:", user)

      if (!userEmail) {
        console.error("CRITICAL: User email is missing. Check your auth logic.")
        setIsFetchingStatus(false)
        return
      }

      try {
        console.log("DEBUG: Attempting to fetch list from:", `${DJANGO_API_URL}/api/registrations/`)

        const listRes = await authFetch(`${DJANGO_API_URL}/api/registrations/`, { method: "GET" })

        console.log("DEBUG: List Fetch Status:", listRes.status)

        if (listRes.ok) {
          const listData = await listRes.json()
          console.log("DEBUG: List Data received:", listData)

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
              transaction_id: reg.transaction_id || "",
              payment_date: reg.payment_date || "",
              presenting_paper: reg.presenting_paper ? "yes" : "no",
              abstract_id: reg.abstract_id || "",
            })
            setIsFetchingStatus(false)
            return
          }
        }

        if (userEmail) {
          console.log("DEBUG: Attempting check-by-email for:", userEmail)
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
              transaction_id: data.transaction_id || "",
              payment_date: data.payment_date || "",
              presenting_paper: data.presenting_paper ? "yes" : "no",
              abstract_id: data.abstract_id || "",
            })
          } else if (response.status === 404) {
            console.log("DEBUG: No registration found (404)")
            setExistingRegistration(null)
          }
        } else {
          console.warn("Skipping check-by-email because email is empty")
        }
      } catch (err) {
        console.error("DEBUG: Fetch FAILED with error:", err)
        setError("Unable to connect to server.")
      } finally {
        setIsFetchingStatus(false)
      }
    }

    fetchRegistrationStatus()
  }, [user, userEmail])

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

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/")
      router.refresh()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.transaction_id ||
      !formData.payment_date ||
      !formData.presenting_paper
    ) {
      setError("Please fill in required fields: Full name, Email, Transaction ID, Payment Date, and Presenting Paper.")
      setIsLoading(false)
      return
    }

    if (formData.presenting_paper === "yes" && !formData.abstract_id) {
      setError("Please provide the Abstract ID since you are presenting a paper.")
      setIsLoading(false)
      return
    }

    const paymentAmount = calculatePaymentAmount()

    try {
      const registrationData = {
        ...formData,
        payment_amount: paymentAmount,
        presenting_paper: formData.presenting_paper === "yes",
        abstract_id: formData.presenting_paper === "yes" ? formData.abstract_id : null,
      }

      const isUpdate = !!existingRegistration
      const url = isUpdate
        ? `${DJANGO_API_URL}/api/registrations/${existingRegistration!.id}/`
        : `${DJANGO_API_URL}/api/registrations/`
      const method = isUpdate ? "PATCH" : "POST"

      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        if (data) {
          const fieldError =
            (data.transaction_id?.[0] as string) ||
            (data.email?.[0] as string) ||
            (data.detail as string) ||
            (Object.values(data)[0] as any) ||
            "Failed to submit registration"
          throw new Error(typeof fieldError === "string" ? fieldError : JSON.stringify(fieldError))
        } else {
          throw new Error("Failed to submit registration")
        }
      }

      setExistingRegistration(data)
      setSuccess(
        isUpdate
          ? "Registration updated successfully!"
          : "Registration submitted successfully! Your application is now under review.",
      )
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
          presenting_paper: "",
          abstract_id: "",
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

  const canEdit = !existingRegistration || existingRegistration.status === "Rejected"

  const renderStatusCard = () => {
    if (!existingRegistration) return null

    return (
      <Card className="mb-8 border-0 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50" />
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-inner border-2 border-green-200 animate-in fade-in zoom-in duration-500">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-full shadow-lg">
                  <PartyPopper className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-900 mb-2">Congratulations! You're Registered! 🎉</h3>
                  <p className="text-base text-green-800 mb-6 leading-relaxed">
                    Your payment has been verified and your registration is confirmed. We look forward to seeing you at
                    the conference!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Full Name</p>
                      <p className="font-semibold text-gray-900">{existingRegistration.full_name}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Email</p>
                      <p className="font-semibold text-gray-900 break-all">{existingRegistration.email}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Phone</p>
                      <p className="font-semibold text-gray-900">{existingRegistration.phone}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Institution</p>
                      <p className="font-semibold text-gray-900">{existingRegistration.institution_organization}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Delegate Type</p>
                      <p className="font-semibold text-gray-900">{existingRegistration.delegate_type}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                        Registration Period
                      </p>
                      <p className="font-semibold text-gray-900">{existingRegistration.registration_period}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                        Payment Amount
                      </p>
                      <p className="font-bold text-lg text-green-700">
                        {existingRegistration.participant_region === "Indian"
                          ? `₹${existingRegistration.payment_amount}`
                          : `$${existingRegistration.payment_amount}`}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow md:col-span-2">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                        Transaction ID
                      </p>
                      <p className="font-mono font-semibold text-gray-900">{existingRegistration.transaction_id}</p>
                    </div>
                  </div>

                  {existingRegistration.admin_notes && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-blue-900 mb-1">Message from Admin</p>
                          <p className="text-sm text-blue-800 leading-relaxed">{existingRegistration.admin_notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {existingRegistration.status === "Under Process" && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6 rounded-2xl shadow-inner animate-pulse-subtle">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-full shadow-lg">
                  <Clock className="h-7 w-7 text-white animate-spin-slow" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xl text-amber-900 mb-2">Your registration is being reviewed</p>
                  <p className="text-base text-amber-800 mb-4 leading-relaxed">
                    Our team is verifying your payment details. This usually takes 2-3 business days. You'll receive an
                    email once the verification is complete.
                  </p>
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">
                      Submitted Details
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Name:</span>{" "}
                        <span className="text-gray-900">{existingRegistration.full_name}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Email:</span>{" "}
                        <span className="text-gray-900">{existingRegistration.email}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Transaction ID:</span>{" "}
                        <span className="text-gray-900 font-mono">{existingRegistration.transaction_id}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-700">Payment Date:</span>{" "}
                        <span className="text-gray-900">{existingRegistration.payment_date}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {existingRegistration.status === "Rejected" && (
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-6 rounded-2xl shadow-inner">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-red-500 to-rose-500 p-3 rounded-full shadow-lg">
                  <AlertCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xl text-red-900 mb-2">Registration Not Approved</p>
                  <p className="text-base text-red-800 mb-4 leading-relaxed">
                    Your registration couldn't be verified. Please review the reason below, delete this submission, and
                    resubmit with correct details.
                  </p>
                  {existingRegistration.admin_notes && (
                    <div className="bg-white p-5 rounded-xl border-l-4 border-red-500 shadow-sm mb-4">
                      <p className="text-xs font-bold text-red-900 uppercase tracking-wide mb-2">
                        Reason for Rejection
                      </p>
                      <p className="text-sm text-red-800 leading-relaxed">{existingRegistration.admin_notes}</p>
                    </div>
                  )}

                  <Button
                    variant="destructive"
                    onClick={() => deleteRegistration(existingRegistration.id)}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md"
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
          <div className="relative w-20 h-20 mx-auto mb-6">
            <Loader2 className="h-20 w-20 text-blue-600 animate-spin" />
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse" />
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-2">Loading Your Dashboard</p>
          <p className="text-sm text-gray-500">Please wait while we fetch your registration status...</p>
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
              className="z-10 bg-white hover:bg-blue-100 hover:text-white border-2 border-gray-300 shadow-md hover:shadow-lg transition-all"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {renderStatusCard()}

        <Card className="border-0 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="text-2xl font-bold text-gray-900">Registration Form</CardTitle>
            <CardDescription className="text-base mt-2 leading-relaxed">
              {canEdit
                ? "Fill in your details to complete your registration. Make sure to include your Transaction ID for payment verification."
                : "Your registration has been submitted and cannot be edited while it is under review or after acceptance."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-100">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                  <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-semibold text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="full_name"
                      required
                      disabled={!canEdit}
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="h-12 border-2 focus:border-blue-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      disabled={!canEdit}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 border-2 focus:border-blue-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      disabled={!canEdit}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 border-2 focus:border-blue-500 transition-colors"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="country"
                      required
                      disabled={!canEdit}
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="h-12 border-2 focus:border-blue-500 transition-colors"
                      placeholder="Enter your country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution_organization" className="text-sm font-semibold text-gray-700">
                      Institution/Organization <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="institution_organization"
                      required
                      disabled={!canEdit}
                      value={formData.institution_organization}
                      onChange={(e) => setFormData({ ...formData, institution_organization: e.target.value })}
                      className="h-12 border-2 focus:border-blue-500 transition-colors"
                      placeholder="Your institution name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="designation" className="text-sm font-semibold text-gray-700">
                      Designation
                    </Label>
                    <Input
                      id="designation"
                      disabled={!canEdit}
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="h-12 border-2 focus:border-blue-500 transition-colors"
                      placeholder="Your job title or position"
                    />
                  </div>
                </div>
              </div>

              {/* Delegate Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-purple-100">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
                  <h3 className="text-xl font-bold text-gray-900">Delegate Information</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="delegate_type" className="text-sm font-semibold text-gray-700">
                      Delegate Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.delegate_type}
                      onValueChange={(value) => setFormData({ ...formData, delegate_type: value })}
                      disabled={!canEdit}
                      required
                    >
                      <SelectTrigger id="delegate_type" className="h-12 border-2 focus:border-purple-500">
                        <SelectValue placeholder="Select delegate type" />
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
                    <Label htmlFor="registration_period" className="text-sm font-semibold text-gray-700">
                      Registration Period <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.registration_period}
                      onValueChange={(value) => setFormData({ ...formData, registration_period: value })}
                      disabled={!canEdit}
                      required
                    >
                      <SelectTrigger id="registration_period" className="h-12 border-2 focus:border-purple-500">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Early Bird">Early Bird (until May 5, 2026)</SelectItem>
                        <SelectItem value="Final">Final (after May 5, 2026)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="participant_region" className="text-sm font-semibold text-gray-700">
                      Participant Region <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.participant_region}
                      onValueChange={(value) => setFormData({ ...formData, participant_region: value })}
                      disabled={!canEdit}
                      required
                    >
                      <SelectTrigger id="participant_region" className="h-12 border-2 focus:border-purple-500">
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

                {/* Presenting Paper Section */}
                <div className="space-y-4 mt-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">
                      Are you presenting a paper? <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={formData.presenting_paper}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          presenting_paper: value,
                          abstract_id: value === "no" ? "" : formData.abstract_id,
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

                  {formData.presenting_paper === "yes" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Label htmlFor="abstract_id" className="text-sm font-semibold text-gray-700">
                        Abstract ID <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="abstract_id"
                        required
                        disabled={!canEdit}
                        value={formData.abstract_id}
                        onChange={(e) => setFormData({ ...formData, abstract_id: e.target.value })}
                        className="h-12 border-2 focus:border-purple-500 transition-colors"
                        placeholder="Enter your abstract ID"
                      />
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Enter the Abstract ID assigned to your submitted paper
                      </p>
                    </div>
                  )}
                </div>

                {formData.delegate_type && formData.registration_period && formData.participant_region && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200 shadow-lg animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <p className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-1">Registration Fee</p>
                        <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {formData.participant_region === "Indian" ? "₹" : "$"}
                          {calculatePaymentAmount()}
                        </p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-blue-200">
                        <p className="text-xs text-blue-700 font-medium">💡 Please pay this amount before submitting</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-indigo-100">
                  <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full" />
                  <h3 className="text-xl font-bold text-gray-900">Payment Information</h3>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border-2 border-gray-200 shadow-inner">
                  <p className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    Bank Details for Payment
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <p className="font-semibold text-gray-700 mb-1">Account Name</p>
                      <p className="text-gray-900">Indian Institute of Technology Indore</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <p className="font-semibold text-gray-700 mb-1">Account Number</p>
                      <p className="text-gray-900 font-mono">1476101027440</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <p className="font-semibold text-gray-700 mb-1">IFSC Code</p>
                      <p className="text-gray-900 font-mono">CNRB0006223</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <p className="font-semibold text-gray-700 mb-1">Bank Name</p>
                      <p className="text-gray-900">Canara Bank, Simrol IIT Branch</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm md:col-span-2">
                      <p className="font-semibold text-gray-700 mb-1">SWIFT Code (International)</p>
                      <p className="text-gray-900 font-mono">CNRBINBBMSG</p>
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
                      value={formData.transaction_id || ""}
                      onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                      placeholder="Enter payment transaction ID"
                      className="h-12 border-2 focus:border-indigo-500 transition-colors font-mono"
                    />
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Enter the transaction/reference ID from your bank
                    </p>
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
                      value={formData.payment_date || ""}
                      onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                      className="h-12 border-2 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Alert Messages */}
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 p-5 rounded-xl shadow-md animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800 font-medium leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-xl shadow-md animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-800 font-medium leading-relaxed">{success}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {canEdit && (
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Your Registration...
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

        {/* Footer note */}
        <p className="text-center text-sm text-gray-500 mt-8">Need help? Contact us at support@2dmattech.org</p>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}
