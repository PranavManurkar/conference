"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { requestPasswordReset } from "@/lib/auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    const { success, error: requestError, message: serverMessage } = await requestPasswordReset(email.trim())

    if (!success && requestError) {
      setError(requestError)
      setIsLoading(false)
      return
    }

    setMessage(serverMessage)
    setIsLoading(false)
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
          <section className="card-shell" aria-labelledby="forgot-password-title">
            <div className="card-header">
              <h1 id="forgot-password-title" className="card-title">Forgot Password</h1>
              <p className="card-desc">Enter your email and we will send you a reset link.</p>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit} className="form" noValidate>
                <div className="form-row">
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email"
                  />
                </div>

                {error && <div className="error" role="alert">{error}</div>}

                {message && (
                  <div className="success" role="status">
                    <MailCheck size={16} />
                    <span>{message}</span>
                  </div>
                )}

                <button type="submit" disabled={isLoading} className="submit-button">
                  {isLoading ? "Sending..." : "Send Reset Link"}
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
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #0f5132;
          background: #d1e7dd;
          padding: 10px 12px;
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
