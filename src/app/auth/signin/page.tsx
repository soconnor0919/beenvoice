"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "~/lib/auth-client";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { Logo } from "~/components/branding/logo";
import { LegalModal } from "~/components/ui/legal-modal";
import {
  Mail,
  Lock,
  ArrowRight,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Invalid email or password");
    } else {
      toast.success("Signed in successfully!");
      router.push(callbackUrl);
      router.refresh();
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
                <Logo size="xl" />
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold lg:text-4xl">
                    Welcome back to your
                    <span className="text-primary"> invoicing workspace</span>
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Continue managing your clients and creating professional
                    invoices that get you paid faster.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Users className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Client Management</h3>
                    <p className="text-muted-foreground text-sm">
                      Organize and track all your clients in one place
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <FileText className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Professional Invoices</h3>
                    <p className="text-muted-foreground text-sm">
                      Beautiful templates that get you paid faster
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <TrendingUp className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Payment Tracking</h3>
                    <p className="text-muted-foreground text-sm">
                      Monitor your income with real-time insights
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign In Form */}
          <div className="flex flex-col justify-center p-6 md:p-12">
            <div className="mx-auto w-full max-w-sm space-y-6">
              {/* Mobile Logo */}
              <div className="flex justify-center md:hidden">
                <Logo size="lg" />
              </div>

              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-2xl font-bold">Sign In</h1>
                <p className="text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
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
                      autoFocus
                      className="h-11 pl-10"
                      placeholder="m@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="/auth/forgot-password"
                      className="text-primary text-sm hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pl-10"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/auth/register"
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </a>
              </div>

              <div className="text-muted-foreground text-center text-xs leading-relaxed">
                By signing in, you agree to our{" "}
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

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
