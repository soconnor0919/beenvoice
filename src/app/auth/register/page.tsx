"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { Logo } from "~/components/branding/logo";
import { LegalModal } from "~/components/ui/legal-modal";
import { Mail, Lock, ArrowRight, User, Clock, Rocket, Zap } from "lucide-react";

function RegisterForm() {
  const router = useRouter();

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
        name: `${firstName} ${lastName}`,
        email,
        password,
      }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Account created successfully! Please sign in.");
      router.push("/auth/signin");
    } else {
      const data = (await res.json()) as { error?: string };
      toast.error(data.error ?? "Registration failed");
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="mx-auto h-screen w-full overflow-hidden border-0 shadow-none md:h-auto md:max-w-6xl md:border md:shadow-lg">
        <CardContent className="grid h-full p-0 md:grid-cols-2">
          {/* Hero Section - Hidden on mobile */}
          <div className="bg-muted relative hidden md:flex md:flex-col md:justify-center md:p-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Logo size="xl" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold lg:text-4xl">
                    Start your
                    <span className="text-primary"> invoicing journey</span>
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Join thousands of freelancers and small businesses who trust
                    beenvoice to manage their invoicing and get paid faster.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Rocket className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Quick Setup</h3>
                    <p className="text-muted-foreground text-sm">
                      Get started in minutes with our intuitive setup wizard
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Zap className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Fast Payments</h3>
                    <p className="text-muted-foreground text-sm">
                      Professional invoices that get you paid 3x faster
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Clock className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Time Tracking</h3>
                    <p className="text-muted-foreground text-sm">
                      Track time and convert it to accurate invoices instantly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="flex flex-col justify-center p-6 md:p-12">
            <div className="mx-auto w-full max-w-sm space-y-6">
              {/* Mobile Logo */}
              <div className="flex justify-center md:hidden">
                <Logo size="lg" />
              </div>

              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground">
                  Supercharge your invoicing today
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        autoFocus
                        className="h-11 pl-10"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="h-11 pl-10"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 pl-10"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pl-10"
                      placeholder="Create a strong password"
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Must be at least 8 characters long
                  </p>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  href="/auth/signin"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </a>
              </div>

              <div className="text-muted-foreground text-center text-xs leading-relaxed">
                By creating an account, you agree to our{" "}
                <LegalModal
                  type="terms"
                  trigger={
                    <span className="text-primary inline cursor-pointer hover:underline">
                      Terms of Service
                    </span>
                  }
                />{" "}
                and{" "}
                <LegalModal
                  type="privacy"
                  trigger={
                    <span className="text-primary inline cursor-pointer hover:underline">
                      Privacy Policy
                    </span>
                  }
                />
                .
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
