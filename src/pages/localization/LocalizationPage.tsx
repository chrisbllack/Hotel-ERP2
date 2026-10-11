import {
  BadgeCheck,
  CalendarDays,
  Coins,
  CreditCard,
  Globe2,
  Landmark,
  ScrollText,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge, Card, CardHeader, Table, Td } from "../../components/ui/primitives";
import { PageHeader } from "../../components/ui/primitives";
import { cn, money } from "../../lib/utils";
import { useMarket } from "../../i18n/MarketProvider";
import { MARKETS } from "../../i18n/markets";

const FISCAL_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function fiscalYearMonths(start: string): string[] {
  const startMonth = Number(start.slice(0, 2)) - 1;
  return Array.from({ length: 12 }, (_, i) => FISCAL_MONTHS[(startMonth + i) % 12]);
}

function pct(rate: number): string {
  return `${+(rate * 100).toFixed(2)}%`;
}

export default function LocalizationPage() {
  const { marketId, setMarket } = useMarket();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Localization & Compliance"
        subtitle="One platform, four first-class markets — tax, fiscal calendars, payment rails, invoice instruments and statutory compliance for the US, India, Nigeria and China."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MARKETS.map((m) => {
          const active = m.id === marketId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMarket(m.id)}
              aria-pressed={active}
              className={cn(
                "rounded-xl border p-5 text-left transition-all",
                active
                  ? "border-gold-400 bg-gold-500/10 ring-1 ring-gold-400/60"
                  : "border-brand-800/70 bg-brand-900/40 hover:border-gold-500/40 hover:bg-brand-900/70",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl" aria-hidden="true">{m.flag}</span>
                {active ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-brand-950">
                    <BadgeCheck size={13} />
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wide text-brand-200/50">Select</span>
                )}
              </div>
              <p className="mt-3 font-display text-lg text-brand-50">{m.country}</p>
              <p className="mt-0.5 text-xs text-brand-200/60">
                {m.id} · {m.currency} · {m.locale}
              </p>
              <p className="mt-3 text-xs text-brand-100/70">
                {m.taxes[0]?.name} @ {pct(m.taxes[0]?.rate ?? 0)}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Tax Engine" subtitle="Statutory components applied per revenue stream — inclusive or exclusive" />
          <Table head={["Tax", "Rate", "Scope", "Basis"]}>
            {MARKETS.map((m) =>
              m.taxes.map((t, i) => (
                <tr key={`${m.id}-${i}`} className={m.id === marketId ? "bg-gold-500/5" : undefined}>
                  <Td>
                    <span className="mr-2" aria-hidden="true">{m.flag}</span>
                    {t.name}
                  </Td>
                  <Td className="text-gold-300">{pct(t.rate)}</Td>
                  <Td className="capitalize text-xs">{t.scope}</Td>
                  <Td className="text-xs">{t.inclusive ? "Inclusive" : "Exclusive"}</Td>
                </tr>
              )),
            )}
          </Table>
        </Card>

        <Card>
          <CardHeader title="Fiscal Calendar & Reporting" subtitle="Fiscal year start and reporting conventions per market" />
          <div className="space-y-4 p-5">
            {MARKETS.map((m) => (
              <div key={m.id} className={cn("rounded-lg border p-4", m.id === marketId ? "border-gold-500/40 bg-gold-500/5" : "border-brand-800/60")}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-brand-50">
                    <span aria-hidden="true">{m.flag}</span> {m.country}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-brand-200/70">
                    <CalendarDays size={13} /> FY starts {m.fiscalYearStart}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {fiscalYearMonths(m.fiscalYearStart).map((mo, i) => (
                    <span
                      key={`${m.id}-${mo}`}
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px]",
                        i === 0 ? "bg-gold-500/20 text-gold-200" : "bg-brand-900/60 text-brand-200/60",
                      )}
                    >
                      {mo}
                    </span>
                  ))}
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-brand-200/60">
                  <ScrollText size={12} /> Invoice instrument: <span className="text-brand-100">{m.invoiceName}</span>
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Payment Rails" subtitle="Locally-preferred and statutory payment methods" />
          <div className="space-y-3 p-5">
            {MARKETS.map((m) => (
              <div key={m.id}>
                <p className="mb-1.5 flex items-center gap-2 text-xs font-medium text-brand-100">
                  <span aria-hidden="true">{m.flag}</span> {m.country}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {m.paymentRails.map((rail) => (
                    <Badge key={`${m.id}-${rail}`} className="border-brand-700 bg-brand-900/60 text-brand-100/80">
                      <CreditCard size={11} /> {rail}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Compliance Checklist" subtitle="Statutory and operational obligations surfaced to finance" />
          <div className="space-y-3 p-5">
            {MARKETS.map((m) => (
              <div key={m.id}>
                <p className="mb-1.5 flex items-center gap-2 text-xs font-medium text-brand-100">
                  <span aria-hidden="true">{m.flag}</span> {m.country}
                </p>
                <ul className="space-y-1">
                  {m.compliance.map((c) => (
                    <li key={`${m.id}-${c}`} className="flex items-start gap-2 text-xs text-brand-100/70">
                      <BadgeCheck size={13} className="mt-0.5 flex-none text-emerald-400" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Guest-Facing Norms" subtitle="Local expectations that shape defaults across booking, F&B and billing" />
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {MARKETS.map((m) => (
              <div key={m.id} className={cn("rounded-lg border p-4", m.id === marketId ? "border-gold-500/40 bg-gold-500/5" : "border-brand-800/60")}>
                <p className="flex items-center gap-2 text-sm text-brand-50">
                  <span aria-hidden="true">{m.flag}</span> {m.country}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {m.guestNorms.map((n) => (
                    <li key={`${m.id}-${n}`} className="flex items-start gap-2 text-xs text-brand-100/70">
                      <Sparkles size={12} className="mt-0.5 flex-none text-gold-400" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Live Money Preview" subtitle="How amounts render under each market locale" />
          <div className="space-y-3 p-5">
            {MARKETS.map((m) => {
              const sample = 125000;
              const fmt = new Intl.NumberFormat(m.locale, { style: "currency", currency: m.currency });
              return (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-brand-800/60 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-xs text-brand-100/80">
                    <span aria-hidden="true">{m.flag}</span> {m.currency}
                  </span>
                  <span className="font-mono text-sm text-brand-50">{fmt.format(sample / 100)}</span>
                </div>
              );
            })}
            <div className="rounded-lg border border-gold-500/30 bg-gold-500/5 px-3 py-2.5">
              <p className="flex items-center gap-2 text-xs text-gold-200">
                <Coins size={13} /> Active: {MARKETS.find((m) => m.id === marketId)?.country}
              </p>
              <p className="mt-1 font-mono text-sm text-brand-50">{money(1250)}</p>
            </div>
            <p className="text-[11px] text-brand-200/50">
              Switching the market updates currency, locale, tax defaults and date formats across every screen.
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Globe2, title: "Global, not generic", body: "Four markets are configured to local statute — not a single US-centric default with translations bolted on." },
          { icon: Landmark, title: "Compliance-first", body: "Fapiao, GST e-invoicing and FIRS readiness are surfaced as first-class obligations, not footnotes." },
          { icon: Users, title: "Guest-appropriate", body: "Service-charge, gratuity and inclusive-pricing norms follow the guest's home market." },
        ].map((f) => (
          <Card key={f.title} className="p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/15 text-gold-400 ring-1 ring-brand-400/30">
              <f.icon size={17} />
            </div>
            <p className="mt-3 font-display text-base text-brand-50">{f.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-brand-100/70">{f.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
