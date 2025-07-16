"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { Logo } from "~/components/branding/logo";
import { Mail, Lock, ArrowRight } from "lucide-react";

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

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Signed in successfully!");
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="bg-gradient-auth flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Welcome */}
        <div className="space-y-4 text-center">
          <Logo size="lg" className="mx-auto" />
          <div>
            <h1 className="text-foreground text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your beenvoice account
            </p>
          </div>
        </div>

        {/* Sign In Form */}
        <Card className="card-primary">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-xl">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
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
                    autoFocus
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
                    className="form-input-with-icon"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Don&apos;t have an account?{" "}
              </span>
              <Link href="/auth/register" className="nav-link-brand">
                Create one now
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="space-y-4 text-center">
          <p className="welcome-description">
            Simple invoicing for freelancers and small businesses
          </p>
          <div className="welcome-feature-list">
            <span>✓ Easy client management</span>
            <span>✓ Professional invoices</span>
            <span>✓ Payment tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-gradient-auth flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-4 text-center">
              <Logo size="lg" className="mx-auto" />
              <div>
                <h1 className="text-foreground text-2xl font-bold">
                  Welcome back
                </h1>
                <p className="text-muted-foreground mt-2">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
