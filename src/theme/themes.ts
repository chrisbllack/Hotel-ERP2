// Theme registry — the single source of truth for the 7 selectable identities.
// Palette values live in src/index.css under `html[data-theme="…"]`; this file
// carries the metadata the UI needs (labels, markets, swatches).

export type ThemeMode = "dark" | "light";

export type ThemeId =
  | "emerald"
  | "midnight"
  | "saffron"
  | "dynasty"
  | "lagoon"
  | "aurora"
  | "porcelain";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  mode: ThemeMode;
  /** Markets/brands this palette draws from — shown in the picker. */
  influences: string[];
  /** Three swatches (background, primary, accent) for previews. */
  swatch: [string, string, string];
}

export const DEFAULT_THEME: ThemeId = "emerald";

export const THEMES: ThemeDefinition[] = [
  {
    id: "emerald",
    name: "Emerald Executive",
    tagline: "Deep rainforest & brass",
    description:
      "The house default: deep emerald interiors with brass accents — the calm, confident register of an established grand hotel.",
    mode: "dark",
    influences: ["Luxury city hotels", "Nigeria", "Global flagship"],
    swatch: ["#081a15", "#2c765f", "#d9b54c"],
  },
  {
    id: "midnight",
    name: "Midnight Sapphire",
    tagline: "Boardroom navy & cyan",
    description:
      "Navy control-room aesthetic with electric-cyan accents. Built for revenue managers and finance teams who live in dense data.",
    mode: "dark",
    influences: ["United States", "Corporate & group", "Ops control rooms"],
    swatch: ["#0a1229", "#3f61bd", "#67e8f9"],
  },
  {
    id: "saffron",
    name: "Saffron Heritage",
    tagline: "Maroon & marigold",
    description:
      "Warm Indian-maroon canvas with marigold highlights. Celebratory and hospitality-forward; shines on banquet and wedding-led properties.",
    mode: "dark",
    influences: ["India", "Palace & heritage hotels", "Banqueting"],
    swatch: ["#2a0d08", "#f95d14", "#ffc94d"],
  },
  {
    id: "dynasty",
    name: "Jade Dynasty",
    tagline: "Ink, cinnabar & jade",
    description:
      "Ink-green ground with cinnabar seals. Restrained, precise, and auspicious — a natural fit for China-market luxury and MICE.",
    mode: "dark",
    influences: ["China", "Luxury & MICE", "Business travellers"],
    swatch: ["#090f0e", "#3c5a54", "#dc2626"],
  },
  {
    id: "lagoon",
    name: "Lagoon Resort",
    tagline: "Coastal teal & coral",
    description:
      "Bright lagoon teal with coral warmth and generous radii. Designed for resort, leisure and beach properties where the mood is airy.",
    mode: "dark",
    influences: ["Resorts & leisure", "Africa", "Caribbean-inspired"],
    swatch: ["#072628", "#1d9a97", "#ff9f6e"],
  },
  {
    id: "aurora",
    name: "Aurora Light",
    tagline: "Luminous & indigo",
    description:
      "A crisp light mode with cool indigo accents. High legibility for long back-office shifts and daylight front desks.",
    mode: "light",
    influences: ["Daytime operations", "Back office", "Accessibility"],
    swatch: ["#fbfbfe", "#4f46e5", "#6366f1"],
  },
  {
    id: "porcelain",
    name: "Porcelain",
    tagline: "Warm cream & jade",
    description:
      "Warm porcelain paper with a jade accent and serif display type. Quiet, editorial, gallery-calm — ideal for guest-facing and owner views.",
    mode: "light",
    influences: ["Guest experience", "Owner & investor views", "Editorial calm"],
    swatch: ["#fdfcf8", "#10b981", "#059669"],
  },
];

const THEME_IDS = new Set<string>(THEMES.map((t) => t.id));

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && THEME_IDS.has(value);
}

export function getTheme(id: string): ThemeDefinition {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
