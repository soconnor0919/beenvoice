import { env } from "~/env";

export type InterfaceTheme = "beenvoice" | "shadcn" | "minimal" | "editorial";
export type FontPreference = "brand" | "platform" | "inter" | "serif";
export type RadiusPreference = "none" | "sm" | "md" | "lg" | "xl";
export type SidebarStyle = "floating" | "docked";
export type ColorMode = "light" | "dark" | "system";
export type ColorTheme =
  | "slate"
  | "blue"
  | "green"
  | "rose"
  | "orange"
  | "custom";

export const interfaceThemes: {
  value: InterfaceTheme;
  label: string;
  description: string;
}[] = [
  {
    value: "beenvoice",
    label: "beenvoice",
    description: "Opinionated brand system with expressive headings.",
  },
  {
    value: "shadcn",
    label: "shadcn/ui",
    description: "A plain shadcn baseline for white-label starts.",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Quiet surfaces, lower contrast, and restrained chrome.",
  },
  {
    value: "editorial",
    label: "Editorial",
    description: "A warmer presentation style for service-led brands.",
  },
];

export const themePresets: Record<
  InterfaceTheme,
  {
    interfaceTheme: InterfaceTheme;
    bodyFontPreference: FontPreference;
    headingFontPreference: FontPreference;
    colorTheme: ColorTheme;
    radiusPreference: RadiusPreference;
    sidebarStyle: SidebarStyle;
  }
> = {
  beenvoice: {
    interfaceTheme: "beenvoice",
    bodyFontPreference: "brand",
    headingFontPreference: "brand",
    colorTheme: "slate",
    radiusPreference: "xl",
    sidebarStyle: "floating",
  },
  shadcn: {
    interfaceTheme: "shadcn",
    bodyFontPreference: "inter",
    headingFontPreference: "inter",
    colorTheme: "slate",
    radiusPreference: "md",
    sidebarStyle: "docked",
  },
  minimal: {
    interfaceTheme: "minimal",
    bodyFontPreference: "platform",
    headingFontPreference: "platform",
    colorTheme: "slate",
    radiusPreference: "sm",
    sidebarStyle: "docked",
  },
  editorial: {
    interfaceTheme: "editorial",
    bodyFontPreference: "platform",
    headingFontPreference: "serif",
    colorTheme: "rose",
    radiusPreference: "lg",
    sidebarStyle: "floating",
  },
};

export const fontPreferences: {
  value: FontPreference;
  label: string;
  description: string;
}[] = [
  {
    value: "brand",
    label: "Brand",
    description: "Inter body with Playfair headings.",
  },
  {
    value: "platform",
    label: "Platform",
    description: "Native system fonts for the current OS.",
  },
  {
    value: "inter",
    label: "Inter",
    description: "Inter for both body and headings.",
  },
  {
    value: "serif",
    label: "Editorial",
    description: "Serif headings with system body text.",
  },
];

export const bodyFontPreferences: {
  value: FontPreference;
  label: string;
  description: string;
}[] = [
  {
    value: "brand",
    label: "Brand Sans",
    description: "Inter body text for a clean product feel.",
  },
  {
    value: "platform",
    label: "Platform",
    description: "Native system body text for the current OS.",
  },
  {
    value: "inter",
    label: "Inter",
    description: "Inter body text, explicitly selected.",
  },
  {
    value: "serif",
    label: "Serif",
    description: "Georgia-style body text for editorial deployments.",
  },
];

export const headingFontPreferences: {
  value: FontPreference;
  label: string;
  description: string;
}[] = [
  {
    value: "brand",
    label: "Brand Serif",
    description: "Playfair headings for the BeenVoice identity.",
  },
  {
    value: "platform",
    label: "Platform",
    description: "Native system headings for a neutral app feel.",
  },
  {
    value: "inter",
    label: "Inter",
    description: "Inter headings for a plain shadcn-style baseline.",
  },
  {
    value: "serif",
    label: "Editorial",
    description: "Playfair headings with a stronger editorial tone.",
  },
];

export const radiusPreferences: {
  value: RadiusPreference;
  label: string;
  description: string;
}[] = [
  { value: "none", label: "Square", description: "No rounded corners." },
  { value: "sm", label: "Small", description: "Subtle 4px rounding." },
  { value: "md", label: "Medium", description: "Standard 8px rounding." },
  { value: "lg", label: "Large", description: "Soft 12px rounding." },
  {
    value: "xl",
    label: "Extra Large",
    description: "Expressive 16px rounding.",
  },
];

export const sidebarStyles: {
  value: SidebarStyle;
  label: string;
  description: string;
}[] = [
  {
    value: "floating",
    label: "Floating",
    description: "Inset navigation with rounded edges and elevation.",
  },
  {
    value: "docked",
    label: "Flush",
    description: "Full-height navigation aligned to the viewport edge.",
  },
];

export const colorThemes: {
  value: ColorTheme;
  label: string;
  swatch: string;
}[] = [
  { value: "slate", label: "Slate", swatch: "hsl(240 5.9% 10%)" },
  { value: "blue", label: "Blue", swatch: "hsl(221.2 83.2% 53.3%)" },
  { value: "green", label: "Green", swatch: "hsl(142.1 76.2% 36.3%)" },
  { value: "rose", label: "Rose", swatch: "hsl(346.8 77.2% 49.8%)" },
  { value: "orange", label: "Orange", swatch: "hsl(24.6 95% 53.1%)" },
];

export const colorModes: {
  value: ColorMode;
  label: string;
  description: string;
}[] = [
  { value: "system", label: "System", description: "Follow device setting." },
  { value: "light", label: "Light", description: "Always use light mode." },
  { value: "dark", label: "Dark", description: "Always use dark mode." },
];

export const defaultInterfaceTheme: InterfaceTheme =
  env.NEXT_PUBLIC_DEFAULT_INTERFACE_THEME ?? "beenvoice";

export const defaultFontPreference: FontPreference =
  env.NEXT_PUBLIC_DEFAULT_FONT ?? "brand";

export const defaultBodyFontPreference: FontPreference =
  env.NEXT_PUBLIC_DEFAULT_BODY_FONT ?? defaultFontPreference;

export const defaultHeadingFontPreference: FontPreference =
  env.NEXT_PUBLIC_DEFAULT_HEADING_FONT ?? defaultFontPreference;

export const defaultRadiusPreference: RadiusPreference =
  env.NEXT_PUBLIC_DEFAULT_RADIUS ?? "xl";

export const defaultSidebarStyle: SidebarStyle =
  env.NEXT_PUBLIC_DEFAULT_SIDEBAR_STYLE ?? "floating";

export const brand = {
  name: env.NEXT_PUBLIC_BRAND_NAME ?? "beenvoice",
  tagline:
    env.NEXT_PUBLIC_BRAND_TAGLINE ??
    "Simple and efficient invoicing for freelancers and small businesses",
  logoText: env.NEXT_PUBLIC_BRAND_LOGO_TEXT ?? "beenvoice",
  icon: env.NEXT_PUBLIC_BRAND_ICON ?? "$",
};
