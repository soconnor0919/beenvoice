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
  Globe,
  Sparkles,
  BarChart3,
  Clock,
  Rocket,
  Heart,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <AuthRedirect />

      {/* Navigation */}
      <nav className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <div className="hidden items-center space-x-8 md:flex">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="relative container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge
              variant="secondary"
              className="mb-6 border-emerald-200 bg-emerald-100 text-emerald-800"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              100% Free Forever
            </Badge>

            <h1 className="text-foreground mb-6 text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
              Simple Invoicing for
              <span className="block text-emerald-600">Freelancers</span>
            </h1>

            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl leading-relaxed">
              Create professional invoices, manage clients, and track payments.
              Built specifically for freelancers and small businesses—
              <span className="font-semibold text-emerald-600">
                completely free
              </span>
              .
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-lg font-semibold shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/30"
                >
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-slate-300 px-8 py-4 text-lg hover:border-slate-400 hover:bg-slate-50"
                >
                  See Features
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
              {[
                "No credit card required",
                "Setup in 2 minutes",
                "Cancel anytime",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-muted/50 border-y py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              Free invoicing for independent professionals
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge
              variant="secondary"
              className="mb-4 border-blue-200 bg-blue-100 text-blue-800"
            >
              <Zap className="mr-1 h-3 w-3" />
              Supercharged Features
            </Badge>
            <h2 className="text-foreground mb-4 text-5xl font-bold tracking-tight">
              Everything you need to
              <span className="block text-emerald-600">
                invoice professionally
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Simple, powerful features designed specifically for freelancers
              and small businesses.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="group shadow-lg transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <Rocket className="h-6 w-6" />
                </div>
                <h3 className="text-foreground mb-3 text-xl font-bold">
                  Quick Setup
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start creating invoices immediately. No complicated setup or
                  configuration required.
                </p>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Simple client management
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Professional templates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Easy invoice sending
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group shadow-lg transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-foreground mb-3 text-xl font-bold">
                  Payment Tracking
                </h3>
                <p className="text-muted-foreground mb-4">
                  Keep track of invoice status and monitor which clients have
                  paid.
                </p>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Invoice status tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Payment history
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Overdue notifications
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group shadow-lg transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 text-white">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-foreground mb-3 text-xl font-bold">
                  Professional Features
                </h3>
                <p className="text-muted-foreground mb-4">
                  Everything you need to look professional and get paid on time.
                </p>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    PDF generation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Custom tax rates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Professional numbering
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-foreground mb-4 text-5xl font-bold tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Start free, stay free. No hidden fees, no gotchas, no limits on
              your success.
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <Card className="bg-card relative border-2 border-emerald-500 shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-emerald-500 px-6 py-1 text-white">
                  Forever Free
                </Badge>
              </div>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="text-foreground mb-2 text-6xl font-bold">
                    $0
                  </div>
                  <div className="text-muted-foreground">
                    per month, forever
                  </div>
                </div>

                <div className="mb-8 space-y-4 text-left">
                  {[
                    "Unlimited invoices",
                    "Unlimited clients",
                    "Professional templates",
                    "PDF export",
                    "Payment tracking",
                    "Multi-business support",
                    "Line item details",
                    "Free forever",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0 text-emerald-500" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/register">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-lg font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30">
                    Get Started Now
                  </Button>
                </Link>

                <p className="text-muted-foreground mt-4 text-sm">
                  No credit card required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-foreground mb-4 text-5xl font-bold tracking-tight">
              Why freelancers
              <span className="block text-emerald-600">choose BeenVoice</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-foreground mb-3 text-xl font-bold">
                Quick & Simple
              </h3>
              <p className="text-muted-foreground">
                No learning curve. Start creating professional invoices in
                minutes, not hours.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-foreground mb-3 text-xl font-bold">
                Always Free
              </h3>
              <p className="text-muted-foreground">
                No hidden fees, no premium tiers. All features are free for as
                long as you need them.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-foreground mb-3 text-xl font-bold">
                Save Time
              </h3>
              <p className="text-muted-foreground">
                Focus on your work, not paperwork. Automated calculations and
                professional formatting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-teal-800/90"></div>
        <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute right-10 bottom-10 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-5xl font-bold text-white">
              Ready to revolutionize
              <span className="block">your invoicing?</span>
            </h2>
            <p className="mb-8 text-xl text-emerald-100">
              Join thousands of entrepreneurs who&apos;ve already transformed
              their business with BeenVoice. Start your journey
              today&mdash;completely free.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="group bg-white px-8 py-4 text-lg font-semibold text-emerald-700 shadow-xl transition-all duration-300 hover:bg-gray-50 hover:shadow-2xl"
                >
                  Start Your Success Story
                  <Rocket className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 text-emerald-200">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Free forever
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Secure & private
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                2-minute setup
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Logo className="mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">
              Simple invoicing for freelancers. Free, forever.
            </p>
            <div className="text-muted-foreground flex items-center justify-center gap-8 text-sm">
              <Link
                href="/auth/signin"
                className="hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="hover:text-foreground transition-colors"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </div>
            <div className="mt-8 border-t pt-8">
              <p className="text-muted-foreground">
                &copy; 2024 BeenVoice. Built with &hearts; for entrepreneurs.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
