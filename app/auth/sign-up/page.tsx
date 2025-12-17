"use client";

import type React from "react";
import { signUp } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    const { success, error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError);
      setIsLoading(false);
      return;
    }

    if (success) {
      router.push("/auth/sign-up-success");
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-root">

      <main className="auth-main">
        <div className="back-row">
          <Button asChild>
            <Link href="/register" className="back-link">
              <ArrowLeft className="back-icon" />
              Back
            </Link>
          </Button>
        </div>

        <div className="center-wrapper">
          <div className="auth-card">
            <div className="card-header">
              <h1 className="card-title">Create Account</h1>
              <p className="card-desc">
                Sign up for 2D MatTech Global 2026
              </p>
            </div>

            <div className="card-body">
              <form onSubmit={handleSignUp} className="form">
                <div className="form-row">
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="input"
                    required
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="password" className="label">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="input"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="repeat-password" className="label">
                    Repeat Password
                  </label>
                  <input
                    id="repeat-password"
                    type="password"
                    className="input"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>

                {error && <div className="error">{error}</div>}

                <button
                  type="submit"
                  className="primary-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </button>

                <div className="footer-text">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="link">
                    Log In
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
      * {
  box-sizing: border-box;
}

        .auth-root {
          min-height: 100vh;
          background: var(--background, #fbfbfd);
          color: var(--foreground, #1b1b26);
          font-family: Inter, system-ui, -apple-system, sans-serif;
        }

        .auth-header {
          border-bottom: 1px solid var(--border, #e6e6ea);
        }

        .header-inner {
          max-width: 960px;
          margin: 0 auto;
          padding: 18px 20px;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .logo {
          width: 44px;
          height: 44px;
          background: var(--primary, #5a3eb8);
          color: #fff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .title-main {
          font-weight: 700;
          font-size: 16px;
        }

        .title-sub {
          font-size: 12px;
          color: var(--muted-foreground, #6b6b76);
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
  max-width: 420px;
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
      `}</style>
    </div>
  );
}
