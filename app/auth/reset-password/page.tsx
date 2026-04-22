"use client"

import type React from "react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { confirmPasswordReset } from "@/lib/auth"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const uid = useMemo(() => searchParams.get("uid") || "", [searchParams])
  const token = useMemo(() => searchParams.get("token") || "", [searchParams])

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!uid || !token) {
      setError("Invalid password reset link.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setIsLoading(true)

    const { success: resetSuccess, error: resetError } = await confirmPasswordReset(uid, token, newPassword)

    if (!resetSuccess) {
      setError(resetError || "Reset link is invalid or expired.")
      setIsLoading(false)
      return
    }

    setSuccess("Password updated successfully. Redirecting to login...")
    setIsLoading(false)

    setTimeout(() => {
      router.push("/auth/login")
    }, 1200)
  }

  return (
    <div className="auth-root">
      <main className="auth-main" role="main">
        <div className="back-row">
          <Button asChild>
            <Link href="/auth/login" className="back-link" aria-label="Back to login">
              <ArrowLeft className="back-icon" />
              Back to Login
            </Link>
          </Button>
        </div>

        <div className="center-wrapper">
          <section className="card-shell" aria-labelledby="reset-password-title">
            <div className="card-header">
              <h1 id="reset-password-title" className="card-title">Reset Password</h1>
              <p className="card-desc">Choose a new password for your account.</p>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit} className="form" noValidate>
                <div className="form-row">
                  <label htmlFor="new-password" className="label">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    required
                    className="input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    aria-label="New Password"
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="confirm-password" className="label">Confirm Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    required
                    className="input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    aria-label="Confirm Password"
                  />
                </div>

                {error && <div className="error" role="alert">{error}</div>}
                {success && <div className="success" role="status">{success}</div>}

                <button type="submit" disabled={isLoading} className="submit-button">
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .auth-root {
          min-height: 100vh;
          background: var(--background, #fbfbfd);
          color: var(--foreground, #1b1b26);
        }
        .auth-main {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 32px 20px;
        }
        .back-row {
          margin-bottom: 18px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .back-icon {
          width: 14px;
          height: 14px;
        }
        .center-wrapper {
          display: flex;
          justify-content: center;
        }
        .card-shell {
          width: 100%;
          max-width: 440px;
          background: var(--card, #fff);
          border: 1px solid var(--border, #e6e6ea);
          border-radius: 14px;
          box-shadow: 0 12px 30px rgba(23, 23, 29, 0.06);
          overflow: hidden;
        }
        .card-header {
          padding: 26px 28px 18px;
        }
        .card-title {
          margin: 0;
          font-size: 22px;
          color: var(--card-foreground, #16161a);
        }
        .card-desc {
          margin: 6px 0 0;
          color: var(--muted-foreground, #6b6b76);
          font-size: 13px;
        }
        .card-body {
          padding: 20px 24px 28px;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .form-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .label {
          font-size: 13px;
          color: var(--muted-foreground, #6b6b76);
        }
        .input {
          height: 44px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid var(--border, #e6e6ea);
          background: var(--input, #fbfbfd);
          color: var(--foreground, #1b1b26);
          font-size: 14px;
          outline: none;
        }
        .input:focus {
          border-color: var(--ring, #5a3eb8);
          box-shadow: 0 6px 18px rgba(90, 62, 184, 0.08);
        }
        .error {
          color: var(--destructive-foreground, #fff);
          background: var(--destructive, #d9534f);
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 13px;
        }
        .success {
          color: #0f5132;
          background: #d1e7dd;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 13px;
        }
        .submit-button {
          width: 100%;
          height: 44px;
          border-radius: 10px;
          background: var(--primary, #5a3eb8);
          color: var(--primary-foreground, #fff);
          font-weight: 600;
          border: none;
          cursor: pointer;
          font-size: 15px;
        }
        .submit-button[disabled] {
          opacity: 0.65;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
