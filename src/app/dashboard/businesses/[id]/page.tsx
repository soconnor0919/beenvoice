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
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Edit className="mr-2 h-4 w-4" />
              Edit Business
            </Button>
          </Link>
        </PageHeader>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Business Information Card */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600">
                  <Building className="h-5 w-5" />
                  <span>Business Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {business.email && (
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                        <Mail className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Email
                        </p>
                        <p className="text-foreground text-sm">
                          {business.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {business.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                        <Phone className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Phone
                        </p>
                        <p className="text-foreground text-sm">
                          {business.phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {business.website && (
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                        <Globe className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Website
                        </p>
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground text-sm hover:text-emerald-600 hover:underline"
                        >
                          {business.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.taxId && (
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                        <Hash className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Tax ID
                        </p>
                        <p className="text-foreground text-sm">
                          {business.taxId}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address */}
                {(business.addressLine1 ?? business.city ?? business.state) && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Address
                        </p>
                      </div>
                    </div>
                    <div className="text-foreground ml-11 space-y-1 text-sm">
                      {business.addressLine1 && <p>{business.addressLine1}</p>}
                      {business.addressLine2 && <p>{business.addressLine2}</p>}
                      {(business.city ?? business.state ?? business.postalCode) && (
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
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Business Added
                    </p>
                    <p className="text-sm dark:text-gray-300">
                      {formatDate(business.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Default Business Badge */}
                {business.isDefault && (
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                      <Building className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </p>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Default Business
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings & Actions Card */}
          <div className="space-y-6">
            <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
                  <Building className="h-5 w-5" />
                  <span>Business Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Default Business
                  </p>
                  <p className="text-lg font-semibold">
                    {business.isDefault ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
            <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">
                  About This Business
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <p>
                    This business profile is used for generating invoices and
                    represents your company information to clients.
                  </p>
                  {business.isDefault && (
                    <p className="text-emerald-600 dark:text-emerald-400">
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
