"use client";

import {
  Building,
  Mail,
  Phone,
  Save,
  Globe,
  BadgeDollarSign,
  Image,
  Star,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { FormSkeleton } from "~/components/ui/skeleton";
import { Switch } from "~/components/ui/switch";
import { AddressForm } from "~/components/forms/address-form";
import { FloatingActionBar } from "~/components/layout/floating-action-bar";
import { api } from "~/trpc/react";
import {
  formatPhoneNumber,
  formatWebsiteUrl,
  formatTaxId,
  isValidEmail,
  VALIDATION_MESSAGES,
  PLACEHOLDERS,
} from "~/lib/form-constants";

interface BusinessFormProps {
  businessId?: string;
  mode: "create" | "edit";
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  website: string;
  taxId: string;
  logoUrl: string;
  isDefault: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  website?: string;
  taxId?: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  website: "",
  taxId: "",
  logoUrl: "",
  isDefault: false,
};

export function BusinessForm({ businessId, mode }: BusinessFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  // Fetch business data if editing
  const { data: business, isLoading: isLoadingBusiness } =
    api.businesses.getById.useQuery(
      { id: businessId! },
      { enabled: mode === "edit" && !!businessId },
    );

  const createBusiness = api.businesses.create.useMutation({
    onSuccess: () => {
      toast.success("Business created successfully");
      router.push("/dashboard/businesses");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create business");
    },
  });

  const updateBusiness = api.businesses.update.useMutation({
    onSuccess: () => {
      toast.success("Business updated successfully");
      router.push("/dashboard/businesses");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update business");
    },
  });

  // Load business data when editing
  useEffect(() => {
    if (business && mode === "edit") {
      setFormData({
        name: business.name,
        email: business.email ?? "",
        phone: business.phone ?? "",
        addressLine1: business.addressLine1 ?? "",
        addressLine2: business.addressLine2 ?? "",
        city: business.city ?? "",
        state: business.state ?? "",
        postalCode: business.postalCode ?? "",
        country: business.country ?? "United States",
        website: business.website ?? "",
        taxId: business.taxId ?? "",
        logoUrl: business.logoUrl ?? "",
        isDefault: business.isDefault ?? false,
      });
    }
  }, [business, mode]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);

    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange("phone", formatted);
  };

  const handleTaxIdChange = (value: string) => {
    const formatted = formatTaxId(value, "EIN");
    handleInputChange("taxId", formatted);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = VALIDATION_MESSAGES.required;
    }

    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = VALIDATION_MESSAGES.email;
    }

    // Phone validation (basic check for US format)
    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length > 0 && phoneDigits.length < 10) {
        newErrors.phone = VALIDATION_MESSAGES.phone;
      }
    }

    // Address validation if any address field is filled
    const hasAddressData =
      formData.addressLine1 ||
      formData.city ||
      formData.state ||
      formData.postalCode;

    if (hasAddressData) {
      if (!formData.addressLine1)
        newErrors.addressLine1 = VALIDATION_MESSAGES.required;
      if (!formData.city) newErrors.city = VALIDATION_MESSAGES.required;
      if (!formData.country) newErrors.country = VALIDATION_MESSAGES.required;

      if (formData.country === "United States") {
        if (!formData.state) newErrors.state = VALIDATION_MESSAGES.required;
        if (!formData.postalCode)
          newErrors.postalCode = VALIDATION_MESSAGES.required;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format website URL before submission
      const dataToSubmit = {
        ...formData,
        website: formData.website ? formatWebsiteUrl(formData.website) : "",
      };

      if (mode === "create") {
        await createBusiness.mutateAsync(dataToSubmit);
      } else {
        await updateBusiness.mutateAsync({
          id: businessId!,
          ...dataToSubmit,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
      if (!confirmed) return;
    }
    router.push("/dashboard/businesses");
  };

  if (mode === "edit" && isLoadingBusiness) {
    return <FormSkeleton />;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Form Container - styled like data table */}
        <div className="space-y-4">
          {/* Basic Information */}
          <Card className="card-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-brand-muted flex h-10 w-10 items-center justify-center rounded-lg">
                  <Building className="text-brand-light h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Enter your business details
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Business Name
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={PLACEHOLDERS.name}
                    className={`${errors.name ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId" className="text-sm font-medium">
                    Tax ID (EIN)
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e) => handleTaxIdChange(e.target.value)}
                    placeholder={PLACEHOLDERS.taxId}
                    className={`${errors.taxId ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                    maxLength={10}
                  />
                  {errors.taxId && (
                    <p className="text-destructive text-sm">{errors.taxId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={PLACEHOLDERS.email}
                    className={`${errors.email ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder={PLACEHOLDERS.phone}
                    className={`${errors.phone ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium">
                  Website
                  <span className="text-muted-foreground ml-1 text-xs font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder={PLACEHOLDERS.website}
                  className={`${errors.website ? "border-destructive" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.website && (
                  <p className="text-destructive text-sm">{errors.website}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="card-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-brand-muted flex h-10 w-10 items-center justify-center rounded-lg">
                  <svg
                    className="text-brand-light h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <CardTitle>Business Address</CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Your business location
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AddressForm
                addressLine1={formData.addressLine1}
                addressLine2={formData.addressLine2}
                city={formData.city}
                state={formData.state}
                postalCode={formData.postalCode}
                country={formData.country}
                onChange={handleInputChange}
                errors={errors}
                required={false}
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="card-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-brand-muted flex h-10 w-10 items-center justify-center rounded-lg">
                  <Star className="text-brand-light h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Settings</CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Configure business preferences
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-brand-muted border-border/40 flex items-center justify-between rounded-xl border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isDefault" className="text-base font-medium">
                    Default Business
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Set this as your default business for new invoices
                  </p>
                </div>
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    handleInputChange("isDefault", checked)
                  }
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Actions - original position */}
        <div
          ref={footerRef}
          className="border-border/40 bg-background/60 flex items-center justify-between rounded-2xl border p-4 shadow-lg backdrop-blur-xl backdrop-saturate-150"
        >
          <p className="text-muted-foreground text-sm">
            {mode === "create"
              ? "Creating a new business"
              : "Editing business details"}
          </p>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="border-border/40 hover:bg-accent/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="btn-brand-primary shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === "create" ? "Create Business" : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      <FloatingActionBar
        triggerRef={footerRef}
        title={
          mode === "create"
            ? "Creating a new business"
            : "Editing business details"
        }
      >
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="border-border/40 hover:bg-accent/50"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Cancel</span>
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !isDirty}
          className="btn-brand-primary shadow-md"
          size="sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
              <span className="hidden sm:inline">
                {mode === "create" ? "Creating..." : "Saving..."}
              </span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">
                {mode === "create" ? "Create Business" : "Save Changes"}
              </span>
            </>
          )}
        </Button>
      </FloatingActionBar>
    </div>
  );
}
