"use client";

/**
 * AnimationPreferencesProvider
 *
 * Centralized manager for user animation / motion preferences:
 * - prefersReducedMotion (boolean)
 * - animationSpeedMultiplier (0.25x – 4x)
 *
 * Responsibilities:
 * 1. Hydrate from (priority):
 *    - Inline early localStorage value (if already written by an inline script in layout)
 *    - Existing localStorage value
 *    - Server value (tRPC - user profile)
 *    - Initial props (e.g. server-fetched)
 *    - System media query (prefers-reduced-motion)
 * 2. Apply preferences to:
 *    - documentElement class list (adds / removes .user-reduce-motion)
 *    - CSS custom properties: --animation-speed-fast/normal/slow
 * 3. Persist to localStorage
 * 4. Sync to server via tRPC mutation (debounced & resilient)
 *
 * Usage:
 *  <AnimationPreferencesProvider
 *     initial={{
 *       prefersReducedMotion: serverValue.prefersReducedMotion,
 *       animationSpeedMultiplier: serverValue.animationSpeedMultiplier
 *     }}
 *  >
 *     <App />
 *  </AnimationPreferencesProvider>
 *
 *  const {
 *    prefersReducedMotion,
 *    animationSpeedMultiplier,
 *    updatePreferences,
 *    isUpdating
 *  } = useAnimationPreferences();
 *
 *  updatePreferences({ animationSpeedMultiplier: 1.5 });
 *
 * NOTE: After integrating this provider, remove the duplicated logic
 * from the settings page (SettingsContent) and call updatePreferences()
 * instead of directly manipulating DOM / CSS variables there.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "~/trpc/react";
import { authClient } from "~/lib/auth-client";

type AnimationPreferences = {
  prefersReducedMotion: boolean;
  animationSpeedMultiplier: number;
};

type PartialPrefs = Partial<AnimationPreferences>;

interface AnimationPreferencesContextValue extends AnimationPreferences {
  updatePreferences: (patch: PartialPrefs, opts?: { sync?: boolean }) => void;
  setPrefersReducedMotion: (val: boolean) => void;
  setAnimationSpeedMultiplier: (val: number) => void;
  isUpdating: boolean;
  lastSyncedAt: number | null;
}

interface AnimationPreferencesProviderProps {
  children: React.ReactNode;
  /**
   * Optional initial values (e.g. from server / tRPC prefetch).
   */
  initial?: PartialPrefs;
  /**
   * Disable auto-sync to server (mostly for test environments).
   */
  autoSync?: boolean;
}

const STORAGE_KEY = "bv.animation.prefs";
const MIN_SPEED = 0.25;
const MAX_SPEED = 4;
const DEFAULT_SPEED = 1;
const DEFAULT_PREFERS_REDUCED = false;

const AnimationPreferencesContext =
  createContext<AnimationPreferencesContextValue | null>(null);

function clampSpeed(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_SPEED;
  return Math.min(MAX_SPEED, Math.max(MIN_SPEED, value));
}

function readLocalStorage(): PartialPrefs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PartialPrefs;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      ("prefersReducedMotion" in parsed || "animationSpeedMultiplier" in parsed)
    ) {
      return {
        prefersReducedMotion:
          typeof parsed.prefersReducedMotion === "boolean"
            ? parsed.prefersReducedMotion
            : undefined,
        animationSpeedMultiplier:
          typeof parsed.animationSpeedMultiplier === "number"
            ? clampSpeed(parsed.animationSpeedMultiplier)
            : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function writeLocalStorage(prefs: AnimationPreferences) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        prefersReducedMotion: prefs.prefersReducedMotion,
        animationSpeedMultiplier: prefs.animationSpeedMultiplier,
      }),
    );
  } catch {
    // Fail silently; storage may be unavailable
  }
}

function applyPreferencesToDOM(prefs: AnimationPreferences) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // Class toggle
  if (prefs.prefersReducedMotion) {
    root.classList.add("user-reduce-motion");
  } else {
    root.classList.remove("user-reduce-motion");
  }

  // Derive effective speeds
  const multiplier = prefs.animationSpeedMultiplier || 1;

  const fast = prefs.prefersReducedMotion
    ? 0.01
    : parseFloat((0.15 / multiplier).toFixed(4));
  const normal = prefs.prefersReducedMotion
    ? 0.01
    : parseFloat((0.3 / multiplier).toFixed(4));
  const slow = prefs.prefersReducedMotion
    ? 0.01
    : parseFloat((0.5 / multiplier).toFixed(4));

  root.style.setProperty("--animation-speed-fast", `${fast}s`);
  root.style.setProperty("--animation-speed-normal", `${normal}s`);
  root.style.setProperty("--animation-speed-slow", `${slow}s`);
}

/**
 * Provider component
 */
export function AnimationPreferencesProvider({
  children,
  initial,
  autoSync = true,
}: AnimationPreferencesProviderProps) {
  const updateMutation = api.settings.updateAnimationPreferences.useMutation();
  const { data: session } = authClient.useSession();
  const isAuthed = !!session?.user;
  // Server query only when authenticated
  const { data: serverPrefs } = api.settings.getAnimationPreferences.useQuery(
    undefined,
    {
      enabled: isAuthed,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  );

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    initial?.prefersReducedMotion ?? DEFAULT_PREFERS_REDUCED,
  );
  const [animationSpeedMultiplier, setAnimationSpeedMultiplier] =
    useState<number>(
      clampSpeed(initial?.animationSpeedMultiplier ?? DEFAULT_SPEED),
    );
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const pendingSyncRef = useRef<PartialPrefs | null>(null);
  const isHydratedRef = useRef(false);
  const serverHydratedRef = useRef(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Hydration: run once on mount (local + system + initial)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = readLocalStorage();

    const systemReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finalPrefers =
      stored?.prefersReducedMotion ??
      initial?.prefersReducedMotion ??
      systemReduced ??
      DEFAULT_PREFERS_REDUCED;
    const finalSpeed = clampSpeed(
      stored?.animationSpeedMultiplier ??
      initial?.animationSpeedMultiplier ??
      DEFAULT_SPEED,
    );

    setPrefersReducedMotion(finalPrefers);
    setAnimationSpeedMultiplier(finalSpeed);
    applyPreferencesToDOM({
      prefersReducedMotion: finalPrefers,
      animationSpeedMultiplier: finalSpeed,
    });
    isHydratedRef.current = true;
  }, [initial?.prefersReducedMotion, initial?.animationSpeedMultiplier]);

  /**
   * Core updater
   */
  const performUpdate = useCallback(
    (patch: PartialPrefs, opts?: { sync?: boolean }) => {
      setIsUpdating(true);
      setPrefersReducedMotion((prev) => patch.prefersReducedMotion ?? prev);
      setAnimationSpeedMultiplier((prev) =>
        clampSpeed(patch.animationSpeedMultiplier ?? prev),
      );

      // Normalize patch (avoid mutating the original function argument directly)
      const normalizedPatch: PartialPrefs = { ...patch };

      // If user enables reduced motion, force the animation speed multiplier to 1x (unless already specified)
      if (
        normalizedPatch.prefersReducedMotion === true &&
        normalizedPatch.animationSpeedMultiplier === undefined &&
        animationSpeedMultiplier !== 1
      ) {
        normalizedPatch.animationSpeedMultiplier = 1;
      }

      const nextReduced =
        normalizedPatch.prefersReducedMotion ?? prefersReducedMotion;

      let nextSpeed = clampSpeed(
        normalizedPatch.animationSpeedMultiplier ?? animationSpeedMultiplier,
      );

      // Enforce 1x when reduced motion is active
      if (nextReduced && nextSpeed !== 1) {
        nextSpeed = 1;
        normalizedPatch.animationSpeedMultiplier ??= 1;
      }

      const newPrefs: AnimationPreferences = {
        prefersReducedMotion: nextReduced,
        animationSpeedMultiplier: nextSpeed,
      };

      // Apply to DOM immediately
      applyPreferencesToDOM(newPrefs);

      // Persist locally
      writeLocalStorage(newPrefs);

      // Optionally sync to server
      const shouldSync = opts?.sync ?? autoSync;

      if (shouldSync && isAuthed) {
        pendingSyncRef.current = {
          prefersReducedMotion: patch.prefersReducedMotion,
          animationSpeedMultiplier: patch.animationSpeedMultiplier,
        };
        updateMutation.mutate(
          {
            ...(normalizedPatch.prefersReducedMotion !== undefined && {
              prefersReducedMotion: normalizedPatch.prefersReducedMotion,
            }),
            ...(normalizedPatch.animationSpeedMultiplier !== undefined && {
              animationSpeedMultiplier: clampSpeed(
                normalizedPatch.animationSpeedMultiplier,
              ),
            }),
          },
          {
            onSuccess: () => {
              setLastSyncedAt(Date.now());
              pendingSyncRef.current = null;
              setIsUpdating(false);
            },
            onError: () => {
              setIsUpdating(false);
            },
          },
        );
      } else {
        setIsUpdating(false);
      }
    },
    [
      prefersReducedMotion,
      animationSpeedMultiplier,
      autoSync,
      updateMutation,
      isAuthed,
    ],
  );

  // Secondary hydration: apply server values if they differ AND user hasn't customized locally yet.
  useEffect(() => {
    if (!isHydratedRef.current) return;
    if (serverHydratedRef.current) return;
    if (!isAuthed || !serverPrefs) return;

    const localIsDefault =
      prefersReducedMotion === DEFAULT_PREFERS_REDUCED &&
      animationSpeedMultiplier === DEFAULT_SPEED;

    const differs =
      serverPrefs.prefersReducedMotion !== prefersReducedMotion ||
      serverPrefs.animationSpeedMultiplier !== animationSpeedMultiplier;

    if (localIsDefault || differs) {
      performUpdate(
        {
          prefersReducedMotion: serverPrefs.prefersReducedMotion,
          animationSpeedMultiplier: serverPrefs.animationSpeedMultiplier,
        },
        { sync: false }, // Do not echo immediately back to server
      );
    }
    serverHydratedRef.current = true;
  }, [
    serverPrefs,
    performUpdate,
    prefersReducedMotion,
    animationSpeedMultiplier,
    isAuthed,
  ]);

  const updatePreferences = useCallback<
    AnimationPreferencesContextValue["updatePreferences"]
  >(
    (patch, opts) => {
      performUpdate(patch, opts);
    },
    [performUpdate],
  );

  // Dedicated setters (they sync by default)
  const handleSetReduced = useCallback(
    (val: boolean) => {
      updatePreferences({ prefersReducedMotion: val });
    },
    [updatePreferences],
  );

  const handleSetSpeed = useCallback(
    (val: number) => {
      updatePreferences({ animationSpeedMultiplier: clampSpeed(val) });
    },
    [updatePreferences],
  );

  const value: AnimationPreferencesContextValue = {
    prefersReducedMotion,
    animationSpeedMultiplier,
    updatePreferences,
    setPrefersReducedMotion: handleSetReduced,
    setAnimationSpeedMultiplier: handleSetSpeed,
    isUpdating: isUpdating || updateMutation.isPending,
    lastSyncedAt,
  };

  return (
    <AnimationPreferencesContext.Provider value={value}>
      {children}
    </AnimationPreferencesContext.Provider>
  );
}

/**
 * Hook consumer
 */
export function useAnimationPreferences(): AnimationPreferencesContextValue {
  const ctx = useContext(AnimationPreferencesContext);
  if (!ctx) {
    // Fallback instead of throwing to prevent runtime crashes if provider is missing
    console.warn("useAnimationPreferences used without provider");
    return {
      prefersReducedMotion: false,
      animationSpeedMultiplier: 1,
      updatePreferences: () => { },
      setPrefersReducedMotion: () => { },
      setAnimationSpeedMultiplier: () => { },
      isUpdating: false,
      lastSyncedAt: null,
    };
  }
  return ctx;
}

/**
 * Helper: Inline script snippet (for layout) to minimize FOUC.
 * (Not executed here—copy the string contents into a <script dangerouslySetInnerHTML={{__html: ...}} /> early in <head>.)
 *
 * Example usage in layout.tsx (before loading CSS-heavy content):
 *
 * <script
 *   dangerouslySetInnerHTML={{ __html: getInlineAnimationPrefsScript() }}
 * />
 */
export function getInlineAnimationPrefsScript(): string {
  return `
(function(){
  try {
    var STORAGE_KEY = '${STORAGE_KEY}';
    var raw = localStorage.getItem(STORAGE_KEY);
    var prefersReduced = false;
    var speed = 1;
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (typeof parsed.prefersReducedMotion === 'boolean') {
          prefersReduced = parsed.prefersReducedMotion;
        } else {
          // fallback to system preference if available
          prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
        if (typeof parsed.animationSpeedMultiplier === 'number') {
          speed = parsed.animationSpeedMultiplier;
          if (isNaN(speed) || speed < ${MIN_SPEED} || speed > ${MAX_SPEED}) speed = 1;
        }
      } catch (_e) {}
    } else {
      prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    var root = document.documentElement;
    if (prefersReduced) root.classList.add('user-reduce-motion');
    function apply(fast, normal, slow){
      root.style.setProperty('--animation-speed-fast', fast + 's');
      root.style.setProperty('--animation-speed-normal', normal + 's');
      root.style.setProperty('--animation-speed-slow', slow + 's');
    }
    if (prefersReduced) {
      apply(0.01,0.01,0.01);
    } else {
      var fast = (0.15 / speed).toFixed(4);
      var normal = (0.30 / speed).toFixed(4);
      var slow = (0.50 / speed).toFixed(4);
      apply(fast, normal, slow);
    }
  } catch(_e){}
})();`.trim();
}
