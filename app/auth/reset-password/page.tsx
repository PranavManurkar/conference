"use client";

import type React from "react";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmPasswordReset } from "@/lib/auth";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const linkMissing = !uid || !token;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (linkMissing) {
      setError("This reset link is missing required information.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Please enter a password with at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("loading");
    const { success, error: requestError } = await confirmPasswordReset(uid, token, password);

    if (!success) {
      setError(requestError || "Unable to reset your password.");
      setStatus("idle");
      return;
    }

    setStatus("success");
  };

  return (
    <main className="auth-main" role="main">
      <div className="back-row">
        <Button asChild>
          <Link href="/auth/login" className="back-link">
            <ArrowLeft className="back-icon" />
            Back to login
          </Link>
        </Button>
      </div>

      <div className="center-wrapper">
        <div className="auth-card" role="region" aria-labelledby="reset-title">
          <div className="card-header">
            <h1 id="reset-title" className="card-title">Set a new password</h1>
            <p className="card-desc">
              Choose a strong password to protect your 2DMTG Conference account.
            </p>
          </div>

          <div className="card-body">
            {status === "success" ? (
              <div className="sent-panel" aria-live="polite">
                <CheckCircle className="sent-icon" />
                <h2 className="sent-title">Password updated</h2>
                <p className="sent-copy">Your password has been reset. You can now log in.</p>
                <Link href="/auth/login" className="link">
                  Go to login
                </Link>
              </div>
            ) : (
              <form className="form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <label htmlFor="password" className="label">
                    New password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="input"
                    placeholder="Enter a new password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="confirmPassword" className="label">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="input"
                    placeholder="Repeat your new password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </div>

                {linkMissing && (
                  <div className="error" role="alert">
                    This reset link is incomplete. Please request a new link.
                  </div>
                )}

                {error && !linkMissing && (
                  <div className="error" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="primary-button"
                  disabled={status === "loading" || linkMissing}
                >
                  {status === "loading" ? "Updating password..." : "Reset password"}
                </button>

                <div className="footer-text">
                  Need a new link?{" "}
                  <Link href="/auth/forgot-password" className="link">
                    Request again
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ResetPasswordFallback() {
  return (
    <main className="auth-main" role="main">
      <div className="center-wrapper">
        <div className="auth-card" role="region" aria-labelledby="reset-loading-title">
          <div className="card-header">
            <h1 id="reset-loading-title" className="card-title">Set a new password</h1>
            <p className="card-desc">Loading reset form...</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-root">
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordContent />
      </Suspense>

      <style jsx>{`
        .auth-root {
          min-height: 100vh;
          background: var(--background, #fbfbfd);
          color: var(--foreground, #1b1b26);
          font-family: Inter, system-ui, -apple-system, sans-serif;
        }

        .auth-main {
          max-width: 960px;
          margin: 0 auto;
          padding: 32px 20px;
        }

        .back-row {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          margin-bottom: 20px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          background: var(--primary);
          color: var(--primary-foreground);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: background-color 0.2s ease, transform 0.15s ease;
        }

        .back-link:hover {
          background: color-mix(in oklch, var(--primary) 85%, black);
          transform: translateY(-1px);
        }

        .back-link:active {
          transform: translateY(0);
        }

        .back-icon {
          width: 16px;
          height: 16px;
          stroke-width: 2;
        }

        .center-wrapper {
          display: flex;
          justify-content: center;
        }

        .auth-card {
          width: 100%;
          max-width: 460px;
          padding: 0;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid var(--border, #e6e6ea);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
        }

        .card-header {
          padding: 24px 26px 16px;
        }

        .card-title {
          margin: 0;
          font-size: 22px;
        }

        .card-desc {
          font-size: 13px;
          color: var(--muted-foreground, #6b6b76);
          margin-top: 6px;
        }

        .card-body {
          padding: 20px 26px 26px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .label {
          font-size: 13px;
          font-weight: 500;
          color: var(--foreground, #1b1b26);
        }

        .input {
          width: 100%;
          height: 46px;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid var(--border, #e6e6ea);
          background: var(--input, #f5f5f7);
          font-size: 14px;
          color: var(--foreground, #1b1b26);
        }

        .input::placeholder {
          color: #9a9aa2;
        }

        .input:focus {
          outline: none;
          border-color: var(--primary, #0033cc);
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(0, 51, 204, 0.15);
        }

        .primary-button {
          height: 44px;
          border-radius: 10px;
          border: none;
          background: var(--primary, #5a3eb8);
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        .primary-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .error {
          background: var(--destructive, #d9534f);
          color: #fff;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 13px;
        }

        .footer-text {
          text-align: center;
          font-size: 13px;
          color: var(--muted-foreground, #6b6b76);
        }

        .link {
          color: var(--primary, #5a3eb8);
          font-weight: 600;
          text-decoration: none;
        }

        .link:hover {
          text-decoration: underline;
        }

        .sent-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
        }

        .sent-icon {
          width: 40px;
          height: 40px;
          color: var(--primary, #5a3eb8);
        }

        .sent-title {
          margin: 0;
          font-size: 18px;
        }

        .sent-copy {
          margin: 0;
          font-size: 13px;
          color: var(--muted-foreground, #6b6b76);
        }
      `}</style>
    </div>
  );
}
