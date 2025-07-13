import Link from "next/link";
import { Button } from "~/components/ui/button";
import { AuthRedirect } from "~/components/AuthRedirect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Logo } from "~/components/logo";
import {
  Users,
  FileText,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <AuthRedirect />
      {/* Header */}
      <header className="border-b border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
            Simple Invoicing for
            <span className="text-green-600"> Freelancers</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Create professional invoices, manage clients, and get paid faster
            with beenvoice. The invoicing app that works as hard as you do.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/auth/register">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Everything you need to invoice like a pro
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Powerful features designed for freelancers and small businesses
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="mb-4 h-12 w-12 text-green-600" />
                <CardTitle>Client Management</CardTitle>
                <CardDescription>
                  Keep all your client information organized in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Store contact details and addresses
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Track client history and invoices
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Search and filter clients easily
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <FileText className="mb-4 h-12 w-12 text-green-600" />
                <CardTitle>Professional Invoices</CardTitle>
                <CardDescription>
                  Create beautiful, detailed invoices with line items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Add multiple line items with dates
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Automatic calculations and totals
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Professional invoice numbering
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <DollarSign className="mb-4 h-12 w-12 text-green-600" />
                <CardTitle>Payment Tracking</CardTitle>
                <CardDescription>
                  Monitor invoice status and track payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Track draft, sent, paid, and overdue status
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    View outstanding amounts at a glance
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Payment history and analytics
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-16 text-4xl font-bold text-gray-900">
            Why choose beenvoice?
          </h2>

          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Zap className="mt-1 h-8 w-8 text-green-600" />
                <div className="text-left">
                  <h3 className="mb-2 text-xl font-semibold">Lightning Fast</h3>
                  <p className="text-gray-600">
                    Create invoices in seconds, not minutes. Our streamlined
                    interface gets you back to work faster.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Shield className="mt-1 h-8 w-8 text-green-600" />
                <div className="text-left">
                  <h3 className="mb-2 text-xl font-semibold">
                    Secure & Private
                  </h3>
                  <p className="text-gray-600">
                    Your data is encrypted and secure. We never share your
                    information with third parties.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Star className="mt-1 h-8 w-8 text-green-600" />
                <div className="text-left">
                  <h3 className="mb-2 text-xl font-semibold">
                    Professional Quality
                  </h3>
                  <p className="text-gray-600">
                    Generate invoices that look professional and build trust
                    with your clients.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="mt-1 h-8 w-8 text-green-600" />
                <div className="text-left">
                  <h3 className="mb-2 text-xl font-semibold">Save Time</h3>
                  <p className="text-gray-600">
                    Automated calculations, templates, and client management
                    save you hours every month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 px-4 py-20">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Ready to get started?
          </h2>
          <p className="mb-8 text-xl text-green-100">
            Join thousands of freelancers who trust beenvoice for their
            invoicing needs.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-green-200">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-12 text-white">
        <div className="container mx-auto text-center">
          <Logo className="mx-auto mb-4" />
          <p className="mb-4 text-gray-400">
            Simple invoicing for freelancers and small businesses
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <Link href="/auth/signin" className="hover:text-white">
              Sign In
            </Link>
            <Link href="/auth/register" className="hover:text-white">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
