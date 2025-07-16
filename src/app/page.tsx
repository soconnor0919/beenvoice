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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
      <AuthRedirect />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between sm:h-16">
            <Logo />
            <div className="hidden items-center space-x-6 md:flex">
              <a
                href="#features"
                className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30"
                >
                  <span className="hidden sm:inline">Get Started Free</span>
                  <span className="sm:hidden">Start Free</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50 px-4 pt-12 pb-16 sm:pt-20 dark:from-slate-800 dark:via-emerald-900/20 dark:to-teal-900/20">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-emerald-400/20 to-blue-400/20 blur-3xl dark:from-emerald-500/10 dark:to-blue-500/10"></div>
          <div className="absolute top-32 right-1/4 h-80 w-80 rounded-full bg-gradient-to-r from-teal-400/20 to-emerald-400/20 blur-3xl dark:from-teal-500/10 dark:to-emerald-500/10"></div>
          <div className="absolute bottom-0 left-1/2 h-64 w-64 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl dark:from-blue-500/10 dark:to-purple-500/10"></div>
        </div>
        <div className="relative container mx-auto text-center">
          <div className="mx-auto max-w-4xl">
            <Badge
              variant="secondary"
              className="mb-4 border-emerald-200 bg-emerald-100 text-emerald-800 sm:mb-6 dark:border-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              100% Free Forever
            </Badge>

            <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:mb-6 sm:text-6xl lg:text-7xl dark:text-slate-100">
              Simple Invoicing for
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Freelancers
              </span>
            </h1>

            <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:mb-8 sm:text-xl dark:text-slate-300">
              Create professional invoices, manage clients, and track payments.
              Built specifically for freelancers and small businesses—
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text font-semibold text-transparent">
                completely free
              </span>
              .
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="group w-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-base font-semibold shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 hover:shadow-2xl hover:shadow-emerald-500/40 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                >
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="group w-full border-emerald-200 bg-white/50 px-6 py-3 text-base text-emerald-700 backdrop-blur-sm hover:border-emerald-300 hover:bg-emerald-50 sm:w-auto sm:px-8 sm:py-4 sm:text-lg dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
                >
                  See Features
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-2 text-sm text-slate-600 sm:mt-12 sm:flex-row sm:gap-6 dark:text-slate-400">
              {[
                "No credit card required",
                "Setup in 2 minutes",
                "Cancel anytime",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
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
        className="bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/50 py-16 sm:py-24 dark:from-slate-900 dark:via-slate-800/50 dark:to-emerald-900/20"
      >
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <Badge
              variant="secondary"
              className="mb-4 border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              <Zap className="mr-1 h-3 w-3" />
              Supercharged Features
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
              Everything you need to
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                invoice professionally
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 sm:text-xl dark:text-slate-300">
              Simple, powerful features designed specifically for freelancers
              and small businesses.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="group bg-white/70 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-xl dark:bg-slate-800/50 dark:hover:bg-slate-800/70">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                  <Rocket className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                  Quick Setup
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-300">
                  Start creating invoices immediately. No complicated setup or
                  configuration required.
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
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
            <Card className="group bg-white/70 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-xl dark:bg-slate-800/50 dark:hover:bg-slate-800/70">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                  Payment Tracking
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-300">
                  Keep track of invoice status and monitor which clients have
                  paid.
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
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
            <Card className="group bg-white/70 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-xl dark:bg-slate-800/50 dark:hover:bg-slate-800/70">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                  Professional Features
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-300">
                  Everything you need to look professional and get paid on time.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
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
      <section
        id="pricing"
        className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 py-16 sm:py-24 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-blue-900/20"
      >
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 sm:text-xl dark:text-slate-300">
              Start free, stay free. No hidden fees, no gotchas, no limits on
              your success.
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <Card className="relative border-2 border-emerald-500 bg-white/90 shadow-2xl backdrop-blur-sm dark:border-emerald-400 dark:bg-slate-800/90">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-emerald-500 px-6 py-1 text-white dark:bg-emerald-600">
                  Forever Free
                </Badge>
              </div>
              <CardContent className="p-6 text-center sm:p-8">
                <div className="mb-6">
                  <div className="mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
                    $0
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    per month, forever
                  </div>
                </div>

                <div className="mb-6 space-y-3 text-left sm:mb-8 sm:space-y-4">
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
                      <span className="text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/register">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-base font-semibold shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-500/40 sm:text-lg">
                    Get Started Now
                  </Button>
                </Link>

                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  No credit card required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 py-16 sm:py-24 dark:from-slate-900 dark:via-emerald-900/10 dark:to-teal-900/10">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
              Why freelancers
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                choose BeenVoice
              </span>
            </h2>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                Quick & Simple
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                No learning curve. Start creating professional invoices in
                minutes, not hours.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                Always Free
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                No hidden fees, no premium tiers. All features are free for as
                long as you need them.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                Save Time
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Focus on your work, not paperwork. Automated calculations and
                professional formatting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-700 py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/95 via-teal-600/95 to-blue-700/95"></div>
        <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-gradient-to-r from-white/20 to-emerald-300/20 blur-3xl"></div>
        <div className="absolute right-10 bottom-10 h-80 w-80 rounded-full bg-gradient-to-r from-teal-300/15 to-blue-300/15 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-400/10 to-teal-400/10 blur-3xl"></div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-3xl font-bold text-white sm:mb-6 sm:text-4xl lg:text-5xl">
              Ready to revolutionize
              <span className="block">your invoicing?</span>
            </h2>
            <p className="mb-6 text-lg text-emerald-100 sm:mb-8 sm:text-xl">
              Join thousands of entrepreneurs who&apos;ve already transformed
              their business with BeenVoice. Start your journey
              today&mdash;completely free.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="group w-full bg-white px-6 py-3 text-base font-semibold text-emerald-700 shadow-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-white hover:to-emerald-50 hover:shadow-2xl sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                >
                  Start Your Success Story
                  <Rocket className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 text-emerald-200 sm:mt-8 sm:flex-row sm:gap-6">
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
      <footer className="border-t bg-gradient-to-br from-slate-50 to-emerald-50/30 py-8 sm:py-12 dark:border-slate-700 dark:from-slate-900 dark:to-emerald-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Logo className="mx-auto mb-4" />
            <p className="mb-4 text-sm text-slate-600 sm:mb-6 sm:text-base dark:text-slate-400">
              Simple invoicing for freelancers. Free, forever.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 sm:gap-6 dark:text-slate-400">
              <Link
                href="/auth/signin"
                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Pricing
              </a>
            </div>
            <div className="mt-6 border-t pt-6 sm:mt-8 sm:pt-8">
              <p className="text-sm text-slate-600 sm:text-base dark:text-slate-400">
                &copy; 2024 BeenVoice. Built with ♥ for entrepreneurs.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
