// Unit tests for the theme registry (src/theme/themes.ts) — the 7 selectable
// UI identities, their id/name uniqueness, and the safe-fallback helpers.
// Run with: bun test

import { describe, expect, test } from "bun:test";
import { DEFAULT_THEME, THEMES, getTheme, isThemeId } from "../theme/themes";

describe("theme registry", () => {
  test("ships exactly 7 selectable themes", () => {
    expect(THEMES).toHaveLength(7);
  });

  test("includes both dark and light modes", () => {
    const modes = new Set(THEMES.map((t) => t.mode));
    expect(modes.has("dark")).toBe(true);
    expect(modes.has("light")).toBe(true);
  });

  test("theme ids are unique", () => {
    const ids = THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("theme names are unique", () => {
    const names = THEMES.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test("every theme carries a 3-colour swatch and an influence list", () => {
    for (const theme of THEMES) {
      expect(theme.swatch).toHaveLength(3);
      expect(theme.swatch.every((c) => /^#[0-9a-f]{6}$/i.test(c))).toBe(true);
      expect(theme.influences.length).toBeGreaterThan(0);
      expect(theme.tagline.length).toBeGreaterThan(0);
    }
  });

  test("the default theme exists in the registry", () => {
    expect(THEMES.some((t) => t.id === DEFAULT_THEME)).toBe(true);
  });

  test("isThemeId accepts registered ids and rejects others", () => {
    expect(isThemeId("emerald")).toBe(true);
    expect(isThemeId("porcelain")).toBe(true);
    expect(isThemeId("neon")).toBe(false);
    expect(isThemeId(null)).toBe(false);
    expect(isThemeId(42)).toBe(false);
  });

  test("getTheme falls back to the first theme for unknown ids", () => {
    expect(getTheme("nope").id).toBe(THEMES[0].id);
    expect(getTheme("midnight").id).toBe("midnight");
  });
});
