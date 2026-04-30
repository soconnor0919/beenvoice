"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  fallbackAppearance,
  isColorMode,
  isColorTheme,
  isFontPreference,
  isHslChannels,
  isInterfaceTheme,
  isPdfTemplate,
  isRadiusPreference,
  isSidebarStyle,
  type PdfTemplate,
} from "~/lib/appearance";
import {
  defaultBodyFontPreference,
  defaultHeadingFontPreference,
  defaultInterfaceTheme,
  defaultRadiusPreference,
  defaultSidebarStyle,
  brand as defaultBrand,
  type ColorMode,
  type ColorTheme,
  type FontPreference,
  type InterfaceTheme,
  type RadiusPreference,
  type SidebarStyle,
} from "~/lib/branding";
import { api } from "~/trpc/react";

type AppearancePreferences = {
  interfaceTheme: InterfaceTheme;
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

type AppearancePatch = Partial<AppearancePreferences>;

type ServerAppearance = {
  interfaceTheme: InterfaceTheme;
  bodyFontPreference: FontPreference;
  headingFontPreference: FontPreference;
  radiusPreference: RadiusPreference;
  sidebarStyle: SidebarStyle;
  theme: ColorMode;
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

type AppearanceContextValue = AppearancePreferences & {
  updateAppearance: (patch: AppearancePatch) => void;
  updateAppearanceDebounced: (patch: AppearancePatch) => void;
  isUpdating: boolean;
};

const STORAGE_KEY = "bv.appearance";

const defaultAppearance: AppearancePreferences = {
  interfaceTheme: defaultInterfaceTheme,
  bodyFontPreference: defaultBodyFontPreference,
  headingFontPreference: defaultHeadingFontPreference,
  radiusPreference: defaultRadiusPreference,
  sidebarStyle: defaultSidebarStyle,
  colorMode: fallbackAppearance.colorMode,
  colorTheme: fallbackAppearance.colorTheme,
  brandName: defaultBrand.name,
  brandTagline: defaultBrand.tagline,
  brandLogoText: defaultBrand.logoText,
  brandIcon: defaultBrand.icon,
  pdfTemplate: fallbackAppearance.pdfTemplate,
  pdfAccentColor: fallbackAppearance.pdfAccentColor,
  pdfFooterText: fallbackAppearance.pdfFooterText,
  pdfShowLogo: fallbackAppearance.pdfShowLogo,
  pdfShowPageNumbers: fallbackAppearance.pdfShowPageNumbers,
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

function getServerAppearancePatch(
  serverAppearance: ServerAppearance,
): AppearancePatch {
  return {
    interfaceTheme: serverAppearance.interfaceTheme,
    bodyFontPreference: serverAppearance.bodyFontPreference,
    headingFontPreference: serverAppearance.headingFontPreference,
    radiusPreference: serverAppearance.radiusPreference,
    sidebarStyle: serverAppearance.sidebarStyle,
    colorMode: serverAppearance.theme,
    colorTheme: serverAppearance.colorTheme,
    customColor: serverAppearance.customColor,
    brandName: serverAppearance.brandName,
    brandTagline: serverAppearance.brandTagline,
    brandLogoText: serverAppearance.brandLogoText,
    brandIcon: serverAppearance.brandIcon,
    pdfTemplate: serverAppearance.pdfTemplate,
    pdfAccentColor: serverAppearance.pdfAccentColor,
    pdfFooterText: serverAppearance.pdfFooterText,
    pdfShowLogo: serverAppearance.pdfShowLogo,
    pdfShowPageNumbers: serverAppearance.pdfShowPageNumbers,
  };
}

function readStoredAppearance(): Partial<AppearancePreferences> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      interfaceTheme: isInterfaceTheme(parsed.interfaceTheme)
        ? parsed.interfaceTheme
        : undefined,
      bodyFontPreference: isFontPreference(parsed.bodyFontPreference)
        ? parsed.bodyFontPreference
        : isFontPreference(parsed.fontPreference)
          ? parsed.fontPreference
          : undefined,
      headingFontPreference: isFontPreference(parsed.headingFontPreference)
        ? parsed.headingFontPreference
        : isFontPreference(parsed.fontPreference)
          ? parsed.fontPreference
          : undefined,
      radiusPreference: isRadiusPreference(parsed.radiusPreference)
        ? parsed.radiusPreference
        : undefined,
      sidebarStyle: isSidebarStyle(parsed.sidebarStyle)
        ? parsed.sidebarStyle
        : undefined,
      colorMode: isColorMode(parsed.colorMode) ? parsed.colorMode : undefined,
      colorTheme: isColorTheme(parsed.colorTheme)
        ? parsed.colorTheme
        : undefined,
      customColor: isHslChannels(parsed.customColor)
        ? parsed.customColor
        : undefined,
      brandName:
        typeof parsed.brandName === "string" ? parsed.brandName : undefined,
      brandTagline:
        typeof parsed.brandTagline === "string"
          ? parsed.brandTagline
          : undefined,
      brandLogoText:
        typeof parsed.brandLogoText === "string"
          ? parsed.brandLogoText
          : undefined,
      brandIcon:
        typeof parsed.brandIcon === "string" ? parsed.brandIcon : undefined,
      pdfTemplate: isPdfTemplate(parsed.pdfTemplate)
        ? parsed.pdfTemplate
        : undefined,
      pdfAccentColor:
        typeof parsed.pdfAccentColor === "string"
          ? parsed.pdfAccentColor
          : undefined,
      pdfFooterText:
        typeof parsed.pdfFooterText === "string"
          ? parsed.pdfFooterText
          : undefined,
      pdfShowLogo:
        typeof parsed.pdfShowLogo === "boolean"
          ? parsed.pdfShowLogo
          : undefined,
      pdfShowPageNumbers:
        typeof parsed.pdfShowPageNumbers === "boolean"
          ? parsed.pdfShowPageNumbers
          : undefined,
    };
  } catch {
    return null;
  }
}

function writeStoredAppearance(prefs: AppearancePreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Storage can be unavailable in private browsing or locked-down contexts.
  }
}

function applyAppearance(prefs: AppearancePreferences) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.dataset.interfaceTheme = prefs.interfaceTheme;
  root.dataset.bodyFont = prefs.bodyFontPreference;
  root.dataset.headingFont = prefs.headingFontPreference;
  root.dataset.radius = prefs.radiusPreference;
  root.dataset.sidebarStyle = prefs.sidebarStyle;
  root.dataset.colorMode = prefs.colorMode;
  root.dataset.colorTheme = prefs.colorTheme;

  root.classList.toggle("dark", prefs.colorMode === "dark");

  if (prefs.customColor) {
    root.style.setProperty("--custom-primary", prefs.customColor);
  } else {
    root.style.removeProperty("--custom-primary");
  }
}

export function AppearanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appearance, setAppearance] =
    useState<AppearancePreferences>(defaultAppearance);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDebouncedPatchRef = useRef<AppearancePatch>({});
  const utils = api.useUtils();
  const updateMutation = api.settings.updateTheme.useMutation({
    onSuccess: async () => {
      await utils.settings.getTheme.invalidate();
    },
    onError: () => {
      const cachedAppearance = utils.settings.getTheme.getData();
      const fallback = cachedAppearance
        ? {
            ...defaultAppearance,
            ...getServerAppearancePatch(cachedAppearance),
          }
        : defaultAppearance;

      setAppearance(fallback);
      applyAppearance(fallback);
      writeStoredAppearance(fallback);
    },
  });

  const persistAppearance = useCallback(
    (patch: AppearancePatch) => {
      if (
        patch.customColor !== undefined &&
        !isHslChannels(patch.customColor)
      ) {
        return;
      }

      updateMutation.mutate({
        interfaceTheme: patch.interfaceTheme,
        bodyFontPreference: patch.bodyFontPreference,
        headingFontPreference: patch.headingFontPreference,
        radiusPreference: patch.radiusPreference,
        sidebarStyle: patch.sidebarStyle,
        theme: patch.colorMode,
        colorTheme: patch.colorTheme,
        customColor: patch.customColor,
        brandName: patch.brandName,
        brandTagline: patch.brandTagline,
        brandLogoText: patch.brandLogoText,
        brandIcon: patch.brandIcon,
        pdfTemplate: patch.pdfTemplate,
        pdfAccentColor: patch.pdfAccentColor,
        pdfFooterText: patch.pdfFooterText,
        pdfShowLogo: patch.pdfShowLogo,
        pdfShowPageNumbers: patch.pdfShowPageNumbers,
      });
    },
    [updateMutation],
  );

  const { data: serverAppearance } = api.settings.getTheme.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  useEffect(() => {
    const storedAppearance = readStoredAppearance();
    if (!storedAppearance) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAppearance((prev) => ({ ...prev, ...storedAppearance }));
  }, []);

  useEffect(() => {
    if (!serverAppearance) return;
    const next = getServerAppearancePatch(serverAppearance);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAppearance((prev) => ({ ...prev, ...next }));
  }, [serverAppearance]);

  useEffect(() => {
    applyAppearance(appearance);
    writeStoredAppearance(appearance);
  }, [appearance]);

  const updateAppearance = useCallback(
    (patch: AppearancePatch) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      if (Object.keys(pendingDebouncedPatchRef.current).length > 0) {
        persistAppearance(pendingDebouncedPatchRef.current);
        pendingDebouncedPatchRef.current = {};
      }

      setAppearance((prev) => {
        const next = { ...prev, ...patch };
        applyAppearance(next);
        writeStoredAppearance(next);
        return next;
      });

      persistAppearance(patch);
    },
    [persistAppearance],
  );

  const updateAppearanceDebounced = useCallback(
    (patch: AppearancePatch) => {
      pendingDebouncedPatchRef.current = {
        ...pendingDebouncedPatchRef.current,
        ...patch,
      };

      setAppearance((prev) => {
        const next = { ...prev, ...patch };
        applyAppearance(next);
        writeStoredAppearance(next);
        return next;
      });

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        persistAppearance(pendingDebouncedPatchRef.current);
        pendingDebouncedPatchRef.current = {};
        debounceTimerRef.current = null;
      }, 500);
    },
    [persistAppearance],
  );

  useEffect(
    () => () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      pendingDebouncedPatchRef.current = {};
    },
    [],
  );

  const value = useMemo<AppearanceContextValue>(
    () => ({
      ...appearance,
      updateAppearance,
      updateAppearanceDebounced,
      isUpdating: updateMutation.isPending,
    }),
    [
      appearance,
      updateAppearance,
      updateAppearanceDebounced,
      updateMutation.isPending,
    ],
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return ctx;
}
