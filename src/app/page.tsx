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
} from "lucide-react";
import { brand } from "~/lib/branding";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AuthRedirect />

      {/* Blob Background for Homepage */}
      <div className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="animate-blob h-[800px] w-[800px] rounded-full bg-neutral-400/30 blur-3xl dark:bg-neutral-500/20"></div>
      </div>

      {/* Navigation */}
      <nav className="border-border/60 bg-background/80 fixed top-4 right-4 left-4 z-50 m-4 rounded-2xl border backdrop-blur-md">
        <div className="mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <div className="hidden items-center space-x-8 md:flex">
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
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" variant="default" className="rounded-xl px-6">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-8 rounded-full border px-4 py-1 text-sm">
              <Zap className="mr-2 h-3.5 w-3.5" />
              Completely Free for Everyone
            </Badge>

            <h1 className="text-foreground font-heading mb-8 text-6xl leading-tight font-bold tracking-tight sm:text-7xl lg:text-8xl">
              {brand.name} <br />
              <span className="text-primary italic">Beautifully Simple.</span>
            </h1>

            <p className="text-muted-foreground mx-auto mb-12 max-w-2xl font-sans text-xl leading-relaxed">
              {brand.tagline}
            </p>

            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="shadow-primary/20 hover:shadow-primary/30 h-14 rounded-2xl px-10 text-lg shadow-xl transition-all duration-300 hover:shadow-2xl"
                >
                  Start For Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border/50 bg-background/50 hover:bg-background/80 h-14 rounded-2xl px-10 text-lg backdrop-blur-sm"
                >
                  Learn More
                </Button>
              </a>
            </div>

            <div className="text-muted-foreground/80 mt-16 flex flex-col items-center justify-center gap-2 text-sm sm:flex-row sm:gap-8">
              <div className="flex items-center gap-2">
                <Check className="text-primary h-4 w-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-primary h-4 w-4" />
                <span>Setup in 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-primary h-4 w-4" />
                <span>Free forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-20 text-center">
            <h2 className="text-foreground font-heading mb-6 text-4xl font-bold sm:text-5xl">
              Everything you need to{" "}
              <span className="text-primary italic">thrive</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Powerful features wrapped in a calm, focused interface.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Rocket,
                title: "Quick Setup",
                description:
                  "Start creating invoices immediately. No complicated setup required.",
                items: [
                  "Simple client management",
                  "Professional templates",
                  "Easy invoice sending",
                ],
              },
              {
                icon: BarChart3,
                title: "Payment Tracking",
                description:
                  "Keep track of invoice status and monitor your payments effortlessly.",
                items: [
                  "Invoice status tracking",
                  "Payment history",
                  "Overdue notifications",
                ],
              },
              {
                icon: Shield,
                title: "Professional Features",
                description:
                  "Tools that make you look professional and get you paid faster.",
                items: [
                  "PDF generation",
                  "Custom tax rates",
                  "Professional numbering",
                ],
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="group border-border/40 bg-background/60 backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div className="bg-primary/10 text-primary mb-6 inline-flex rounded-2xl p-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-foreground font-heading mb-4 text-2xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.items.map((item, j) => (
                      <li
                        key={j}
                        className="text-foreground/80 flex items-center gap-3 text-sm"
                      >
                        <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative overflow-hidden py-24">
        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <h2 className="font-heading mb-6 text-5xl font-bold">
              Simple Pricing
            </h2>
            <p className="text-muted-foreground text-xl">
              Focus on your work, not on fees.
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <Card className="border-primary/50 shadow-primary/5 bg-background/80 relative overflow-visible shadow-2xl backdrop-blur-xl">
              <div className="bg-primary text-primary-foreground absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-6 py-1.5 text-sm font-medium shadow-lg">
                Forever Free
              </div>
              <CardContent className="p-10 text-center">
                <div className="font-heading mb-2 text-6xl font-bold">$0</div>
                <div className="text-muted-foreground mb-8">
                  No credit card required.
                </div>

                <div className="mb-10 space-y-4 pl-8 text-left">
                  {[
                    "Unlimited Invoices",
                    "Unlimited Clients",
                    "PDF Downloads",
                    "Payment Tracking",
                    "Email Support",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="text-primary h-5 w-5 shrink-0" />
                      <span className="text-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/register" className="block">
                  <Button size="lg" className="h-12 w-full rounded-xl text-lg">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border/40 bg-background/50 mt-12 border-t py-12 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-muted-foreground text-sm">
              © 2024 beenvoice
            </span>
          </div>
          <div className="text-muted-foreground flex gap-8 text-sm">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
