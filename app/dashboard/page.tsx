"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUserFromToken, refreshAccessToken, type User } from "@/lib/auth"
import DashboardClient from "./dashboard-client"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      let currentUser = getUserFromToken()

      if (!currentUser) {
        // Try to refresh the token
        const newToken = await refreshAccessToken()
        if (newToken) {
          currentUser = getUserFromToken()
        }
      }

      if (!currentUser) {
        router.push("/auth/login")
        return
      }

      setUser(currentUser)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <DashboardClient user={user} />
}
