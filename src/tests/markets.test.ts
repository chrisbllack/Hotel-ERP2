// Unit tests for the multi-market localization engine (src/i18n/markets.ts)
// and the locale-aware money formatter (src/lib/utils.ts). These guard the
// US/IN/NG/CN profiles that drive currency, tax and formatting defaults.
// Run with: bun test

import { describe, expect, test } from "bun:test";
import { DEFAULT_MARKET, MARKETS, getMarket, isMarketId } from "../i18n/markets";
import { configureFormatter, money, num } from "../lib/utils";

// Mirrors MarketProvider.taxRateFor: sum every component whose scope matches
// the requested stream (an explicit scope) or applies to "both".
function taxRateFor(marketId: string, scope: "rooms" | "fnb" | "both" | "services"): number {
  return getMarket(marketId)
    .taxes.filter((t) => t.scope === scope || t.scope === "both")
    .reduce((sum, t) => sum + t.rate, 0);
}

describe("market profiles", () => {
  test("ships exactly the four first-class markets", () => {
    expect(MARKETS.map((m) => m.id)).toEqual(["US", "IN", "NG", "CN"]);
  });

  test("every profile has a distinct currency and locale", () => {
    const currencies = new Set(MARKETS.map((m) => m.currency));
    const locales = new Set(MARKETS.map((m) => m.locale));
    expect(currencies.size).toBe(MARKETS.length);
    expect(locales.size).toBe(MARKETS.length);
  });

  test("isMarketId accepts known ids and rejects anything else", () => {
    expect(isMarketId("US")).toBe(true);
    expect(isMarketId("CN")).toBe(true);
    expect(isMarketId("NG")).toBe(true);
    expect(isMarketId("IN")).toBe(true);
    expect(isMarketId("ng")).toBe(false);
    expect(isMarketId(null)).toBe(false);
    expect(isMarketId(undefined)).toBe(false);
    expect(isMarketId("XX")).toBe(false);
  });

  test("getMarket falls back to the default for unknown ids", () => {
    expect(getMarket("ZZ").id).toBe(DEFAULT_MARKET);
    expect(getMarket("US").id).toBe("US");
  });

  test("India fiscal year starts in April; others in January", () => {
    expect(getMarket("IN").fiscalYearStart).toBe("04-01");
    expect(getMarket("US").fiscalYearStart).toBe("01-01");
    expect(getMarket("NG").fiscalYearStart).toBe("01-01");
    expect(getMarket("CN").fiscalYearStart).toBe("01-01");
  });
});

describe("tax resolution by revenue stream", () => {
  test("Nigeria applies VAT 7.5% + Lagos consumption 5% to rooms", () => {
    expect(taxRateFor("NG", "rooms")).toBeCloseTo(0.125, 6);
  });

  test("Nigeria 'both' stream picks up VAT + consumption; not FIRS WHT", () => {
    expect(taxRateFor("NG", "both")).toBeCloseTo(0.125, 6);
  });

  test("Nigeria vendor services attract only the 5% withholding tax", () => {
    expect(taxRateFor("NG", "services")).toBeCloseTo(0.05, 6);
  });

  test("India room GST is slab-based — sum of the two room components", () => {
    expect(taxRateFor("IN", "rooms")).toBeCloseTo(0.30, 6);
  });

  test("US rooms carry sales tax + occupancy tax", () => {
    expect(taxRateFor("US", "rooms")).toBeCloseTo(0.14875, 6);
  });

  test("China accommodation VAT is 6% and flagged inclusive", () => {
    const cn = getMarket("CN");
    const accommodation = cn.taxes.find((t) => t.scope === "both");
    expect(accommodation?.rate).toBeCloseTo(0.06, 6);
    expect(accommodation?.inclusive).toBe(true);
  });
});

describe("locale-aware money formatting", () => {
  test("formats in the active market currency", () => {
    configureFormatter("US");
    expect(money(1234.5)).toContain("$");
    configureFormatter("CN");
    expect(money(1234.5)).toContain("¥");
    configureFormatter("NG");
    expect(money(1234.5)).toContain("₦");
  });

  test("respects the locale's digit grouping", () => {
    configureFormatter("US");
    expect(money(1000000)).toBe("$1,000,000.00");
    configureFormatter("IN");
    // Indian grouping: last three digits, then pairs (12,34,567).
    expect(money(1234567)).toContain("12,34,567");
  });

  test("compact notation abbreviates large magnitudes", () => {
    configureFormatter("US");
    const compact = money(2_450_000, true);
    expect(compact).toContain("$");
    expect(compact.length).toBeLessThan(money(2_450_000).length);
  });

  test("num() accepts numeric input after a market switch", () => {
    configureFormatter("IN");
    expect(num(1234567)).toBe("12,34,567");
  });

  test("configureFormatter ignores unknown ids by falling back", () => {
    configureFormatter("ZZ");
    expect(money(100)).toContain(getMarket(DEFAULT_MARKET).currencySymbol);
  });
});
