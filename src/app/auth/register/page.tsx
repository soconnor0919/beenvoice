"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { Logo } from "~/components/branding/logo";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Account created successfully! Please sign in.");
      const signInUrl =
        callbackUrl !== "/dashboard"
          ? `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
          : "/auth/signin";
      router.push(signInUrl);
    } else {
      const error = await res.text();
      toast.error(error || "Failed to create account");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        {/* Logo and Welcome */}
        <div className="auth-header">
          <Logo size="lg" className="mx-auto" />
          <div>
            <h1 className="auth-title">Join beenvoice</h1>
            <p className="auth-subtitle">Create your account to get started</p>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="auth-card">
          <CardHeader className="space-y-1">
            <CardTitle className="auth-card-title">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="auth-form">
              <div className="auth-input-grid">
                <div className="auth-input-group">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="auth-input-icon" />
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      autoFocus
                      className="form-input-with-icon"
                      placeholder="First name"
                    />
                  </div>
                </div>
                <div className="auth-input-group">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="auth-input-icon" />
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="form-input-with-icon"
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </div>
              <div className="auth-input-group">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="auth-input-icon" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input-with-icon"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="auth-input-group">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="auth-input-icon" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="form-input-with-icon"
                    placeholder="Create a password"
                  />
                </div>
                <p className="auth-password-help">
                  Must be at least 6 characters
                </p>
              </div>
              <Button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            <div className="auth-footer-text">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link href="/auth/signin" className="auth-footer-link">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="auth-features">
          <p className="welcome-description">Start invoicing like a pro</p>
          <div className="auth-features-list">
            <span>✓ Free to start</span>
            <span>✓ No credit card</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-container">
          <div className="auth-form-container">
            <div className="auth-header">
              <Logo size="lg" className="mx-auto" />
              <div>
                <h1 className="auth-title">Join beenvoice</h1>
                <p className="auth-subtitle">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
