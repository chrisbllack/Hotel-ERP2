// Multi-country market profiles — the tax, fiscal, payment and compliance
// norms a property inherits from its operating country. INFINEON ships four
// first-class markets (the "best of" the US, India, Nigeria and China) and the
// active profile drives money/date formatting, tax defaults, invoice naming
// and the compliance checklist surfaced to finance teams.
//
// This module is intentionally dependency-free so it can be imported by both
// the formatting helpers (src/lib/utils.ts) and React providers.

export type MarketId = "US" | "IN" | "NG" | "CN";

export interface TaxComponent {
  /** Display name, e.g. "VAT", "GST", "Sales Tax". */
  name: string;
  /** Fraction, e.g. 0.075 for 7.5%. */
  rate: number;
  /** True when the rate is already contained in quoted gross prices. */
  inclusive: boolean;
  /** Applies to which revenue streams. */
  scope: "rooms" | "fnb" | "both" | "services";
}

export interface MarketProfile {
  id: MarketId;
  country: string;
  flag: string;
  locale: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  /** Fiscal year start as MM-DD (varies: India uses 04-01). */
  fiscalYearStart: string;
  taxes: TaxComponent[];
  /** Charge/service conventions layered on top of statutory tax. */
  serviceChargeRate: number;
  paymentRails: string[];
  /** Statutory / operational compliance items surfaced to finance. */
  compliance: string[];
  /** Local invoice instrument name (fapiao, GST invoice, tax invoice…). */
  invoiceName: string;
  /** Guest-facing norms that shape UX defaults. */
  guestNorms: string[];
}

export const MARKETS: MarketProfile[] = [
  {
    id: "US",
    country: "United States",
    flag: "🇺🇸",
    locale: "en-US",
    currency: "USD",
    currencySymbol: "$",
    timezone: "America/New_York",
    fiscalYearStart: "01-01",
    taxes: [
      { name: "State & Local Sales Tax", rate: 0.08875, inclusive: false, scope: "both" },
      { name: "Occupancy / Lodging Tax", rate: 0.06, inclusive: false, scope: "rooms" },
    ],
    serviceChargeRate: 0,
    paymentRails: ["Stripe", "Card (Visa/MC/Amex)", "ACH", "Apple Pay / Google Pay"],
    compliance: [
      "PCI-DSS v4.0",
      "USALI 11th Edition reporting",
      "ADA digital accessibility (WCAG 2.1 AA)",
      "Form 1099-K vendor thresholds",
    ],
    invoiceName: "Invoice",
    guestNorms: [
      "Automatic gratuity on F&B for parties of six or more",
      "State-level lodging tax by jurisdiction",
      "ZIP-level tax lookup",
    ],
  },
  {
    id: "IN",
    country: "India",
    flag: "🇮🇳",
    locale: "en-IN",
    currency: "INR",
    currencySymbol: "₹",
    timezone: "Asia/Kolkata",
    fiscalYearStart: "04-01",
    taxes: [
      { name: "GST — Rooms (tariff ≤ ₹7,500)", rate: 0.12, inclusive: false, scope: "rooms" },
      { name: "GST — Rooms (tariff > ₹7,500)", rate: 0.18, inclusive: false, scope: "rooms" },
      { name: "GST — F&B (non-AC / standalone)", rate: 0.05, inclusive: false, scope: "fnb" },
      { name: "GST — F&B (AC restaurant)", rate: 0.18, inclusive: false, scope: "fnb" },
    ],
    serviceChargeRate: 0,
    paymentRails: ["Razorpay", "UPI", "Card (RuPay/Visa/MC)", "Net Banking", "Paytm Wallet"],
    compliance: [
      "GST e-invoicing (turnover over ₹5 Cr)",
      "GSTIN validation",
      "TDS/TCS on vendor payments",
      "FSSAI licence for F&B outlets",
    ],
    invoiceName: "GST Tax Invoice",
    guestNorms: [
      "Slab-wise GST on room tariff",
      "Complimentary breakfast common in tariffs",
      "PAN capture for high-value stays",
    ],
  },
  {
    id: "NG",
    country: "Nigeria",
    flag: "🇳🇬",
    locale: "en-NG",
    currency: "NGN",
    currencySymbol: "₦",
    timezone: "Africa/Lagos",
    fiscalYearStart: "01-01",
    taxes: [
      { name: "VAT", rate: 0.075, inclusive: false, scope: "both" },
      { name: "Consumption Tax (Lagos)", rate: 0.05, inclusive: false, scope: "both" },
      { name: "FIRS Withholding Tax (vendors)", rate: 0.05, inclusive: false, scope: "services" },
    ],
    serviceChargeRate: 0.1,
    paymentRails: ["Paystack", "Flutterwave", "Bank Transfer (NIBSS)", "USSD", "POS Terminal"],
    compliance: [
      "FIRS e-invoicing readiness",
      "VAT remittance (21st monthly)",
      "Lagos State consumption tax",
      "CBN cashless policy",
    ],
    invoiceName: "Tax Invoice",
    guestNorms: [
      "10% service charge distributed to staff",
      "Naira-first pricing, USD for expatriate corporate accounts",
      "Generator/diesel cost awareness",
    ],
  },
  {
    id: "CN",
    country: "China",
    flag: "🇨🇳",
    locale: "zh-CN",
    currency: "CNY",
    currencySymbol: "¥",
    timezone: "Asia/Shanghai",
    fiscalYearStart: "01-01",
    taxes: [
      { name: "VAT — Modern services (accommodation)", rate: 0.06, inclusive: true, scope: "both" },
      { name: "VAT — General goods (F&B retail)", rate: 0.13, inclusive: true, scope: "fnb" },
    ],
    serviceChargeRate: 0.15,
    paymentRails: ["WeChat Pay", "Alipay", "UnionPay", "Digital CNY (e-CNY)"],
    compliance: [
      "Golden Tax System fapiao issuance",
      "Resident ID / passport registration (PSB)",
      "Social insurance contributions",
      "Baidu ICP filing for digital channels",
    ],
    invoiceName: "Fapiao",
    guestNorms: [
      "Prices shown VAT-inclusive",
      "15% service charge standard",
      "WeChat/Alipay QR-first payments",
      "Mandarin + English dual labelling",
    ],
  },
];

export const DEFAULT_MARKET: MarketId = "NG";

export function isMarketId(value: unknown): value is MarketId {
  return value === "US" || value === "IN" || value === "NG" || value === "CN";
}

export function getMarket(id: string): MarketProfile {
  return MARKETS.find((m) => m.id === id) ?? MARKETS.find((m) => m.id === DEFAULT_MARKET)!;
}
