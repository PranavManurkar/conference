import { jwtDecode } from "jwt-decode"

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000"

export type User = {
  id: string
  email: string
  first_name?: string
  last_name?: string
}

type AuthTokens = {
  access: string
  refresh: string
}

type DecodedToken = {
  user_id: number
  email?: string // <--- Made optional to prevent crashes if backend excludes it
  exp: number
}

const USER_DATA_KEY = "user_data" // <--- NEW: Key to store user details

// Store tokens in localStorage
export function setTokens(tokens: AuthTokens) {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", tokens.access)
    localStorage.setItem("refresh_token", tokens.refresh)
  }
}

// <--- NEW: Helper to store user data
export function setUserData(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token")
  }
  return null
}

export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token")
  }
  return null
}

export function clearTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem(USER_DATA_KEY) // <--- NEW: Clear user data on logout
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

// <--- FIXED: Robust User Retrieval
export function getUserFromToken(): User | null {
  const token = getAccessToken()
  if (!token || isTokenExpired(token)) {
    return null
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    
    // 1. Try to get full user details from LocalStorage (Fallback)
    let storedUser: User | null = null
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem(USER_DATA_KEY)
        if (stored) {
            try { storedUser = JSON.parse(stored) } catch {}
        }
    }

    // 2. Return combined data. 
    // If token lacks email, we grab it from localStorage.
    return {
      id: String(decoded.user_id),
      email: decoded.email || storedUser?.email || "", 
      first_name: storedUser?.first_name,
      last_name: storedUser?.last_name
    }
  } catch {
    return null
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
      clearTokens()
      return null
    }

    const data = await response.json()
    localStorage.setItem("access_token", data.access)
    return data.access
  } catch {
    clearTokens()
    return null
  }
}

export async function login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const response = await fetch(`${DJANGO_API_URL}/api/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { user: null, error: data.error || data.detail || "Invalid credentials" }
    }

    setTokens({ access: data.access, refresh: data.refresh })
    
    // <--- FIXED: Save user data immediately so it survives refresh
    if (data.user) {
        setUserData(data.user) 
    }

    return { user: data.user, error: null }
  } catch (err) {
    return { user: null, error: "Network error. Please try again." }
  }
}

export async function signUp(email: string, password: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const response = await fetch(`${DJANGO_API_URL}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || data.email?.[0] || "Registration failed" }
    }

    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: "Network error. Please try again." }
  }
}

export function logout() {
  clearTokens()
}