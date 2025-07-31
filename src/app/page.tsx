import Link from "next/link";
import { Button } from "~/components/ui/button";
import { AuthRedirect } from "~/components/AuthRedirect";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Logo } from "~/components/branding/logo";
import {
  ArrowRight,
  Check,
  Zap,
  Shield,
  BarChart3,
  Rocket,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <AuthRedirect />

      {/* Navigation */}
      <nav className="bg-background border-border sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between sm:h-16">
            <Logo />
            <div className="hidden items-center space-x-6 md:flex">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Sign In</span>
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" variant="default">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-background relative overflow-hidden px-4 pt-12 pb-16 sm:pt-20">
        <div className="relative container mx-auto text-center">
          <div className="mx-auto max-w-4xl">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 border sm:mb-6">
              <Zap className="mr-1 h-3 w-3" />
              Free Forever
            </Badge>

            <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:mb-6 sm:text-6xl lg:text-7xl">
              Simple Invoicing for
              <span className="text-primary block">Freelancers</span>
            </h1>

            <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg leading-relaxed sm:mb-8 sm:text-xl">
              Create professional invoices, manage clients, and track payments.
              Built for freelancers and small businesses—
              <span className="text-foreground font-semibold">
                completely free
              </span>
              .
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  variant="default"
                  className="group w-full px-6 py-3 text-base font-semibold sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="group w-full px-6 py-3 text-base sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                >
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>

            <div className="text-muted-foreground mt-8 flex flex-col items-center justify-center gap-2 text-sm sm:mt-12 sm:flex-row sm:gap-6">
              {[
                "No credit card required",
                "Setup in 2 minutes",
                "Free forever",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="text-primary h-4 w-4" />
                  <span className="text-center">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-muted/20 relative overflow-hidden py-16 sm:py-24"
      >
        <div className="relative container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 border">
              <Zap className="mr-1 h-3 w-3" />
              Features
            </Badge>
            <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Everything you need to
              <span className="text-primary block">get paid</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl">
              Simple, powerful features for freelancers and small businesses.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="bg-card border-border hover:border-primary/20 border transition-all">
              <CardContent className="p-6 sm:p-8">
                <div className="bg-primary/10 text-primary mb-4 inline-flex  p-3">
                  <Rocket className="h-6 w-6" />
                </div>
                <h3 className="text-foreground mb-3 text-xl font-bold">
                  Quick Setup
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start creating invoices immediately. No complicated setup
                  required.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Simple client management
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Professional templates
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Easy invoice sending
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-card border-border hover:border-primary/20 border transition-all">
              <CardContent className="p-6 sm:p-8">
                <div className="bg-primary/10 text-primary mb-4 inline-flex  p-3">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-foreground mb-3 text-xl font-bold">
                  Payment Tracking
                </h3>
                <p className="text-muted-foreground mb-4">
                  Keep track of invoice status and monitor payments.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Invoice status tracking
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Payment history
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Overdue notifications
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-card border-border hover:border-primary/20 border transition-all">
              <CardContent className="p-6 sm:p-8">
                <div className="bg-primary/10 text-primary mb-4 inline-flex  p-3">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-foreground mb-3 text-xl font-bold">
                  Professional Features
                </h3>
                <p className="text-muted-foreground mb-4">
                  Professional features to help you get paid on time.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      PDF generation
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Custom tax rates
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      Professional numbering
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="bg-background relative overflow-hidden py-16 sm:py-24"
      >
        <div className="relative container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Simple pricing
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl">
              Start free, stay free. No hidden fees or limits.
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <Card className="bg-card border-primary border-2">
              <div className="bg-primary/10 text-primary border-primary/20 mx-auto -mt-3 w-fit border px-6 py-1 text-sm font-medium">
                Forever Free
              </div>
              <CardContent className="p-6 sm:p-8">
                <div className="mb-6 text-center">
                  <div className="text-foreground mb-2 text-4xl font-bold sm:text-5xl">
                    $0
                  </div>
                  <p className="text-muted-foreground">
                    Forever. No credit card required.
                  </p>
                </div>

                <ul className="mb-8 space-y-3">
                  {[
                    "Unlimited invoices",
                    "Client management",
                    "PDF generation",
                    "Payment tracking",
                    "Professional templates",
                    "Custom tax rates",
                    "Email support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="text-primary h-5 w-5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth/register" className="block">
                  <Button className="w-full" size="lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary relative overflow-hidden py-16 sm:py-24">
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-primary-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to get started?
          </h2>
          <p className="text-primary-foreground/80 mx-auto mb-8 max-w-2xl text-lg sm:text-xl">
            Join thousands of freelancers who trust beenvoice for their
            invoicing needs.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/register">
              <Button
                variant="secondary"
                size="lg"
                className="group w-full px-6 py-3 text-base font-semibold sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-border border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="text-muted-foreground text-sm">
                © 2024 beenvoice. Built for freelancers.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/auth/signin"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
