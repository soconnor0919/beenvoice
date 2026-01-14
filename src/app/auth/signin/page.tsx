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
  Shield,
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

  async function handleSocialSignIn() {
    console.log("[SIGN IN PAGE] SSO button clicked");
    console.log("[SIGN IN PAGE] authClient:", authClient);
    console.log("[SIGN IN PAGE] authClient.signIn:", authClient.signIn);

    setLoading(true);
    try {
      console.log("[SIGN IN PAGE] Calling authClient.signIn.sso with:", {
        providerId: "authentik",
        callbackURL: callbackUrl,
      });

      const result = await authClient.signIn.sso({
        domain: "beenvoice.soconnor.dev",
        callbackURL: callbackUrl,
      });

      console.log("[SIGN IN PAGE] SSO result:", result);
    } catch (error) {
      console.error("[SIGN IN PAGE] SSO error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      {/* Blob Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="w-[800px] h-[800px] bg-neutral-400/30 dark:bg-neutral-500/20 rounded-full blur-3xl animate-blob"></div>
      </div>

      <Card className="mx-auto h-screen w-full overflow-hidden border-0 shadow-none md:h-auto md:max-w-6xl md:border md:shadow-2xl md:bg-background/80 md:backdrop-blur-xl md:border-border/50 md:rounded-3xl">
        <CardContent className="grid h-full p-0 md:grid-cols-2">
          {/* Hero Section - Hidden on mobile */}
          <div className="bg-primary/5 relative hidden md:flex md:flex-col md:justify-center md:p-12 border-r border-border/50">
            <div className="space-y-8">
              <div className="space-y-4">
                <Logo size="xl" />
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold lg:text-4xl font-heading">
                    Welcome back to your
                    <span className="text-primary italic"> invoicing workspace</span>
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Continue managing your clients and creating professional
                    invoices that get you paid faster.
                  </p>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-xl p-3">
                    <Users className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Client Management</h3>
                    <p className="text-muted-foreground text-sm">
                      Organize and track all your clients in one place
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-xl p-3">
                    <FileText className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Professional Invoices</h3>
                    <p className="text-muted-foreground text-sm">
                      Beautiful templates that get you paid faster
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-xl p-3">
                    <TrendingUp className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Payment Tracking</h3>
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
                <h1 className="text-3xl font-bold font-heading">Sign In</h1>
                <p className="text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full h-11 relative rounded-xl"
                  onClick={handleSocialSignIn}
                  disabled={loading}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Sign in with Authentik
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
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
                      className="h-11 pl-10 bg-background/50 border-border/60 focus:bg-background transition-all"
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
                      className="h-11 pl-10 bg-background/50 border-border/60 focus:bg-background transition-all"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl text-base shadow-lg shadow-primary/20 hover:shadow-primary/30"
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
