"use client";

import type React from "react";
import { login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { user, error: loginError } = await login(email, password);

    if (loginError) {
      setError(loginError);
      setIsLoading(false);
      return;
    }

    if (user) {
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="login-root">
      <main className="login-main" role="main">
        <div className="back-row">
          <Button asChild>
            <Link href="/register" className="back-link" aria-label="Back to register">
              <ArrowLeft className="back-icon" />
              Back
            </Link>
          </Button>
        </div>

        <div className="center-wrapper">
          <div className="card-shell" role="region" aria-labelledby="login-title">
            <div className="card-header">
              <h1 id="login-title" className="card-title">Log In</h1>
              <p className="card-desc">Access your participant dashboard</p>
            </div>

            <div className="card-body">
              <form onSubmit={handleLogin} className="form" noValidate>
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

                <div className="form-row">
                  <div className="password-label-row">
                    <label htmlFor="password" className="label">Password</label>
                    <Link href="/auth/forgot-password" className="forgot-link">Forgot?</Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                  />
                </div>

                {error && <div className="error" role="alert">{error}</div>}

                <div className="submit-row">
                  <Button type="submit" disabled={isLoading} className="submit-button">
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>
                </div>

                <div className="signup-row">
                  Don&apos;t have an account? <Link href="/auth/sign-up" className="signup-link">Sign Up</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        /* Layout root */
        .login-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--background, #fbfbfd);
          color: var(--foreground, #1b1b26);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        /* Header */
        .login-header {
          border-bottom: 1px solid var(--border, #e6e6ea);
          background: transparent;
        }
        .header-inner {
          max-width: 980px;
          margin: 0 auto;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: var(--primary, #5a3eb8);
          color: var(--primary-foreground, #fff);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .site-title .title-main {
          font-weight: 700;
          font-size: 16px;
          color: var(--foreground, #1b1b26);
        }
        .site-title .title-sub {
          font-size: 12px;
          color: var(--muted-foreground, #6b6b76);
        }

        /* Main area */
        .login-main {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 32px 20px;
          flex: 1;
        }

        .back-row {
          margin-bottom: 18px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--primary, #5a3eb8));
          text-decoration: none;
          font-size: 14px;
          padding: 6px 8px;
          border-radius: 6px;
        }
        .back-link:hover {
          color: var(--primary, #5a3eb8);
          background: rgba(90, 62, 184, 0.04);
        }
        .back-icon { width: 14px; height: 14px; }

        /* Center wrapper */
        .center-wrapper {
          display: flex;
          justify-content: center;
        }

        /* Card */
        .card-shell {
          width: 100%;
          max-width: 420px;
          background: var(--card, #fff);
          border: 1px solid var(--border, #e6e6ea);
          border-radius: 14px;
          box-shadow: 0 12px 30px rgba(23, 23, 29, 0.06);
          overflow: hidden;
        }
        .card-header {
          padding: 26px 28px 18px;
          background: transparent;
        }
        .card-title {
          margin: 0;
          font-size: 22px;
          line-height: 1.08;
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

        /* Form rows */
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
        .password-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .forgot-link {
          font-size: 13px;
          color: var(--primary, #5a3eb8);
          text-decoration: none;
        }
        .forgot-link:hover { text-decoration: underline; }

        /* Inputs */
        .input {
          height: 44px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid var(--border, #e6e6ea);
          background: var(--input, #fbfbfd);
          color: var(--foreground, #1b1b26);
          font-size: 14px;
          outline: none;
          transition: box-shadow 0.18s ease, border-color 0.18s ease, transform 0.08s ease;
        }
        .input::placeholder { color: #9aa0a6; }
        .input:focus {
          border-color: var(--ring, #5a3eb8);
          box-shadow: 0 6px 18px rgba(90,62,184,0.08);
          transform: translateY(-1px);
        }

        /* Error */
        .error {
          color: var(--destructive-foreground, #fff);
          background: var(--destructive, #d9534f);
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 13px;
        }

        /* Submit */
        .submit-row { margin-top: 4px; }
        .submit-button :global(button) {
          /* If user Button component renders a button, target it. But we still style fallback .submit-button below. */
        }
        .submit-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 44px;
          border-radius: 10px;
          background: var(--primary, #5a3eb8);
          color: var(--primary-foreground, #fff);
          font-weight: 600;
          border: none;
          cursor: pointer;
          font-size: 15px;
          transition: filter 0.12s ease, transform 0.08s ease;
        }
        .submit-button[disabled] {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }
        .submit-button:not([disabled]):hover {
          filter: brightness(1.03);
          transform: translateY(-1px);
        }

        /* Signup row */
        .signup-row {
          text-align: center;
          font-size: 13px;
          color: var(--muted-foreground, #6b6b76);
          margin-top: 8px;
        }
        .signup-link {
          color: var(--primary, #5a3eb8);
          text-decoration: none;
          font-weight: 600;
        }
        .signup-link:hover { text-decoration: underline; }

        /* Responsive */
        @media (max-width: 520px) {
          .header-inner { padding: 12px 14px; }
          .card-shell { border-radius: 12px; box-shadow: 0 8px 20px rgba(23,23,29,0.06); }
          .login-main { padding: 24px 14px; }
          .card-header { padding: 20px 18px; }
          .card-body { padding: 16px 18px; }
        }
      `}</style>
    </div>
  );
}
