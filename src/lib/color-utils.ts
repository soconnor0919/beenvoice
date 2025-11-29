type Oklch = {
  l: number;
  c: number;
  h: number;
};

/**
 * Converts a hexadecimal color string to an Oklch color object.
 *
 * @param {string} hex - The hexadecimal color string (e.g., "#RRGGBB", "RRGGBB", "#RGB", "RGB").
 * @returns {Oklch} The Oklch color object.
 * @throws {Error} If the hex color format is invalid.
 */
export function hexToOklch(hex: string): Oklch {
  const rgb = hexToRgb(hex);
  const linear_rgb = rgb.map(srgbToLinearRgb) as [number, number, number];
  const xyz = linearRgbToXyz(linear_rgb);
  const oklab = xyzToOklab(xyz);
  const oklch = oklabToOklch(oklab);

  return {
    l: oklch[0] || 0,
    c: oklch[1] || 0,
    h: oklch[2] || 0,
  };
}

export function generateAccentColors(hex: string) {
  const base = hexToOklch(hex);

  const light = {
    "--background": `oklch(0.99 ${base.c * 0.05} ${base.h})`,
    "--foreground": `oklch(0.1 ${base.c * 0.1} ${base.h})`,
    "--card": `oklch(1 ${base.c * 0.02} ${base.h})`,
    "--card-foreground": `oklch(0.1 ${base.c * 0.1} ${base.h})`,
    "--popover": `oklch(1 ${base.c * 0.02} ${base.h})`,
    "--popover-foreground": `oklch(0.1 ${base.c * 0.1} ${base.h})`,
    "--primary": `oklch(0.6 ${base.c} ${base.h})`,
    "--primary-foreground": `oklch(${base.l > 0.6 ? 0.1 : 0.98} ${
      base.c * 0.2
    } ${base.h})`,
    "--secondary": `oklch(0.9 ${base.c * 0.4} ${base.h})`,
    "--secondary-foreground": `oklch(0.1 ${base.c * 0.8} ${base.h})`,
    "--muted": `oklch(0.95 ${base.c * 0.2} ${base.h})`,
    "--muted-foreground": `oklch(0.5 ${base.c * 0.4} ${base.h})`,
    "--accent": `oklch(0.98 ${base.c * 0.6} ${base.h})`,
    "--accent-foreground": `oklch(0.1 ${base.c * 0.8} ${base.h})`,
    "--destructive": "oklch(0.58 0.24 28)",
    "--destructive-foreground": "oklch(0.98 0.01 230)",
    "--success": "oklch(0.55 0.15 142)",
    "--success-foreground": "oklch(0.98 0.01 230)",
    "--warning": "oklch(0.65 0.15 38)",
    "--warning-foreground": "oklch(0.2 0.03 230)",
    "--border": `oklch(0.9 ${base.c * 0.3} ${base.h})`,
    "--input": `oklch(0.9 ${base.c * 0.3} ${base.h})`,
    "--ring": `oklch(0.6 ${base.c} ${base.h})`,
    "--sidebar": `oklch(0.98 ${base.c * 0.05} ${base.h})`,
    "--sidebar-foreground": `oklch(0.1 ${base.c * 0.1} ${base.h})`,
    "--sidebar-primary": `oklch(0.6 ${base.c} ${base.h})`,
    "--sidebar-primary-foreground": `oklch(${base.l > 0.6 ? 0.1 : 0.98} ${
      base.c * 0.2
    } ${base.h})`,
    "--sidebar-accent": `oklch(0.9 ${base.c * 0.4} ${base.h})`,
    "--sidebar-accent-foreground": `oklch(0.1 ${base.c * 0.8} ${base.h})`,
    "--sidebar-border": `oklch(0.9 ${base.c * 0.3} ${base.h})`,
    "--sidebar-ring": `oklch(0.6 ${base.c} ${base.h})`,
    "--navbar": `oklch(1 ${base.c * 0.02} ${base.h})`,
    "--navbar-foreground": `oklch(0.1 ${base.c * 0.1} ${base.h})`,
    "--navbar-border": `oklch(0.9 ${base.c * 0.3} ${base.h})`,
  };

  const dark = {
    "--background": `oklch(0.1 ${base.c * 0.1} ${base.h})`,
    "--foreground": `oklch(0.95 ${base.c * 0.05} ${base.h})`,
    "--card": `oklch(0.15 ${base.c * 0.15} ${base.h})`,
    "--card-foreground": `oklch(0.95 ${base.c * 0.05} ${base.h})`,
    "--popover": `oklch(0.17 ${base.c * 0.2} ${base.h})`,
    "--popover-foreground": `oklch(0.95 ${base.c * 0.05} ${base.h})`,
    "--primary": `oklch(0.7 ${base.c} ${base.h})`,
    "--primary-foreground": `oklch(${base.l > 0.6 ? 0.1 : 0.98} ${
      base.c * 0.2
    } ${base.h})`,
    "--secondary": `oklch(0.3 ${base.c * 0.7} ${base.h})`,
    "--secondary-foreground": `oklch(${base.l > 0.6 ? 0.1 : 0.98} ${
      base.c * 0.2
    } ${base.h})`,
    "--muted": `oklch(0.25 ${base.c * 0.3} ${base.h})`,
    "--muted-foreground": `oklch(0.7 ${base.c * 0.2} ${base.h})`,
    "--accent": `oklch(0.3 ${base.c * 0.5} ${base.h})`,
    "--accent-foreground": `oklch(0.95 ${base.c * 0.05} ${base.h})`,
    "--destructive": "oklch(0.7 0.19 22)",
    "--destructive-foreground": "oklch(0.2 0.03 230)",
    "--success": "oklch(0.6 0.15 142)",
    "--success-foreground": "oklch(0.98 0.01 230)",
    "--warning": "oklch(0.7 0.15 38)",
    "--warning-foreground": "oklch(0.2 0.03 230)",
    "--border": `oklch(0.28 ${base.c * 0.4} ${base.h})`,
    "--input": `oklch(0.35 ${base.c * 0.4} ${base.h})`,
    "--ring": `oklch(0.7 ${base.c} ${base.h})`,
    "--sidebar": `oklch(0.1 ${base.c * 0.1} ${base.h})`,
    "--sidebar-foreground": `oklch(0.95 ${base.c * 0.05} ${base.h})`,
    "--sidebar-primary": `oklch(0.7 ${base.c} ${base.h})`,
    "--sidebar-primary-foreground": `oklch(${base.l > 0.6 ? 0.1 : 0.98} ${
      base.c * 0.2
    } ${base.h})`,
    "--sidebar-accent": `oklch(0.3 ${base.c * 0.7} ${base.h})`,
    "--sidebar-accent-foreground": `oklch(0.95 ${base.c * 0.05} ${base.h})`,
    "--sidebar-border": `oklch(0.28 ${base.c * 0.4} ${base.h})`,
    "--sidebar-ring": `oklch(0.7 ${base.c} ${base.h})`,
    "--navbar": `oklch(0.15 ${base.c * 0.15} ${base.h})`,
    "--navbar-foreground": `oklch(0.95 ${base.c * 0.05} ${base.h})`,
    "--navbar-border": `oklch(0.28 ${base.c * 0.4} ${base.h})`,
  };

  return { light, dark };
}

/**
 * Converts a hexadecimal color string to an array of R, G, B components (0-255).
 * Supports "#RRGGBB", "RRGGBB", "#RGB", "RGB" formats.
 * @param {string} hex - The hexadecimal color string.
 * @returns {number[]} An array [r, g, b].
 * @throws {Error} If the hex color format is invalid.
 */
function hexToRgb(hex: string): [number, number, number] {
  let r = 0,
    g = 0,
    b = 0;

  // Remove '#' if present
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }

  // Handle 3-digit hex (e.g., "F0C" -> "FF00CC")
  if (hex.length === 3) {
    const chars = hex.split("");
    if (
      chars.length === 3 &&
      chars.every((char) => /^[0-9A-Fa-f]$/.test(char))
    ) {
      r = parseInt(chars[0]! + chars[0]!, 16);
      g = parseInt(chars[1]! + chars[1]!, 16);
      b = parseInt(chars[2]! + chars[2]!, 16);
    } else {
      throw new Error("Invalid 3-digit hex color format.");
    }
  }
  // Handle 6-digit hex (e.g., "FF00CC")
  else if (hex.length === 6) {
    const rStr = hex.substring(0, 2);
    const gStr = hex.substring(2, 4);
    const bStr = hex.substring(4, 6);

    if (
      /^[0-9A-Fa-f]{2}$/.test(rStr) &&
      /^[0-9A-Fa-f]{2}$/.test(gStr) &&
      /^[0-9A-Fa-f]{2}$/.test(bStr)
    ) {
      r = parseInt(rStr, 16);
      g = parseInt(gStr, 16);
      b = parseInt(bStr, 16);
    } else {
      throw new Error("Invalid 6-digit hex color format.");
    }
  } else {
    throw new Error("Invalid hex color format. Use #RRGGBB or #RGB.");
  }

  return [r, g, b];
}

/**
 * Converts an sRGB component (0-255) to a linear sRGB component (0-1).
 * @param {number} c - The sRGB component value (0-255).
 * @returns {number} The linear sRGB component value (0-1).
 */
function srgbToLinearRgb(c: number) {
  c /= 255; // Normalize to [0, 1]
  // Apply the sRGB gamma correction formula.
  if (c <= 0.04045) {
    return c / 12.92;
  } else {
    return Math.pow((c + 0.055) / 1.055, 2.4);
  }
}

/**
 * Multiplies a 3x3 matrix by a 3-element vector.
 * @param {number[][]} matrix - The 3x3 matrix.
 * @param {number[]} vector - The 3-element vector.
 * @returns {number[]} The resulting 3-element vector.
 */
function multiplyMatrix(
  matrix: number[][],
  vector: number[],
): [number, number, number] {
  const result = new Array(matrix.length).fill(0);
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < vector.length; j++) {
      result[i]! += matrix[i]![j]! * vector[j]!;
    }
  }
  return [result[0]!, result[1]!, result[2]!];
}

/**
 * Converts linear sRGB values to CIE XYZ values (D65 white point).
 * @param {number[]} rgb_linear - An array [r, g, b] of linear sRGB components (0-1).
 * @returns {number[]} An array [X, Y, Z] of CIE XYZ components.
 */
function linearRgbToXyz(
  rgb_linear: [number, number, number],
): [number, number, number] {
  // Standard sRGB to XYZ D65 conversion matrix.
  const M_srgb_to_xyz = [
    [0.4123908, 0.35758434, 0.18048079],
    [0.21263901, 0.71516868, 0.07219232],
    [0.01933082, 0.11919478, 0.95053215],
  ];
  return multiplyMatrix(M_srgb_to_xyz, rgb_linear);
}

/**
 * Converts CIE XYZ values to Oklab values.
 * @param {number[]} xyz - An array [X, Y, Z] of CIE XYZ components.
 * @returns {number[]} An array [L, a, b] of Oklab components.
 */
function xyzToOklab(xyz: [number, number, number]): [number, number, number] {
  // Convert XYZ to LMS (linear cone responses).
  const M_xyz_to_lms = [
    [0.81890226, 0.03298366, 0.05591174],
    [0.36186742, 0.638518, 0.00083942],
    [0, 0, 0.82521],
  ];
  const lms = multiplyMatrix(M_xyz_to_lms, xyz);

  // Apply cube root non-linearity to LMS values.
  const lms_prime = lms.map((val) => Math.cbrt(val)) as [
    number,
    number,
    number,
  ];

  // Convert LMS' to Oklab.
  const M_lms_prime_to_oklab = [
    [0.2104542553, 0.793617785, -0.0040720468],
    [1.9779984951, -2.428592205, 0.4505937099],
    [0.0259040371, 0.7827717662, -0.808675766],
  ];
  return multiplyMatrix(M_lms_prime_to_oklab, lms_prime);
}

/**
 * Converts Oklab values to Oklch values.
 * @param {number[]} oklab - An array [L, a, b] of Oklab components (L in 0-1).
 * @returns {number[]} An array [L, C, h] of Oklch components (L in 0-100, h in degrees).
 */
function oklabToOklch(oklab: number[]): [number, number, number] {
  const L = oklab[0] ?? 0; // Oklab L is 0-1
  const a = oklab[1] ?? 0;
  const b = oklab[2] ?? 0;

  const C = Math.sqrt(a * a + b * b); // Chroma
  let h = Math.atan2(b, a) * (180 / Math.PI); // Hue in degrees

  // Normalize hue to [0, 360)
  if (h < 0) {
    h += 360;
  }

  // Oklch L is typically scaled to 0-100.
  return [L, C, h];
}
