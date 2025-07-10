import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Logo } from "~/components/logo";
import { 
  Users, 
  FileText, 
  DollarSign, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Clock
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple Invoicing for
            <span className="text-green-600"> Freelancers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create professional invoices, manage clients, and get paid faster with beenvoice. 
            The invoicing app that works as hard as you do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to invoice like a pro
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for freelancers and small businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Client Management</CardTitle>
                <CardDescription>
                  Keep all your client information organized in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Store contact details and addresses
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Track client history and invoices
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Search and filter clients easily
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <FileText className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Professional Invoices</CardTitle>
                <CardDescription>
                  Create beautiful, detailed invoices with line items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Add multiple line items with dates
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automatic calculations and totals
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Professional invoice numbering
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Payment Tracking</CardTitle>
                <CardDescription>
                  Monitor invoice status and track payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Track draft, sent, paid, and overdue status
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    View outstanding amounts at a glance
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Payment history and analytics
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">
            Why choose beenvoice?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Zap className="h-8 w-8 text-green-600 mt-1" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-gray-600">Create invoices in seconds, not minutes. Our streamlined interface gets you back to work faster.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Shield className="h-8 w-8 text-green-600 mt-1" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                  <p className="text-gray-600">Your data is encrypted and secure. We never share your information with third parties.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Star className="h-8 w-8 text-green-600 mt-1" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">Professional Quality</h3>
                  <p className="text-gray-600">Generate invoices that look professional and build trust with your clients.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Clock className="h-8 w-8 text-green-600 mt-1" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                  <p className="text-gray-600">Automated calculations, templates, and client management save you hours every month.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-green-600">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of freelancers who trust beenvoice for their invoicing needs.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-green-200 mt-4 text-sm">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <Logo className="mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            Simple invoicing for freelancers and small businesses
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <Link href="/auth/signin" className="hover:text-white">Sign In</Link>
            <Link href="/auth/register" className="hover:text-white">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Client components for stats and activity
function DashboardStats({ type }: { type: "clients" | "invoices" | "revenue" | "outstanding" }) {
  // This will be implemented with tRPC queries
  return <span>0</span>;
}

function RecentActivity() {
  // This will be implemented with tRPC queries
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">No recent activity</p>
    </div>
  );
}
