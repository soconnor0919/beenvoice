"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { X } from "lucide-react";

interface LegalModalProps {
  type: "terms" | "privacy";
  trigger: React.ReactNode;
}

export function LegalModal({ type, trigger }: LegalModalProps) {
  const [open, setOpen] = useState(false);

  const isTerms = type === "terms";
  const title = isTerms ? "Terms of Service" : "Privacy Policy";

  const TermsContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the
            beenvoice platform and services (the &quot;Service&quot;) operated
            by beenvoice (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
          </p>
          <p>
            By accessing or using our Service, you agree to be bound by these
            Terms. If you disagree with any part of these terms, then you may
            not access the Service.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            beenvoice is a web-based invoicing platform that allows users to:
          </p>
          <ul>
            <li>Create and manage professional invoices</li>
            <li>Track client information and billing details</li>
            <li>Monitor payment status and financial metrics</li>
            <li>Generate reports and analytics</li>
            <li>Manage business profiles and settings</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            When you create an account with us, you must provide information
            that is accurate, complete, and current at all times. You are
            responsible for safeguarding the password and for all activities
            that occur under your account.
          </p>
          <p>
            You agree not to disclose your password to any third party. You must
            notify us immediately upon becoming aware of any breach of security
            or unauthorized use of your account.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acceptable Use</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>You agree not to use the Service:</p>
          <ul>
            <li>
              For any unlawful purpose or to solicit others to perform unlawful
              acts
            </li>
            <li>
              To violate any international, federal, provincial, or state
              regulations, rules, laws, or local ordinances
            </li>
            <li>
              To infringe upon or violate our intellectual property rights or
              the intellectual property rights of others
            </li>
            <li>
              To harass, abuse, insult, harm, defame, slander, disparage,
              intimidate, or discriminate
            </li>
            <li>To submit false or misleading information</li>
            <li>
              To upload or transmit viruses or any other type of malicious code
            </li>
            <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
            <li>For any obscene or immoral purpose</li>
            <li>
              To interfere with or circumvent the security features of the
              Service
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            Some aspects of the Service may require payment. You will be charged
            according to your subscription plan. All fees are non-refundable
            unless otherwise stated.
          </p>
          <p>
            We may change our fees at any time. We will provide you with
            reasonable notice of any fee changes by posting the new fees on the
            Service or sending you email notification.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Termination</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            We may terminate or suspend your account and bar access to the
            Service immediately, without prior notice or liability, under our
            sole discretion, for any reason whatsoever and without limitation,
            including but not limited to a breach of the Terms.
          </p>
          <p>
            If you wish to terminate your account, you may simply discontinue
            using the Service and contact us to request account deletion.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            If you have any questions about these Terms of Service, please
            contact us at:
          </p>
          <ul>
            <li>Email: legal@beenvoice.com</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  const PrivacyContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <h4>Personal Information</h4>
          <p>
            We may collect personal information that you voluntarily provide to
            us when you:
          </p>
          <ul>
            <li>Register for an account</li>
            <li>Create invoices or manage client information</li>
            <li>Contact us for support</li>
          </ul>
          <p>This personal information may include:</p>
          <ul>
            <li>Name and contact information (email, phone, address)</li>
            <li>Business information and tax details</li>
            <li>Client information you input into the system</li>
            <li>Financial information related to your invoices</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and maintain our Service</li>
            <li>Process your transactions and manage your account</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about your account and our services</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor usage and analyze trends</li>
            <li>
              Detect, prevent, and address technical issues and security
              breaches
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How We Share Your Information</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information in the following
            circumstances:
          </p>

          <h4>Service Providers</h4>
          <p>
            We may share your information with trusted third-party service
            providers who assist us in operating our Service, such as:
          </p>
          <ul>
            <li>Cloud hosting and storage providers</li>
            <li>Payment processors</li>
            <li>Email service providers</li>
            <li>Analytics and monitoring services</li>
          </ul>

          <h4>Legal Requirements</h4>
          <p>
            We may disclose your information if required to do so by law or in
            response to:
          </p>
          <ul>
            <li>Legal processes (subpoenas, court orders)</li>
            <li>Government requests</li>
            <li>Law enforcement investigations</li>
            <li>Protection of our rights, property, or safety</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Security</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            We implement appropriate technical and organizational security
            measures to protect your information:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Secure access controls and authentication</li>
            <li>Regular security assessments and updates</li>
            <li>Employee training on data protection</li>
            <li>Incident response procedures</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Rights and Choices</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            Depending on your location, you may have the following rights
            regarding your personal information:
          </p>
          <ul>
            <li>Request access to your personal information</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your personal information</li>
            <li>Restrict the processing of your information</li>
            <li>Object to certain uses of your data</li>
          </ul>
          <p>
            To exercise these rights, please contact us at
            privacy@beenvoice.com.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p>
            If you have questions about this Privacy Policy or our privacy
            practices, please contact us at:
          </p>
          <ul>
            <li>Email: privacy@beenvoice.com</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span className="inline" onClick={() => setOpen(true)}>
        {trigger}
      </span>
      <DialogContent className="max-h-[80vh] max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {title}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh] pr-4">
          {isTerms ? <TermsContent /> : <PrivacyContent />}
        </ScrollArea>
        <div className="flex justify-end pt-4">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
