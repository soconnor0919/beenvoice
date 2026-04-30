import { env } from "~/env";
import {
  fallbackAppearance,
  type ColorMode,
  type ColorTheme,
  type FontPreference,
  type InterfaceTheme,
  type PdfTemplate,
  type RadiusPreference,
  type SidebarStyle,
} from "~/lib/appearance";

export type {
  ColorMode,
  ColorTheme,
  FontPreference,
  InterfaceTheme,
  PdfTemplate,
  RadiusPreference,
  SidebarStyle,
} from "~/lib/appearance";

export {
  colorModeSchema,
  colorThemeSchema,
  fallbackAppearance,
  fontPreferenceSchema,
  hslChannelsSchema,
  interfaceThemeSchema,
  pdfTemplateSchema,
  radiusPreferenceSchema,
  sidebarStyleSchema,
} from "~/lib/appearance";

export const interfaceThemes: {
  value: InterfaceTheme;
  label: string;
  description: string;
}[] = [
  {
    value: "beenvoice",
    label: "beenvoice",
    description:
      "Playfair Display headings, Geist body text, and soft product chrome.",
  },
  {
    value: "frutiger",
    label: "Frutiger Airport",
    description:
      "Rectangular blue-and-yellow wayfinding UI with Frutiger typography and docked navigation.",
  },
  {
    value: "frutiger-aero",
    label: "Frutiger Aero",
    description:
      "Glossy sky-and-glass interface with Frutiger typography and softer surfaces.",
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
    pdfTemplate: PdfTemplate;
    pdfAccentColor: string;
  }
> = {
  beenvoice: {
    interfaceTheme: "beenvoice",
    bodyFontPreference: "brand",
    headingFontPreference: "brand",
    colorTheme: "slate",
    radiusPreference: "xl",
    sidebarStyle: "floating",
    pdfTemplate: "classic",
    pdfAccentColor: "#111827",
  },
  frutiger: {
    interfaceTheme: "frutiger",
    bodyFontPreference: "frutiger",
    headingFontPreference: "frutiger",
    colorTheme: "blue",
    radiusPreference: "none",
    sidebarStyle: "docked",
    pdfTemplate: "minimal",
    pdfAccentColor: "#003b5c",
  },
  "frutiger-aero": {
    interfaceTheme: "frutiger-aero",
    bodyFontPreference: "frutiger",
    headingFontPreference: "frutiger",
    colorTheme: "blue",
    radiusPreference: "lg",
    sidebarStyle: "floating",
    pdfTemplate: "classic",
    pdfAccentColor: "#0077be",
  },
  shadcn: {
    interfaceTheme: "shadcn",
    bodyFontPreference: "inter",
    headingFontPreference: "inter",
    colorTheme: "slate",
    radiusPreference: "md",
    sidebarStyle: "docked",
    pdfTemplate: "classic",
    pdfAccentColor: "#111827",
  },
  minimal: {
    interfaceTheme: "minimal",
    bodyFontPreference: "platform",
    headingFontPreference: "platform",
    colorTheme: "slate",
    radiusPreference: "sm",
    sidebarStyle: "docked",
    pdfTemplate: "minimal",
    pdfAccentColor: "#111827",
  },
  editorial: {
    interfaceTheme: "editorial",
    bodyFontPreference: "platform",
    headingFontPreference: "serif",
    colorTheme: "rose",
    radiusPreference: "lg",
    sidebarStyle: "floating",
    pdfTemplate: "classic",
    pdfAccentColor: "#be123c",
  },
};

export const bodyFontPreferences: {
  value: FontPreference;
  label: string;
  description: string;
}[] = [
  {
    value: "brand",
    label: "Geist",
    description: "Geist body text for the core beenvoice product feel.",
  },
  {
    value: "frutiger",
    label: "Frutiger",
    description: "Frutiger body text for signage-like operational screens.",
  },
  {
    value: "platform",
    label: "Platform",
    description: "Native system body text for the current OS.",
  },
  {
    value: "inter",
    label: "Geist Legacy",
    description: "Legacy sans option mapped to Geist for older installs.",
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
    label: "Playfair Display",
    description: "Playfair Display headings for the beenvoice identity.",
  },
  {
    value: "frutiger",
    label: "Frutiger",
    description: "Frutiger headings for airport-inspired wayfinding.",
  },
  {
    value: "platform",
    label: "Platform",
    description: "Native system headings for a neutral app feel.",
  },
  {
    value: "inter",
    label: "Geist Legacy",
    description: "Legacy sans option mapped to Geist for older installs.",
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
  env.NEXT_PUBLIC_DEFAULT_INTERFACE_THEME ?? fallbackAppearance.interfaceTheme;

export const defaultFontPreference: FontPreference =
  env.NEXT_PUBLIC_DEFAULT_FONT ?? fallbackAppearance.fontPreference;

export const defaultBodyFontPreference: FontPreference =
  env.NEXT_PUBLIC_DEFAULT_BODY_FONT ?? defaultFontPreference;

export const defaultHeadingFontPreference: FontPreference =
  env.NEXT_PUBLIC_DEFAULT_HEADING_FONT ?? defaultFontPreference;

export const defaultRadiusPreference: RadiusPreference =
  env.NEXT_PUBLIC_DEFAULT_RADIUS ?? fallbackAppearance.radiusPreference;

export const defaultSidebarStyle: SidebarStyle =
  env.NEXT_PUBLIC_DEFAULT_SIDEBAR_STYLE ?? fallbackAppearance.sidebarStyle;

export const brand = {
  name: env.NEXT_PUBLIC_BRAND_NAME ?? fallbackAppearance.brandName,
  tagline: env.NEXT_PUBLIC_BRAND_TAGLINE ?? fallbackAppearance.brandTagline,
  logoText: env.NEXT_PUBLIC_BRAND_LOGO_TEXT ?? fallbackAppearance.brandLogoText,
  icon: env.NEXT_PUBLIC_BRAND_ICON ?? fallbackAppearance.brandIcon,
};
