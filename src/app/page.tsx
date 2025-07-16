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
    <div className="bg-page-gradient min-h-screen">
      <AuthRedirect />

      {/* Navigation */}
      <nav className="nav-sticky">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between sm:h-16">
            <Logo />
            <div className="hidden items-center space-x-6 md:flex">
              <a href="#features" className="nav-link">
                Features
              </a>
              <a href="#pricing" className="nav-link">
                Pricing
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Sign In</span>
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="btn-brand-primary">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-hero-gradient relative overflow-hidden px-4 pt-12 pb-16 sm:pt-20">
        {/* Background decoration */}
        <div className="hero-overlay"></div>
        <div className="hero-orb-1"></div>
        <div className="hero-orb-2"></div>
        <div className="hero-orb-3"></div>
        <div className="relative container mx-auto text-center">
          <div className="mx-auto max-w-4xl">
            <Badge className="badge-brand mb-4 sm:mb-6">
              <Sparkles className="mr-1 h-3 w-3" />
              Free Forever
            </Badge>

            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:mb-6 sm:text-6xl lg:text-7xl">
              Simple Invoicing for
              <span className="block text-emerald-50">Freelancers</span>
            </h1>

            <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-emerald-50/90 sm:mb-8 sm:text-xl">
              Create professional invoices, manage clients, and track payments.
              Built for freelancers and small businesses—
              <span className="font-semibold text-white">completely free</span>.
            </p>

            <div className="btn-group">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="btn-brand-secondary group w-full px-6 py-3 text-base font-semibold shadow-xl transition-all duration-300 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="group w-full border-white/30 px-6 py-3 text-base text-white hover:bg-white/10 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                >
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-2 text-sm text-emerald-50/80 sm:mt-12 sm:flex-row sm:gap-6">
              {[
                "No credit card required",
                "Setup in 2 minutes",
                "Free forever",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-100" />
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
        className="bg-features-gradient relative overflow-hidden py-16 sm:py-24"
      >
        {/* Floating background elements */}
        <div className="floating-decoration-1"></div>
        <div className="floating-decoration-2"></div>
        <div className="relative container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <Badge className="badge-features mb-4">
              <Zap className="mr-1 h-3 w-3" />
              Features
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
              Everything you need to
              <span className="text-brand-gradient block">get paid</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 sm:text-xl dark:text-slate-300">
              Simple, powerful features for freelancers and small businesses.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="card-floating group">
              <CardContent className="p-6 sm:p-8">
                <div className="icon-bg-brand mb-4">
                  <Rocket className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                  Quick Setup
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-300">
                  Start creating invoices immediately. No complicated setup
                  required.
                </p>
                <ul className="feature-list">
                  <li className="feature-item">
                    <Check className="feature-check" />
                    Simple client management
                  </li>
                  <li className="feature-item">
                    <Check className="feature-check" />
                    Professional templates
                  </li>
                  <li className="feature-item">
                    <Check className="feature-check" />
                    Easy invoice sending
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="card-floating group">
              <CardContent className="p-6 sm:p-8">
                <div className="icon-bg-blue mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                  Payment Tracking
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-300">
                  Keep track of invoice status and monitor payments.
                </p>
                <ul className="feature-list">
                  <li className="feature-item">
                    <Check className="feature-check" />
                    Invoice status tracking
                  </li>
                  <li className="feature-item">
                    <Check className="feature-check" />
                    Payment history
                  </li>
                  <li className="feature-item">
                    <Check className="feature-check" />
                    Overdue notifications
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="card-floating group">
              <CardContent className="p-6 sm:p-8">
                <div className="icon-bg-purple mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                  Professional Features
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-300">
                  Professional features to help you get paid on time.
                </p>
                <ul className="feature-list">
                  <li className="feature-item">
                    <Check className="feature-check" />
                    PDF generation
                  </li>
                  <li className="feature-item">
                    <Check className="feature-check" />
                    Custom tax rates
                  </li>
                  <li className="feature-item">
                    <Check className="feature-check" />
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
        className="bg-features-gradient relative overflow-hidden py-16 sm:py-24"
      >
        {/* Floating background elements */}
        <div className="floating-decoration-1"></div>
        <div className="floating-decoration-2"></div>
        <div className="relative container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
              Simple pricing
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 sm:text-xl dark:text-slate-300">
              Start free, stay free. No hidden fees or limits.
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <Card className="relative border-2 border-emerald-500 bg-white/90 shadow-2xl backdrop-blur-sm dark:border-emerald-400 dark:bg-slate-800/90">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="badge-success px-6 py-1">Forever Free</Badge>
              </div>
              <CardContent className="p-6 text-center sm:p-8">
                <div className="mb-6">
                  <div className="text-brand-gradient mb-2 text-5xl font-bold sm:text-6xl">
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
                  <Button
                    variant="brand"
                    className="w-full py-3 text-base font-semibold sm:text-lg"
                  >
                    Get Started
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
      <section className="bg-features-gradient relative overflow-hidden py-16 sm:py-24">
        {/* Floating background elements */}
        <div className="floating-decoration-1"></div>
        <div className="floating-decoration-2"></div>
        <div className="relative container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
              Why choose
              <span className="text-brand-gradient block">BeenVoice</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="icon-bg-emerald mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                Quick & Simple
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                No learning curve. Start creating invoices in minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="icon-bg-blue mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                Always Free
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                No hidden fees, no premium tiers. All features are free.
              </p>
            </div>
            <div className="text-center">
              <div className="icon-bg-purple mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                Save Time
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Focus on your work, not paperwork. Automated calculations and
                formatting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-hero-gradient relative overflow-hidden py-16 sm:py-24">
        <div className="hero-overlay"></div>
        <div className="hero-orb-1"></div>
        <div className="hero-orb-2"></div>
        <div className="hero-orb-3"></div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-3xl font-bold text-white sm:mb-6 sm:text-4xl lg:text-5xl">
              Ready to get started?
            </h2>
            <p className="mb-6 text-lg text-emerald-50/90 sm:mb-8 sm:text-xl">
              Join thousands of freelancers already using BeenVoice. Start
              today—completely free.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="btn-brand-secondary group w-full px-6 py-3 text-base font-semibold shadow-xl transition-all duration-300 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                >
                  Start Free Today
                  <Rocket className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 text-emerald-50/80 sm:mt-8 sm:flex-row sm:gap-6">
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
      <footer className="bg-features-gradient border-t py-8 sm:py-12 dark:border-slate-700">
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
                Register
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
            <div className="mt-6 border-t border-slate-200 pt-6 sm:mt-8 sm:pt-8 dark:border-slate-700">
              <p className="text-sm text-slate-600 sm:text-base dark:text-slate-400">
                &copy; 2025 Sean O'Connor.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
