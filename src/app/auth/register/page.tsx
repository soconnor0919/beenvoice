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
    <div className="floating-orbs flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Welcome */}
        <div className="space-y-4 text-center">
          <Logo size="lg" className="mx-auto" />
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              Join beenvoice
            </h1>
            <p className="text-muted-foreground mt-2">
              Create your account to get started
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="card-primary">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-xl">
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="form-icon-left" />
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
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="form-icon-left" />
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
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="form-icon-left" />
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="form-icon-left" />
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
                <p className="text-muted-foreground text-xs">
                  Must be at least 6 characters
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
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
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link href="/auth/signin" className="nav-link-brand">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="space-y-4 text-center">
          <p className="welcome-description">Start invoicing like a pro</p>
          <div className="welcome-feature-list">
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
        <div className="floating-orbs flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-4 text-center">
              <Logo size="lg" className="mx-auto" />
              <div>
                <h1 className="text-foreground text-2xl font-bold">
                  Join beenvoice
                </h1>
                <p className="text-muted-foreground mt-2">Loading...</p>
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
