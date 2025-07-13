"use client";

import {
  Building,
  Mail,
  MapPin,
  Phone,
  Save,
  Globe,
  BadgeDollarSign,
  Image,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SearchableSelect } from "~/components/ui/select";
import { FormSkeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

interface BusinessFormProps {
  businessId?: string;
  mode: "create" | "edit";
}

export function BusinessForm({ businessId, mode }: BusinessFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    website: "",
    taxId: "",
    logoUrl: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);

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
        country: business.country ?? "",
        website: business.website ?? "",
        taxId: business.taxId ?? "",
        logoUrl: business.logoUrl ?? "",
        isDefault: business.isDefault ?? false,
      });
    }
  }, [business, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "create") {
        await createBusiness.mutateAsync(formData);
      } else {
        await updateBusiness.mutateAsync({
          id: businessId!,
          ...formData,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Phone number formatting (reuse from client-form)
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, "");
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange("phone", formatted);
  };

  // US States and Countries (reuse from client-form)
  const US_STATES = [
    { value: "__placeholder__", label: "Select State" },
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
  ];

  const MOST_USED_COUNTRIES = [
    { value: "United States", label: "United States" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Canada", label: "Canada" },
    { value: "Australia", label: "Australia" },
    { value: "Germany", label: "Germany" },
    { value: "France", label: "France" },
    { value: "India", label: "India" },
  ];

  const ALL_COUNTRIES = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const OTHER_COUNTRIES = ALL_COUNTRIES.filter(
    (c) => !MOST_USED_COUNTRIES.some((mc) => mc.value === c),
  )
    .map((country) => ({ value: country, label: country }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const ALL_COUNTRIES_OPTIONS = [
    { value: "__placeholder__", label: "Select country" },
    ...MOST_USED_COUNTRIES,
    ...OTHER_COUNTRIES,
  ];

  if (mode === "edit" && isLoadingBusiness) {
    return (
      <Card className="my-8 w-full border-0 bg-white/80 px-0 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
        <CardContent className="p-8">
          <FormSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-8 w-full border-0 bg-white/80 px-0 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
              <Building className="h-5 w-5" />
              <h3 className="text-lg font-semibold dark:text-white">
                Business Information
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Business Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  placeholder="Enter business name"
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="business@example.com"
                    className="h-12 border-gray-200 pl-10 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
              <Phone className="h-5 w-5" />
              <h3 className="text-lg font-semibold dark:text-white">
                Contact Information
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="h-12 border-gray-200 pl-10 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="website"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Website
                </Label>
                <div className="relative">
                  <Globe className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://yourbusiness.com"
                    className="h-12 border-gray-200 pl-10 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-semibold dark:text-white">
                Address Information
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="addressLine1"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Address Line 1
                </Label>
                <Input
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) =>
                    handleInputChange("addressLine1", e.target.value)
                  }
                  placeholder="123 Main St"
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="addressLine2"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Address Line 2
                </Label>
                <Input
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) =>
                    handleInputChange("addressLine2", e.target.value)
                  }
                  placeholder="Suite 100"
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="city"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="City"
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="state"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  State/Province
                </Label>
                <SearchableSelect
                  value={formData.state}
                  onValueChange={(value) => handleInputChange("state", value)}
                  options={US_STATES}
                  placeholder="Select State"
                  searchPlaceholder="Search states..."
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="postalCode"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Postal Code
                </Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) =>
                    handleInputChange("postalCode", e.target.value)
                  }
                  placeholder="ZIP or postal code"
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Country
                </Label>
                <SearchableSelect
                  value={formData.country}
                  onValueChange={(value) => handleInputChange("country", value)}
                  options={ALL_COUNTRIES_OPTIONS}
                  placeholder="Select country"
                  searchPlaceholder="Search countries..."
                />
              </div>
            </div>
          </div>

          {/* Tax, Logo, Default Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
              <BadgeDollarSign className="h-5 w-5" />
              <h3 className="text-lg font-semibold dark:text-white">
                Business Details
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="taxId"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tax ID / VAT Number
                </Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange("taxId", e.target.value)}
                  placeholder="Tax ID or VAT number"
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="logoUrl"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Logo URL
                </Label>
                <div className="relative">
                  <Image className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) =>
                      handleInputChange("logoUrl", e.target.value)
                    }
                    placeholder="https://yourbusiness.com/logo.png"
                    className="h-12 border-gray-200 pl-10 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <input
                  id="isDefault"
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    handleInputChange("isDefault", e.target.checked)
                  }
                  className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <Label
                  htmlFor="isDefault"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <Star className="mr-1 h-4 w-4 text-yellow-400" /> Set as
                  default business
                </Label>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              asChild
              className="border-gray-300"
              disabled={loading}
            >
              <Link href="/dashboard/businesses">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white shadow-lg hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
              disabled={loading}
            >
              <Save className="mr-2 h-5 w-5" />
              {mode === "create" ? "Create Business" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
