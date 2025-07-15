"use client";

import { MapPin } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SearchableSelect } from "~/components/ui/select";
import {
  US_STATES,
  ALL_COUNTRIES,
  POPULAR_COUNTRIES,
  formatPostalCode,
  PLACEHOLDERS,
} from "~/lib/form-constants";

interface AddressFormProps {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  onChange: (field: string, value: string) => void;
  errors?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  required?: boolean;
  className?: string;
}

export function AddressForm({
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
  country,
  onChange,
  errors = {},
  required = false,
  className = "",
}: AddressFormProps) {
  const handlePostalCodeChange = (value: string) => {
    const formatted = formatPostalCode(value, country || "US");
    onChange("postalCode", formatted);
  };

  // Combine popular and all countries, removing duplicates
  const countryOptions = [
    { value: "__placeholder__", label: "Select a country", disabled: true },
    { value: "divider-popular", label: "Popular Countries", disabled: true },
    ...POPULAR_COUNTRIES,
    { value: "divider-all", label: "All Countries", disabled: true },
    ...ALL_COUNTRIES.filter(
      (c) => !POPULAR_COUNTRIES.some((p) => p.value === c.value),
    ),
  ];

  const stateOptions = [
    { value: "__placeholder__", label: "Select a state", disabled: true },
    ...US_STATES,
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <MapPin className="text-muted-foreground h-4 w-4" />
        <span>Address Information</span>
      </div>

      <div className="grid gap-4">
        {/* Address Line 1 */}
        <div className="space-y-2">
          <Label htmlFor="addressLine1">
            Address Line 1
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id="addressLine1"
            value={addressLine1}
            onChange={(e) => onChange("addressLine1", e.target.value)}
            placeholder={PLACEHOLDERS.addressLine1}
            className={errors.addressLine1 ? "border-destructive" : ""}
          />
          {errors.addressLine1 && (
            <p className="text-destructive text-sm">{errors.addressLine1}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="space-y-2">
          <Label htmlFor="addressLine2">
            Address Line 2
            <span className="text-muted-foreground ml-1 text-xs">
              (Optional)
            </span>
          </Label>
          <Input
            id="addressLine2"
            value={addressLine2}
            onChange={(e) => onChange("addressLine2", e.target.value)}
            placeholder={PLACEHOLDERS.addressLine2}
          />
        </div>

        {/* City and State/Province */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">
              City{required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder={PLACEHOLDERS.city}
              className={errors.city ? "border-destructive" : ""}
            />
            {errors.city && (
              <p className="text-destructive text-sm">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">
              {country === "United States" ? "State" : "State/Province"}
              {required && country === "United States" && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            {country === "United States" ? (
              <SearchableSelect
                id="state"
                options={stateOptions}
                value={state || ""}
                onValueChange={(value) => onChange("state", value)}
                placeholder="Select a state"
                className={errors.state ? "border-destructive" : ""}
              />
            ) : (
              <Input
                id="state"
                value={state}
                onChange={(e) => onChange("state", e.target.value)}
                placeholder="State/Province"
                className={errors.state ? "border-destructive" : ""}
              />
            )}
            {errors.state && (
              <p className="text-destructive text-sm">{errors.state}</p>
            )}
          </div>
        </div>

        {/* Postal Code and Country */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="postalCode">
              {country === "United States" ? "ZIP Code" : "Postal Code"}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id="postalCode"
              value={postalCode}
              onChange={(e) => handlePostalCodeChange(e.target.value)}
              placeholder={
                country === "United States" ? "12345" : PLACEHOLDERS.postalCode
              }
              className={errors.postalCode ? "border-destructive" : ""}
              maxLength={
                country === "United States"
                  ? 10
                  : country === "Canada"
                    ? 7
                    : undefined
              }
            />
            {errors.postalCode && (
              <p className="text-destructive text-sm">{errors.postalCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">
              Country
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <SearchableSelect
              id="country"
              options={countryOptions}
              value={country || ""}
              onValueChange={(value) => {
                // Don't save the placeholder value
                if (value !== "__placeholder__") {
                  onChange("country", value);
                  // Reset state when country changes from United States
                  if (value !== "United States" && state.length === 2) {
                    onChange("state", "");
                  }
                }
              }}
              placeholder="Select a country"
              className={errors.country ? "border-destructive" : ""}
              renderOption={(option) => {
                if (option.value?.startsWith("divider-")) {
                  return (
                    <div className="text-muted-foreground px-2 py-1 text-xs font-semibold">
                      {option.label}
                    </div>
                  );
                }
                return option.label;
              }}
              isOptionDisabled={(option) =>
                option.disabled || option.value?.startsWith("divider-")
              }
            />
            {errors.country && (
              <p className="text-destructive text-sm">{errors.country}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
