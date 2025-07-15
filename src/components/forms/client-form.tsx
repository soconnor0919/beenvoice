"use client";

import { UserPlus, Mail, Phone, Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { FormSkeleton } from "~/components/ui/skeleton";
import { AddressForm } from "~/components/forms/address-form";
import { FloatingActionBar } from "~/components/layout/floating-action-bar";
import { api } from "~/trpc/react";
import {
  formatPhoneNumber,
  isValidEmail,
  VALIDATION_MESSAGES,
  PLACEHOLDERS,
} from "~/lib/form-constants";

interface ClientFormProps {
  clientId?: string;
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
};

export function ClientForm({ clientId, mode }: ClientFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  // Fetch client data if editing
  const { data: client, isLoading: isLoadingClient } =
    api.clients.getById.useQuery(
      { id: clientId! },
      { enabled: mode === "edit" && !!clientId },
    );

  const createClient = api.clients.create.useMutation({
    onSuccess: () => {
      toast.success("Client created successfully");
      router.push("/dashboard/clients");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create client");
    },
  });

  const updateClient = api.clients.update.useMutation({
    onSuccess: () => {
      toast.success("Client updated successfully");
      router.push("/dashboard/clients");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update client");
    },
  });

  // Load client data when editing
  useEffect(() => {
    if (client && mode === "edit") {
      setFormData({
        name: client.name,
        email: client.email ?? "",
        phone: client.phone ?? "",
        addressLine1: client.addressLine1 ?? "",
        addressLine2: client.addressLine2 ?? "",
        city: client.city ?? "",
        state: client.state ?? "",
        postalCode: client.postalCode ?? "",
        country: client.country ?? "United States",
      });
    }
  }, [client, mode]);

  const handleInputChange = (field: string, value: string) => {
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

      if (formData.country === "US") {
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
      if (mode === "create") {
        await createClient.mutateAsync(formData);
      } else {
        await updateClient.mutateAsync({
          id: clientId!,
          ...formData,
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
    router.push("/dashboard/clients");
  };

  if (mode === "edit" && isLoadingClient) {
    return <FormSkeleton />;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Form Container - styled like data table */}
        <div className="space-y-4">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600/10 to-teal-600/10">
                  <UserPlus className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Enter the client's primary details
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Client Name<span className="text-destructive ml-1">*</span>
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

              <div className="grid gap-4 sm:grid-cols-2">
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
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600/10 to-teal-600/10">
                  <svg
                    className="h-5 w-5 text-emerald-700 dark:text-emerald-400"
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
                  <CardTitle>Address</CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Client's physical location
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
        </div>

        {/* Form Actions - original position */}
        <div
          ref={footerRef}
          className="border-border/40 bg-background/60 flex items-center justify-between rounded-2xl border p-4 shadow-lg backdrop-blur-xl backdrop-saturate-150"
        >
          <p className="text-muted-foreground text-sm">
            {mode === "create"
              ? "Creating a new client"
              : "Editing client details"}
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
              className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === "create" ? "Create Client" : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      <FloatingActionBar
        triggerRef={footerRef}
        title={
          mode === "create" ? "Creating a new client" : "Editing client details"
        }
      >
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
          onClick={handleSubmit}
          disabled={isSubmitting || !isDirty}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Saving..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {mode === "create" ? "Create Client" : "Save Changes"}
            </>
          )}
        </Button>
      </FloatingActionBar>
    </div>
  );
}
