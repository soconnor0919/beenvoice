export function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex).slice(1, 7);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => clamp(channel, 0, 255).toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number) {
  const red = clamp(r, 0, 255) / 255;
  const green = clamp(g, 0, 255) / 255;
  const blue = clamp(b, 0, 255) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { h: 0, s: 0, l: Math.round(lightness * 100) };
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const hue =
    max === red
      ? 60 * (((green - blue) / delta) % 6)
      : max === green
        ? 60 * ((blue - red) / delta + 2)
        : 60 * ((red - green) / delta + 4);

  return {
    h: Math.round((hue + 360) % 360),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number) {
  const hue = clamp(h, 0, 360);
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness - c / 2;
  const [red, green, blue] =
    hue < 60
      ? [c, x, 0]
      : hue < 120
        ? [x, c, 0]
        : hue < 180
          ? [0, c, x]
          : hue < 240
            ? [0, x, c]
            : hue < 300
              ? [x, 0, c]
              : [c, 0, x];

  return {
    r: Math.round((red + m) * 255),
    g: Math.round((green + m) * 255),
    b: Math.round((blue + m) * 255),
  };
}

export function hexToRgba(hex: string) {
  const normalized = normalizeHex(hex, true);
  const rgb = hexToRgb(normalized);
  const alphaHex = normalized.length === 9 ? normalized.slice(7, 9) : "ff";
  return {
    ...rgb,
    a: Number((parseInt(alphaHex, 16) / 255).toFixed(2)),
  };
}

export function rgbaToHex(r: number, g: number, b: number, a: number) {
  const alpha = clamp(Math.round(clampAlpha(a) * 255), 0, 255)
    .toString(16)
    .padStart(2, "0");
  return `${rgbToHex(r, g, b)}${alpha}`.toUpperCase();
}

export function rgbaToHsla(r: number, g: number, b: number, a: number) {
  return { ...rgbToHsl(r, g, b), a: clampAlpha(a) };
}

export function hslaToRgba(h: number, s: number, l: number, a: number) {
  return { ...hslToRgb(h, s, l), a: clampAlpha(a) };
}

function normalizeHex(hex: string, alpha = false) {
  const fallback = alpha ? "#FFFFFFff" : "#FFFFFF";
  const withHash = hex.startsWith("#") ? hex : `#${hex}`;
  if (/^#[0-9A-Fa-f]{6}$/.test(withHash)) return withHash;
  if (alpha && /^#[0-9A-Fa-f]{8}$/.test(withHash)) return withHash;
  return fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(
    min,
    Math.min(max, Math.floor(Number.isFinite(value) ? value : min)),
  );
}

function clampAlpha(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 1));
}
