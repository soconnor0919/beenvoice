import { z } from "zod";

export const interfaceThemeValues = [
  "beenvoice",
  "frutiger",
  "frutiger-aero",
  "shadcn",
  "minimal",
  "editorial",
] as const;
export const fontPreferenceValues = [
  "brand",
  "frutiger",
  "platform",
  "inter",
  "serif",
] as const;
export const radiusPreferenceValues = ["none", "sm", "md", "lg", "xl"] as const;
export const sidebarStyleValues = ["floating", "docked"] as const;
export const colorModeValues = ["light", "dark", "system"] as const;
export const colorThemeValues = [
  "slate",
  "blue",
  "green",
  "rose",
  "orange",
  "custom",
] as const;
export const pdfTemplateValues = ["classic", "minimal"] as const;

export const interfaceThemeSchema = z.enum(interfaceThemeValues);
export const fontPreferenceSchema = z.enum(fontPreferenceValues);
export const radiusPreferenceSchema = z.enum(radiusPreferenceValues);
export const sidebarStyleSchema = z.enum(sidebarStyleValues);
export const colorModeSchema = z.enum(colorModeValues);
export const colorThemeSchema = z.enum(colorThemeValues);
export const pdfTemplateSchema = z.enum(pdfTemplateValues);

export const hslChannelsSchema = z
  .string()
  .trim()
  .regex(
    /^(?:360(?:\.0)?|3[0-5]\d(?:\.\d)?|[12]?\d?\d(?:\.\d)?)\s+(?:100(?:\.0)?|\d{1,2}(?:\.\d)?)%\s+(?:100(?:\.0)?|\d{1,2}(?:\.\d)?)%$/,
    "Use HSL channels like 142.1 76.2% 36.3%",
  );

export type InterfaceTheme = z.infer<typeof interfaceThemeSchema>;
export type FontPreference = z.infer<typeof fontPreferenceSchema>;
export type RadiusPreference = z.infer<typeof radiusPreferenceSchema>;
export type SidebarStyle = z.infer<typeof sidebarStyleSchema>;
export type ColorMode = z.infer<typeof colorModeSchema>;
export type ColorTheme = z.infer<typeof colorThemeSchema>;
export type PdfTemplate = z.infer<typeof pdfTemplateSchema>;

export const fallbackAppearance = {
  interfaceTheme: "beenvoice",
  fontPreference: "brand",
  bodyFontPreference: "brand",
  headingFontPreference: "brand",
  radiusPreference: "xl",
  sidebarStyle: "floating",
  colorMode: "system",
  colorTheme: "slate",
  customColor: undefined,
  brandName: "beenvoice",
  brandTagline:
    "Simple and efficient invoicing for freelancers and small businesses",
  brandLogoText: "beenvoice",
  brandIcon: "$",
  pdfTemplate: "classic",
  pdfAccentColor: "#111827",
  pdfFooterText: "Professional Invoicing",
  pdfShowLogo: true,
  pdfShowPageNumbers: true,
} satisfies {
  interfaceTheme: InterfaceTheme;
  fontPreference: FontPreference;
  bodyFontPreference: FontPreference;
  headingFontPreference: FontPreference;
  radiusPreference: RadiusPreference;
  sidebarStyle: SidebarStyle;
  colorMode: ColorMode;
  colorTheme: ColorTheme;
  customColor?: string;
  brandName: string;
  brandTagline: string;
  brandLogoText: string;
  brandIcon: string;
  pdfTemplate: PdfTemplate;
  pdfAccentColor: string;
  pdfFooterText: string;
  pdfShowLogo: boolean;
  pdfShowPageNumbers: boolean;
};

export function isInterfaceTheme(value: unknown): value is InterfaceTheme {
  return interfaceThemeSchema.safeParse(value).success;
}

export function isFontPreference(value: unknown): value is FontPreference {
  return fontPreferenceSchema.safeParse(value).success;
}

export function isColorMode(value: unknown): value is ColorMode {
  return colorModeSchema.safeParse(value).success;
}

export function isColorTheme(value: unknown): value is ColorTheme {
  return colorThemeSchema.safeParse(value).success;
}

export function isRadiusPreference(value: unknown): value is RadiusPreference {
  return radiusPreferenceSchema.safeParse(value).success;
}

export function isSidebarStyle(value: unknown): value is SidebarStyle {
  return sidebarStyleSchema.safeParse(value).success;
}

export function isPdfTemplate(value: unknown): value is PdfTemplate {
  return pdfTemplateSchema.safeParse(value).success;
}

export function isHslChannels(value: unknown): value is string {
  return hslChannelsSchema.safeParse(value).success;
}
