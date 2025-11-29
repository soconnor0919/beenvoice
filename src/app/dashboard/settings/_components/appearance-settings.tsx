"use client";

import { ModeSwitcher } from "./mode-switcher";
import { ThemeSelector } from "./theme-selector";

export function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <ModeSwitcher />
      <ThemeSelector />
    </div>
  );
}
