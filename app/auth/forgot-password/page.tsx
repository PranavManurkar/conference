"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Mail } from "lucide-react";
import { requestPasswordReset } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    const { success, error: requestError } = await requestPasswordReset(trimmedEmail);

    if (!success) {
      setError(requestError || "Something went wrong. Please try again.");
      setStatus("idle");
      return;
    }

    setStatus("sent");
  };

  return (
    <div className="forgot-root">
      <main className="forgot-main" role="main">
        <Link href="/auth/login" className="back-link">
          <ArrowLeft className="back-icon" />
          Back to login
        </Link>

        <div className="card">
          <section className="card-left">
            <div className="badge delay-1">
              <Mail className="badge-icon" />
              Reset access
            </div>
            <h1 className="card-title delay-2">Forgot your password?</h1>
            <p className="card-copy delay-3">
              Enter your registered email and we will send a secure reset link. The message will
              come from 2dmtg@iiti.ac.in.
            </p>
            <div className="card-note delay-4">
              <div className="note-title">Before you submit</div>
              <ul className="note-list">
                <li>Check your spam folder if you do not see the email within a few minutes.</li>
                <li>Use the latest link you receive; older links may expire.</li>
              </ul>
            </div>
          </section>

          <section className="card-right">
            {status === "sent" ? (
              <div className="sent-panel" aria-live="polite">
                <CheckCircle className="sent-icon" />
                <h2 className="sent-title">Check your inbox</h2>
                <p className="sent-copy">
                  If your email is on file, you will receive a reset link shortly. Follow the
                  instructions in that email to set a new password.
                </p>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setStatus("idle")}
                >
                  Send another link
                </button>
                <Link href="/auth/login" className="text-link">
                  Return to login
                </Link>
              </div>
            ) : (
              <form className="form" onSubmit={handleSubmit} noValidate>
                <label htmlFor="email" className="label">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-describedby="email-help"
                />
                <p id="email-help" className="help-text">
                  We will send a reset link to this address.
                </p>

                {error && (
                  <div className="error" role="alert">
                    {error}
                  </div>
                )}

                <button type="submit" className="primary-button" disabled={status === "loading"}>
                  {status === "loading" ? "Sending link..." : "Send reset link"}
                </button>

                <div className="footer-text">
                  Remembered it?{" "}
                  <Link href="/auth/login" className="text-link">
                    Log in here
                  </Link>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap");

        .forgot-root {
          min-height: 100vh;
          background: radial-gradient(900px circle at 10% 10%, rgba(255, 206, 122, 0.35), transparent 60%),
            radial-gradient(800px circle at 90% 20%, rgba(14, 116, 144, 0.18), transparent 65%),
            linear-gradient(135deg, #f7f1e7 0%, #eef7f5 45%, #f9efe4 100%);
          color: #1a1a1f;
          font-family: "Space Grotesk", "Source Sans Pro", sans-serif;
          position: relative;
          overflow: hidden;
        }

        .forgot-root::before {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          top: -120px;
          right: -140px;
          background: radial-gradient(circle, rgba(14, 116, 144, 0.18) 0%, rgba(14, 116, 144, 0) 70%);
          pointer-events: none;
        }

        .forgot-root::after {
          content: "";
          position: absolute;
          width: 320px;
          height: 320px;
          bottom: -140px;
          left: -80px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0) 70%);
          pointer-events: none;
        }

        .forgot-main {
          max-width: 1040px;
          margin: 0 auto;
          padding: 40px 20px 64px;
          position: relative;
          z-index: 1;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #0f766e;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 0.01em;
          margin-bottom: 24px;
        }

        .back-link:hover {
          color: #0d9488;
        }

        .back-icon {
          width: 16px;
          height: 16px;
        }

        .card {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          border-radius: 22px;
          background: #fff;
          border: 1px solid rgba(15, 118, 110, 0.15);
          box-shadow: 0 24px 50px rgba(15, 23, 42, 0.12);
          overflow: hidden;
          animation: card-in 0.6s ease both;
        }

        .card-left {
          padding: 40px 36px;
          background: linear-gradient(160deg, #0f766e 0%, #14b8a6 55%, #6ee7d8 120%);
          color: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(248, 250, 252, 0.18);
          border: 1px solid rgba(248, 250, 252, 0.35);
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          width: fit-content;
        }

        .badge-icon {
          width: 14px;
          height: 14px;
        }

        .card-title {
          font-size: 30px;
          line-height: 1.1;
          margin: 0;
        }

        .card-copy {
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
          color: rgba(248, 250, 252, 0.9);
        }

        .card-note {
          background: rgba(15, 23, 42, 0.2);
          border-radius: 14px;
          padding: 16px;
          border: 1px solid rgba(248, 250, 252, 0.2);
        }

        .note-title {
          font-weight: 600;
          margin-bottom: 8px;
        }

        .note-list {
          margin: 0;
          padding-left: 18px;
          display: grid;
          gap: 6px;
          font-size: 13px;
        }

        .card-right {
          padding: 40px 36px;
          background: #ffffff;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fade-up 0.6s ease both;
          animation-delay: 0.1s;
        }

        .label {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
        }

        .input {
          height: 48px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(15, 23, 42, 0.15);
          background: #f8fafc;
          font-size: 14px;
          color: #0f172a;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
        }

        .input:focus {
          outline: none;
          border-color: #0f766e;
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.2);
          transform: translateY(-1px);
        }

        .help-text {
          font-size: 12px;
          color: #64748b;
          margin: -6px 0 0;
        }

        .error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid rgba(153, 27, 27, 0.2);
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13px;
        }

        .primary-button {
          height: 46px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #0f766e 0%, #14b8a6 55%, #f59e0b 120%);
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }

        .primary-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          box-shadow: none;
        }

        .primary-button:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(14, 116, 144, 0.25);
        }

        .footer-text {
          font-size: 13px;
          color: #64748b;
          text-align: center;
        }

        .text-link {
          color: #0f766e;
          text-decoration: none;
          font-weight: 600;
        }

        .text-link:hover {
          color: #0d9488;
        }

        .sent-panel {
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: flex-start;
          animation: fade-up 0.6s ease both;
        }

        .sent-icon {
          width: 36px;
          height: 36px;
          color: #0f766e;
        }

        .sent-title {
          margin: 0;
          font-size: 22px;
          color: #0f172a;
        }

        .sent-copy {
          margin: 0;
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
        }

        .secondary-button {
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(15, 118, 110, 0.4);
          background: #ffffff;
          color: #0f766e;
          font-weight: 600;
          cursor: pointer;
          padding: 0 16px;
        }

        .secondary-button:hover {
          background: rgba(20, 184, 166, 0.08);
        }

        .delay-1 {
          animation: fade-up 0.6s ease both;
          animation-delay: 0.05s;
        }

        .delay-2 {
          animation: fade-up 0.6s ease both;
          animation-delay: 0.12s;
        }

        .delay-3 {
          animation: fade-up 0.6s ease both;
          animation-delay: 0.18s;
        }

        .delay-4 {
          animation: fade-up 0.6s ease both;
          animation-delay: 0.25s;
        }

        @keyframes card-in {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .card {
            grid-template-columns: 1fr;
          }

          .card-left {
            padding: 32px 28px;
          }

          .card-right {
            padding: 32px 28px;
          }
        }

        @media (max-width: 520px) {
          .forgot-main {
            padding: 28px 16px 48px;
          }

          .card {
            border-radius: 18px;
          }

          .card-title {
            font-size: 26px;
          }
        }
      `}</style>
    </div>
  );
}
