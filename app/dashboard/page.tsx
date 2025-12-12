import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch existing registration if any
  const { data: registration } = await supabase.from("registrations").select("*").eq("user_id", data.user.id).single()

  return <DashboardClient user={data.user} existingRegistration={registration} />
}
