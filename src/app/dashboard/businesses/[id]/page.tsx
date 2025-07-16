import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { PageHeader } from "~/components/layout/page-header";
import Link from "next/link";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  Globe,
  Hash,
} from "lucide-react";

interface BusinessDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BusinessDetailPage({
  params,
}: BusinessDetailPageProps) {
  const { id } = await params;

  const business = await api.businesses.getById({ id });

  if (!business) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div>
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          title={business.name}
          description="Business Details"
          variant="gradient"
        >
          <Link href={`/dashboard/businesses/${business.id}/edit`}>
            <Button variant="brand">
              <Edit className="mr-2 h-4 w-4" />
              Edit Business
            </Button>
          </Link>
        </PageHeader>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Business Information Card */}
          <div className="lg:col-span-2">
            <Card className="card-primary">
              <CardHeader>
                <CardTitle className="card-title-success">
                  <Building className="h-5 w-5" />
                  <span>Business Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {business.email && (
                    <div className="flex items-center space-x-3">
                      <div className="icon-bg-emerald">
                        <Mail className="text-icon-emerald h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-muted text-sm font-medium">Email</p>
                        <p className="text-accent text-sm">{business.email}</p>
                      </div>
                    </div>
                  )}

                  {business.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="icon-bg-emerald">
                        <Phone className="text-icon-emerald h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-muted text-sm font-medium">Phone</p>
                        <p className="text-accent text-sm">{business.phone}</p>
                      </div>
                    </div>
                  )}

                  {business.website && (
                    <div className="flex items-center space-x-3">
                      <div className="icon-bg-emerald">
                        <Globe className="text-icon-emerald h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-muted text-sm font-medium">
                          Website
                        </p>
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-primary text-sm"
                        >
                          {business.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.taxId && (
                    <div className="flex items-center space-x-3">
                      <div className="icon-bg-emerald">
                        <Hash className="text-icon-emerald h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-muted text-sm font-medium">Tax ID</p>
                        <p className="text-accent text-sm">{business.taxId}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address */}
                {(business.addressLine1 ?? business.city ?? business.state) && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="icon-bg-emerald">
                        <MapPin className="text-icon-emerald h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-muted text-sm font-medium">
                          Address
                        </p>
                      </div>
                    </div>
                    <div className="text-accent ml-11 space-y-1 text-sm">
                      {business.addressLine1 && <p>{business.addressLine1}</p>}
                      {business.addressLine2 && <p>{business.addressLine2}</p>}
                      {(business.city ??
                        business.state ??
                        business.postalCode) && (
                        <p>
                          {[business.city, business.state, business.postalCode]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                      {business.country && <p>{business.country}</p>}
                    </div>
                  </div>
                )}

                {/* Business Since */}
                <div className="flex items-center space-x-3">
                  <div className="icon-bg-emerald">
                    <Calendar className="text-icon-emerald h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-muted text-sm font-medium">
                      Business Added
                    </p>
                    <p className="text-secondary text-sm">
                      {formatDate(business.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Default Business Badge */}
                {business.isDefault && (
                  <div className="flex items-center space-x-3">
                    <div className="icon-bg-emerald">
                      <Building className="text-icon-emerald h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-muted text-sm font-medium">Status</p>
                      <Badge className="badge-success">Default Business</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings & Actions Card */}
          <div className="space-y-6">
            <Card className="card-secondary">
              <CardHeader>
                <CardTitle className="card-title-primary">
                  <Building className="h-5 w-5" />
                  <span>Business Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-muted text-sm">Default Business</p>
                  <p className="text-lg font-semibold">
                    {business.isDefault ? (
                      <Badge className="badge-success">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-muted text-sm font-medium">
                    Quick Actions
                  </p>
                  <div className="space-y-2">
                    <Link href={`/dashboard/businesses/${business.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Business
                      </Button>
                    </Link>
                    <Link href="/dashboard/invoices/new">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Create Invoice
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Card */}
            <Card className="card-secondary">
              <CardHeader>
                <CardTitle className="text-accent text-lg">
                  About This Business
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-secondary space-y-3 text-sm">
                  <p>
                    This business profile is used for generating invoices and
                    represents your company information to clients.
                  </p>
                  {business.isDefault && (
                    <p className="text-icon-emerald">
                      This is your default business and will be automatically
                      selected when creating new invoices.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
