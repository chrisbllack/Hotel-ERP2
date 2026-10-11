import { useMemo, useState } from "react";
import {
  Activity,
  Banknote,
  Gauge,
  Landmark,
  LineChart,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge, Card, CardHeader, StatCard, Table, Td } from "../ui/primitives";
import { money, num } from "../../lib/utils";
import { initialFinancialAgility } from "../../data/financeOpsData";
import type { FinancialRatio, ScenarioResult } from "../../types";

type Tab = "ratios" | "liquidity" | "treasury" | "variance";

const CATEGORY_LABEL: Record<FinancialRatio["category"], string> = {
  liquidity: "Liquidity",
  profitability: "Profitability",
  efficiency: "Efficiency",
  leverage: "Leverage",
  hospitality: "Hospitality KPIs",
};

function ratioDisplay(r: FinancialRatio): string {
  if (r.unit === "percent") return `${(r.value * 100).toFixed(1)}%`;
  if (r.unit === "days") return `${r.value} days`;
  if (r.unit === "currency") return money(r.value, true);
  return r.value.toFixed(2);
}

function ratioHealth(r: FinancialRatio): "good" | "watch" | "bad" {
  const better = r.higherIsBetter ? r.value >= r.benchmark : r.value <= r.benchmark;
  if (better) return "good";
  const gap = Math.abs((r.value - r.benchmark) / (r.benchmark || 1));
  return gap > 0.15 ? "bad" : "watch";
}

const VERDICT_STYLE: Record<ScenarioResult["verdict"], string> = {
  healthy: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  watch: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  stressed: "border-rose-400/40 bg-rose-500/10 text-rose-200",
};

export function FinancialAgilityView() {
  const data = initialFinancialAgility;
  const [tab, setTab] = useState<Tab>("ratios");
  const [category, setCategory] = useState<FinancialRatio["category"] | "all">("all");

  const ratios = useMemo(
    () => (category === "all" ? data.ratios : data.ratios.filter((r) => r.category === category)),
    [data.ratios, category],
  );

  const totalCash = data.treasuryAccounts.reduce((a, t) => a + t.balance, 0);
  const availableCash = data.treasuryAccounts.reduce((a, t) => a + t.availableBalance, 0);
  const unreconciled = data.treasuryAccounts.reduce((a, t) => a + t.unreconciledItems, 0);
  const minCash = Math.min(...data.cashPosition.map((c) => c.closingCash));
  const maxCash = Math.max(...data.cashPosition.map((c) => c.closingCash));
  const range = maxCash - minCash || 1;

  const tabs: Array<[Tab, string, typeof Gauge]> = [
    ["ratios", "Financial Ratios", Gauge],
    ["liquidity", "Cash & Scenario Planning", LineChart],
    ["treasury", "Treasury & Banking", Landmark],
    ["variance", "Budget vs Actual", Activity],
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Cash & Equivalents" value={money(totalCash, true)} sub={`${money(availableCash, true)} available after holds`} accent="emerald" />
        <StatCard label="Minimum Reserve" value={money(minCash, true)} sub="Projected trough over 6 weeks" accent="gold" />
        <StatCard label="Scenarios Run" value={num(data.scenarios.length)} sub={`${data.scenarios.filter((s) => s.covenantBreach).length} flagged covenant risk`} accent="sky" />
        <StatCard label="Unreconciled Items" value={num(unreconciled)} sub="Across 5 treasury accounts" accent={unreconciled > 3 ? "rose" : "emerald"} />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-brand-800/80 pb-3">
        {tabs.map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition ${
              tab === key
                ? "border-gold-400/50 bg-brand-500/20 font-semibold text-gold-200"
                : "border-brand-800/80 bg-brand-900/40 text-brand-100/70 hover:border-brand-600 hover:text-brand-50"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === "ratios" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["all", "liquidity", "profitability", "efficiency", "leverage", "hospitality"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  category === c ? "border-gold-400/60 bg-gold-500/15 text-gold-200" : "border-brand-800 text-brand-200/70 hover:text-brand-50"
                }`}
              >
                {c === "all" ? "All" : CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ratios.map((r) => {
              const health = ratioHealth(r);
              const tone = health === "good" ? "text-emerald-300" : health === "watch" ? "text-amber-300" : "text-rose-300";
              const Icon = health === "good" ? TrendingUp : TrendingDown;
              return (
                <Card key={r.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-brand-50">{r.name}</p>
                      <p className="text-[11px] uppercase tracking-wide text-brand-200/50">{CATEGORY_LABEL[r.category]}</p>
                    </div>
                    <Icon size={16} className={tone} />
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <p className={`font-display text-2xl ${tone}`}>{ratioDisplay(r)}</p>
                    <p className="text-xs text-brand-200/60">target {ratioDisplay({ ...r, value: r.benchmark })}</p>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-900/70">
                    <div
                      className={health === "good" ? "h-full bg-emerald-400" : health === "watch" ? "h-full bg-amber-400" : "h-full bg-rose-400"}
                      style={{ width: `${Math.min(100, (r.value / (Math.max(r.value, r.benchmark) || 1)) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-brand-100/70">{r.interpretation}</p>
                  <p className="mt-2 text-[10px] font-mono text-brand-200/40">{r.formula}</p>
                </Card>
              );
            })}
          </div>
        </div>
      ) : null}

      {tab === "liquidity" ? (
        <div className="space-y-5">
          <Card>
            <CardHeader title="Cash Position — 6-Week Projection" subtitle="Operating, investing and financing flows against the minimum reserve line" />
            <div className="p-5">
              <div className="flex h-56 items-end gap-4">
                {data.cashPosition.map((c) => {
                  const height = 40 + ((c.closingCash - minCash) / range) * 55;
                  const breached = c.closingCash < c.minimumReserve;
                  return (
                    <div key={c.date} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-[10px] text-brand-200/70">{money(c.closingCash, true)}</span>
                      <div
                        className={`w-full rounded-t-md ${breached ? "bg-gradient-to-t from-rose-600 to-rose-400" : "bg-gradient-to-t from-brand-600 to-gold-500"}`}
                        style={{ height: `${height}%` }}
                        title={`Closing cash ${money(c.closingCash)}`}
                      />
                      <span className="text-[10px] text-brand-200/50">{c.date.slice(5)}</span>
                      <div className="flex gap-0.5">
                        <span className={c.operating >= 0 ? "text-emerald-400" : "text-rose-400"} title="Operating">•</span>
                        <span className={c.investing >= 0 ? "text-emerald-400" : "text-rose-400"} title="Investing">•</span>
                        <span className={c.financing >= 0 ? "text-emerald-400" : "text-rose-400"} title="Financing">•</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-4 text-[11px] text-brand-200/60">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Positive flow</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" /> Negative flow</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold-500" /> Closing cash bar</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Scenario Planning" subtitle="Stress-test occupancy, rate, payroll, collections and capex in one pass" />
            <Table head={["Scenario", "Occ / ADR", "Payroll", "Collections", "Revenue", "EBITDA", "Closing cash", "Runway", "Verdict"]}>
              {data.scenarios.map((s) => (
                <tr key={s.id}>
                  <Td className="text-brand-50">{s.name}</Td>
                  <Td className="text-xs">{s.assumptions.occupancyAdjustmentPct >= 0 ? "+" : ""}{s.assumptions.occupancyAdjustmentPct}% / {s.assumptions.adrAdjustmentPct >= 0 ? "+" : ""}{s.assumptions.adrAdjustmentPct}%</Td>
                  <Td className="text-xs">{s.assumptions.payrollAdjustmentPct >= 0 ? "+" : ""}{s.assumptions.payrollAdjustmentPct}%</Td>
                  <Td className="text-xs">+{s.assumptions.arCollectionDelayDays}d{s.assumptions.capexFreeze ? " · capex frozen" : ""}</Td>
                  <Td>{money(s.projectedRevenue, true)}</Td>
                  <Td>{money(s.projectedEbitda, true)}</Td>
                  <Td className={s.projectedClosingCash < 25000000 ? "text-rose-300" : "text-emerald-300"}>{money(s.projectedClosingCash, true)}</Td>
                  <Td>{s.runwayWeeks} wks</Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      {s.covenantBreach ? <ShieldAlert size={13} className="text-rose-300" /> : <ShieldCheck size={13} className="text-emerald-300" />}
                      <Badge className={VERDICT_STYLE[s.verdict]}>{s.verdict}</Badge>
                    </div>
                  </Td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      ) : null}

      {tab === "treasury" ? (
        <Card>
          <CardHeader title="Treasury Accounts & Banking" subtitle="Operating, payroll, tax, reserve and collections accounts with sweep targets" />
          <Table head={["Account", "Bank", "Type", "Currency", "Balance", "Available", "Sweep target", "Last reconciled", "Unreconciled"]}>
            {data.treasuryAccounts.map((t) => (
              <tr key={t.id}>
                <Td className="text-brand-50">{t.name}</Td>
                <Td className="text-xs">{t.bank}</Td>
                <Td><Badge className="border-brand-400/40 bg-brand-500/10 text-brand-100 capitalize">{t.type}</Badge></Td>
                <Td>{t.currency}</Td>
                <Td>{money(t.balance, true)}</Td>
                <Td>{money(t.availableBalance, true)}</Td>
                <Td className="text-xs">{t.sweepTarget !== undefined ? money(t.sweepTarget, true) : "—"}</Td>
                <Td className="text-xs text-brand-200/60">{t.lastReconciledAt.replace("T", " ").slice(0, 16)}</Td>
                <Td className={t.unreconciledItems > 0 ? "text-amber-300" : "text-emerald-300"}>{t.unreconciledItems}</Td>
              </tr>
            ))}
          </Table>
          <div className="flex items-center gap-2 border-t border-brand-800/70 px-5 py-3 text-xs text-brand-200/60">
            <Banknote size={13} className="text-gold-400" /> Idle balances above sweep targets are moved nightly to the reserve account; collections settle from Paystack T+1.
          </div>
        </Card>
      ) : null}

      {tab === "variance" ? (
        <Card>
          <CardHeader title="Budget vs Actual — Cost Centre Variance" subtitle="Variance analysis with the underlying business driver" />
          <Table head={["Cost centre", "Account", "Budget", "Actual", "Variance", "Variance %", "Driver", "Rating"]}>
            {data.costVariances.map((v) => (
              <tr key={v.id}>
                <Td className="text-brand-50">{v.costCentre}</Td>
                <Td className="text-xs">{v.account}</Td>
                <Td>{money(v.budget, true)}</Td>
                <Td>{money(v.actual, true)}</Td>
                <Td className={v.favourable ? "text-emerald-300" : "text-rose-300"}>{v.variance > 0 ? "+" : ""}{money(v.variance, true)}</Td>
                <Td className={v.favourable ? "text-emerald-300" : "text-rose-300"}>{v.variancePct > 0 ? "+" : ""}{v.variancePct}%</Td>
                <Td className="max-w-xs text-xs text-brand-200/70">{v.driver}</Td>
                <Td>
                  <Badge className={v.favourable ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200" : "border-rose-400/40 bg-rose-500/10 text-rose-200"}>
                    {v.favourable ? "Favourable" : "Adverse"}
                  </Badge>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      ) : null}
    </div>
  );
}
