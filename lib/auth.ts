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
  email?: string
  exp: number
}

const USER_DATA_KEY = "user_data"
const ACCESS_KEY = "access_token"
const REFRESH_KEY = "refresh_token"

// Store tokens in localStorage
export function setTokens(tokens: AuthTokens) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_KEY, tokens.access)
    localStorage.setItem(REFRESH_KEY, tokens.refresh)
  }
}

// Store user data in localStorage
export function setUserData(user: User) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
    } catch {
      // ignore storage errors
    }
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ACCESS_KEY)
  }
  return null
}

export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_KEY)
  }
  return null
}

export function clearTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_DATA_KEY)
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

export function getUserFromToken(): User | null {
  const token = getAccessToken()
  if (!token || isTokenExpired(token)) {
    return null
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token)

    // fallback to stored user data in case token lacks fields
    let storedUser: User | null = null
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(USER_DATA_KEY)
      if (stored) {
        try {
          storedUser = JSON.parse(stored)
        } catch {}
      }
    }

    return {
      id: String(decoded.user_id),
      email: decoded.email || storedUser?.email || "",
      first_name: storedUser?.first_name,
      last_name: storedUser?.last_name,
    }
  } catch {
    return null
  }
}

// --- SELF-HEALING REFRESH FUNCTION ---
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  
  // If no token, we are effectively logged out
  if (!refreshToken) {
    clearTokens() 
    return null
  }

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    // If server says "Unauthorized" (401) or "Bad Request" (400), the user is likely deleted or token invalid.
    // We MUST clear tokens to prevent infinite error loops.
    if (response.status === 401 || response.status === 400 || response.status === 403) {
      console.warn("Refresh failed: Token invalid or User deleted. Clearing session.")
      clearTokens()
      return null
    }

    if (!response.ok) {
      clearTokens()
      return null
    }

    const data = await response.json()
    if (data?.access) {
      localStorage.setItem(ACCESS_KEY, data.access)
      return data.access
    }

    clearTokens()
    return null
  } catch (error) {
    // Network errors (CORS, Server Down) end up here.
    // We fail safe by clearing tokens so the user sees the Login screen instead of a crash.
    console.error("Critical Refresh Error (Network/CORS):", error)
    clearTokens()
    return null
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    const response = await fetch(`${DJANGO_API_URL}/api/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    })

    // Safety Check: Handle non-JSON responses (Server Crash/500)
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
       const text = await response.text()
       console.error("Login Error: Non-JSON response from server", text)
       return { user: null, error: "Server Error. Please check console." }
    }

    const data = await response.json()

    if (!response.ok) {
      return { user: null, error: data.error || data.detail || "Invalid credentials" }
    }

    if (data.access && data.refresh) {
      setTokens({ access: data.access, refresh: data.refresh })
    }

    if (data.user) {
      setUserData(data.user)
    }

    return { user: data.user ?? getUserFromToken(), error: null }
  } catch (err) {
    console.error("Login Exception:", err)
    return { user: null, error: "Network error. Please try again." }
  }
}

export async function signUp(
  email: string,
  password: string
): Promise<{ success: boolean; error: string | null }> {
  // 1. CRITICAL: Handle existing token. 
  // If we are signing up, we must wipe any old session first.
  clearTokens()

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    // 2. Safety Check: Handle non-JSON responses (Server Crash/500)
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text() 
      console.error("SignUp Error: Non-JSON response from server:", text)
      return { success: false, error: "Server error: Non-JSON response (Check console)" }
    }

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || data.email?.[0] || "Registration failed" }
    }

    // Success handling
    if (data.access && data.refresh) {
      setTokens({ access: data.access, refresh: data.refresh })
    }
    if (data.user) {
      setUserData(data.user)
    }

    return { success: true, error: null }
  } catch (err) {
    console.error("SignUp Exception:", err) 
    return { success: false, error: "Network error. Please try again." }
  }
}

// immediate, synchronous local logout (good UX)
export function logout(): void {
  clearTokens()
}

// best-effort server logout: blacklists refresh token server-side, then clears local storage
export async function logoutServer(): Promise<{ ok: boolean; message?: string }> {
  const refresh = getRefreshToken()

  // clear locally immediately for UX
  clearTokens()

  if (!refresh) {
    return { ok: true, message: "No refresh token present; local tokens cleared." }
  }

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/auth/logout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })

    if (response.ok) {
      return { ok: true, message: "Server logout (token blacklisted) successful." }
    } else {
      const data = await response.json().catch(() => ({}))
      return { ok: false, message: data.detail || "Server logout failed" }
    }
  } catch {
    return { ok: false, message: "Network error during server logout" }
  }
}