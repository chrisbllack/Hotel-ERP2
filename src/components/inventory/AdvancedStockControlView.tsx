import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CalendarClock,
  ClipboardCheck,
  Layers,
  MapPin,
  Snowflake,
  TrendingDown,
  Warehouse,
} from "lucide-react";
import { Badge, Card, CardHeader, StatCard, Table, Td } from "../ui/primitives";
import { money, num } from "../../lib/utils";
import {
  initialAbcClassifications,
  initialBinLocations,
  initialInventoryControlMetrics,
  initialSlowMovingStock,
  initialStockBatches,
  initialStockLedger,
  initialStoreRequisitions,
  initialUnitConversions,
} from "../../data/financeOpsData";
import type { StockLedgerEntry, StoreRequisition } from "../../types";

type Tab = "overview" | "ledger" | "batches" | "bins" | "requisitions" | "abc" | "slow";

const LEDGER_STYLE: Record<string, string> = {
  opening: "border-sky-400/40 bg-sky-500/10 text-sky-200",
  purchase_receipt: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  issue: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  return: "border-teal-400/40 bg-teal-500/10 text-teal-200",
  transfer_out: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  transfer_in: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  adjustment: "border-slate-400/40 bg-slate-500/10 text-slate-200",
  wastage: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  count_variance: "border-rose-400/40 bg-rose-500/10 text-rose-200",
};

function daysUntil(iso: string, from = "2026-09-05"): number {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${iso}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

export function AdvancedStockControlView() {
  const [tab, setTab] = useState<Tab>("overview");
  const [ledger, setLedger] = useState<StockLedgerEntry[]>(initialStockLedger);
  const [requisitions, setRequisitions] = useState<StoreRequisition[]>(initialStoreRequisitions);
  const [selectedRequisition, setSelectedRequisition] = useState<string | null>(null);

  const metrics = initialInventoryControlMetrics;
  const batches = useMemo(() => [...initialStockBatches].sort((a, b) => a.fefoRank - b.fefoRank), []);
  const bins = initialBinLocations;
  const abc = initialAbcClassifications;
  const slow = initialSlowMovingStock;
  const conversions = initialUnitConversions;

  const totalBinCapacity = bins.reduce((a, b) => a + b.capacityUnits, 0);
  const totalBinUsed = bins.reduce((a, b) => a + b.usedUnits, 0);
  const binUtilisation = Math.round((totalBinUsed / totalBinCapacity) * 100);

  /** Approve a requisition and pre-fill approved quantities. */
  const approveRequisition = (requisitionId: string) => {
    setRequisitions((prev) =>
      prev.map((r) =>
        r.id === requisitionId
          ? { ...r, status: "approved", approvedBy: "Daniel Okafor", lines: r.lines.map((l) => ({ ...l, approvedQty: l.requestedQty })) }
          : r,
      ),
    );
  };

  /** Issue an approved requisition — posts valued movements to the ledger. */
  const issueRequisition = (requisitionId: string) => {
    const target = requisitions.find((r) => r.id === requisitionId);
    if (!target) return;
    const lines = target.lines.map((l) => ({ ...l, approvedQty: l.requestedQty, issuedQty: l.requestedQty }));
    const newEntries: StockLedgerEntry[] = lines.map((l, i) => ({
      id: `led-iss-${requisitionId}-${i}`,
      timestamp: "2026-09-05T12:00:00",
      productId: l.productId,
      productName: l.name,
      sku: l.productId.toUpperCase(),
      storeId: target.issuingStoreId,
      storeName: target.issuingStoreName,
      reason: "issue",
      quantity: -l.issuedQty,
      unitCost: l.unitCost,
      totalValue: -l.issuedQty * l.unitCost,
      balanceAfter: 0,
      batchNumber: l.batchNumber,
      reference: target.requisitionNumber,
      performedBy: "Storekeeper",
    }));
    setLedger((cur) => [...newEntries, ...cur]);
    setRequisitions((prev) =>
      prev.map((r) =>
        r.id === requisitionId
          ? { ...r, status: "issued", approvedBy: "Daniel Okafor", totalValue: lines.reduce((a, l) => a + l.issuedQty * l.unitCost, 0), lines }
          : r,
      ),
    );
  };

  const tabs: Array<[Tab, string, typeof Boxes]> = [
    ["overview", "Control Tower", Boxes],
    ["ledger", "Perpetual Stock Ledger", Layers],
    ["batches", "Batches & FEFO/Expiry", CalendarClock],
    ["bins", "Bin & Location Control", MapPin],
    ["requisitions", "Internal Store Requisitions", ClipboardCheck],
    ["abc", "ABC & Cycle Count", TrendingDown],
    ["slow", "Slow-Moving & Capital", Warehouse],
  ];

  return (
    <div className="space-y-5">
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

      {tab === "overview" ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Inventory Value" value={money(metrics.inventoryValue, true)} sub={`${num(metrics.totalSkus)} active SKUs across ${metrics.totalStores} stores`} accent="emerald" />
            <StatCard label="Stock Turnover" value={`${metrics.stockTurnoverRatio}×`} sub={`${metrics.daysInventoryOutstanding} days inventory outstanding`} accent="gold" />
            <StatCard label="Shrinkage" value={`${metrics.shrinkagePct}%`} sub={`Stockout rate ${metrics.stockoutRatePct}%`} accent="rose" />
            <StatCard label="Expiry at Risk (30d)" value={money(metrics.expiringValueAtRisk, true)} sub={`${metrics.expiringWithin30Days} batches expiring`} accent="sky" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Store Network" subtitle="Perpetual balances held per physical store" />
              <div className="space-y-3 p-5">
                {([
                  ["Central Warehouse", 62],
                  ["Kitchen Dry Store", 48],
                  ["Wine & Beverage Cellar", 71],
                  ["Housekeeping Linen Store", 55],
                  ["Engineering Spares", 33],
                  ["Events Store", 24],
                ] as Array<[string, number]>).map(([name, pct]) => (
                  <div key={name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-brand-100/80">{name}</span>
                      <span className="text-brand-200/60">{pct}% capacity</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-brand-900/70">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-gold-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title="Unit Conversions" subtitle="Purchase → base → issue unit factors (exact decimals)" />
              <Table head={["Purchase unit", "Base unit", "Issue unit"]}>
                {conversions.map((c) => (
                  <tr key={c.productId}>
                    <Td>{c.purchaseUnit} = {c.factor} {c.baseUnit}</Td>
                    <Td>{c.baseUnit}</Td>
                    <Td>1 = {c.issueFactor} {c.issueUnit}</Td>
                  </tr>
                ))}
              </Table>
            </Card>
          </div>
        </div>
      ) : null}

      {tab === "ledger" ? (
        <Card>
          <CardHeader title="Perpetual Stock Ledger" subtitle="Every movement, valued and balanced — receipts, issues, transfers, wastage and count variances" />
          <Table head={["When", "Product", "Store", "Reason", "Qty", "Unit cost", "Value", "Balance", "Ref / By"]}>
            {ledger.map((e) => (
              <tr key={e.id}>
                <Td className="whitespace-nowrap text-xs text-brand-200/60">{e.timestamp.replace("T", " ").slice(5)}</Td>
                <Td>
                  <div className="text-brand-50">{e.productName}</div>
                  <div className="text-[11px] text-brand-200/50">{e.sku}</div>
                </Td>
                <Td className="text-xs">{e.storeName}</Td>
                <Td>
                  <Badge className={LEDGER_STYLE[e.reason] ?? LEDGER_STYLE.adjustment}>{e.reason.replace(/_/g, " ")}</Badge>
                </Td>
                <Td className={e.quantity < 0 ? "text-rose-300" : "text-emerald-300"}>
                  {e.quantity > 0 ? "+" : ""}{num(e.quantity)}
                </Td>
                <Td>{money(e.unitCost, true)}</Td>
                <Td className={e.totalValue < 0 ? "text-rose-300" : "text-emerald-300"}>{money(e.totalValue)}</Td>
                <Td>{num(e.balanceAfter)}</Td>
                <Td className="text-xs text-brand-200/60">
                  {e.reference ? <div>{e.reference}</div> : null}
                  {e.performedBy}
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      ) : null}

      {tab === "batches" ? (
        <Card>
          <CardHeader
            title="Batch, Lot & Expiry Control"
            subtitle="First-Expiry-First-Out ordering — consume rank 1 before rank 2 to minimise spoilage"
          />
          <Table head={["FEFO", "Product", "Batch / Lot", "Store", "Received", "Expiry", "Runway", "Qty left", "Value"]}>
            {batches.map((b) => {
              const runway = daysUntil(b.expiryDate);
              const tone = runway <= 7 ? "text-rose-300" : runway <= 30 ? "text-amber-300" : "text-emerald-300";
              return (
                <tr key={b.id}>
                  <Td><span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500/15 text-xs font-semibold text-gold-300">{b.fefoRank}</span></Td>
                  <Td>
                    <div className="text-brand-50">{b.productName}</div>
                    <div className="text-[11px] text-brand-200/50">{b.sku} · {b.supplierName}</div>
                  </Td>
                  <Td className="text-xs">
                    {b.batchNumber}
                    {b.lotNumber ? <div className="text-[11px] text-brand-200/50">{b.lotNumber}</div> : null}
                  </Td>
                  <Td className="text-xs capitalize">{b.storeId.replace("store-", "").replace("_", " ")}</Td>
                  <Td className="text-xs">{b.receivedDate}</Td>
                  <Td className="text-xs">{b.expiryDate}</Td>
                  <Td className={tone}>
                    {runway <= 0 ? "Expired" : `${runway} days`}
                    {runway <= 30 ? <AlertTriangle size={12} className="ml-1 inline" /> : null}
                  </Td>
                  <Td>{num(b.quantityRemaining)} {b.unit}</Td>
                  <Td>{money(b.quantityRemaining * b.unitCost, true)}</Td>
                </tr>
              );
            })}
          </Table>
          <div className="flex items-center gap-2 border-t border-brand-800/70 px-5 py-3 text-xs text-brand-200/60">
            <Snowflake size={13} className="text-sky-300" /> Cold-chain batches carry temperature-on-arrival logs; FEFO is enforced on all issue and transfer operations.
          </div>
        </Card>
      ) : null}

      {tab === "bins" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Bin Locations" value={num(bins.length)} sub="Mapped storage slots" />
            <StatCard label="Bin Utilisation" value={`${binUtilisation}%`} sub={`${num(totalBinUsed)} / ${num(totalBinCapacity)} units`} accent="gold" />
            <StatCard label="Temperature Zones" value={num(new Set(bins.map((b) => b.temperatureZone)).size)} sub="Ambient · chilled · frozen · cellar · dry" accent="sky" />
            <StatCard label="Cold-Chain Bins" value={num(bins.filter((b) => b.temperatureZone === "frozen" || b.temperatureZone === "chilled").length)} sub="FEFO-enforced" accent="emerald" />
          </div>
          <Card>
            <CardHeader title="Bin Location Register" subtitle="Zone · aisle · rack · shelf · bin with live capacity" />
            <Table head={["Bin code", "Zone", "Aisle", "Rack", "Shelf", "Bin", "Temp zone", "Utilisation"]}>
              {bins.map((b) => {
                const util = Math.round((b.usedUnits / b.capacityUnits) * 100);
                return (
                  <tr key={b.id}>
                    <Td className="font-mono text-xs text-brand-50">{b.code}</Td>
                    <Td>{b.zone}</Td>
                    <Td>{b.aisle}</Td>
                    <Td>{b.rack}</Td>
                    <Td>{b.shelf}</Td>
                    <Td>{b.bin}</Td>
                    <Td><Badge className="border-brand-400/40 bg-brand-500/10 text-brand-100 capitalize">{b.temperatureZone.replace("-", " ")}</Badge></Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-brand-900/70">
                          <div className={util > 90 ? "h-full bg-rose-400" : "h-full bg-brand-400"} style={{ width: `${util}%` }} />
                        </div>
                        <span className="text-xs text-brand-200/70">{util}%</span>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          </Card>
        </div>
      ) : null}

      {tab === "requisitions" ? (
        <Card>
          <CardHeader
            title="Internal Store Requisitions"
            subtitle="Departmental issue requests — approve then issue to post valued movements to the ledger"
          />
          <div className="divide-y divide-brand-800/60">
            {requisitions.map((r) => {
              const open = selectedRequisition === r.id;
              return (
                <div key={r.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button type="button" onClick={() => setSelectedRequisition(open ? null : r.id)} className="text-left">
                      <p className="text-sm font-medium text-brand-50">{r.requisitionNumber} · {r.requestingDepartment}</p>
                      <p className="text-xs text-brand-200/60">
                        {r.issuingStoreName} · requested by {r.requestedBy} · {r.lines.length} line{r.lines.length > 1 ? "s" : ""} · {money(r.totalValue, true)}
                      </p>
                    </button>
                    <div className="flex items-center gap-2">
                      <Badge className={requisitionStyle(r.status)}>{r.status.replace(/_/g, " ")}</Badge>
                      {r.status === "pending_approval" ? (
                        <button
                          onClick={() => approveRequisition(r.id)}
                          className="rounded-lg border border-sky-400/40 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-200 hover:bg-sky-500/20"
                        >
                          Approve
                        </button>
                      ) : null}
                      {r.status === "approved" ? (
                        <button
                          onClick={() => issueRequisition(r.id)}
                          className="rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-3 py-1.5 text-xs font-semibold text-brand-950 hover:from-gold-400"
                        >
                          Issue to department
                        </button>
                      ) : null}
                    </div>
                  </div>
                  {open ? (
                    <div className="mt-3 overflow-hidden rounded-lg border border-brand-800/70">
                      <Table head={["Product", "Requested", "Approved", "Issued", "Unit cost", "Batch", "Line value"]}>
                        {r.lines.map((l) => (
                          <tr key={`${r.id}-${l.productId}`}>
                            <Td>{l.name}</Td>
                            <Td>{num(l.requestedQty)} {l.unit}</Td>
                            <Td>{num(l.approvedQty)}</Td>
                            <Td>{num(l.issuedQty)}</Td>
                            <Td>{money(l.unitCost, true)}</Td>
                            <Td className="text-xs text-brand-200/60">{l.batchNumber ?? "—"}</Td>
                            <Td>{money((l.issuedQty || l.approvedQty || l.requestedQty) * l.unitCost)}</Td>
                          </tr>
                        ))}
                      </Table>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      {tab === "abc" ? (
        <Card>
          <CardHeader
            title="ABC Classification & Cycle-Count Policy"
            subtitle="Pareto ranking sets count frequency and tolerated variance — A items counted weekly at 0.5%"
          />
          <Table head={["SKU", "Product", "Category", "Annual usage value", "Cumulative %", "Class", "Cycle count", "Tolerance"]}>
            {abc.map((a) => (
              <tr key={a.productId}>
                <Td className="font-mono text-xs">{a.sku}</Td>
                <Td className="text-brand-50">{a.productName}</Td>
                <Td className="text-xs">{a.category}</Td>
                <Td>{money(a.annualUsageValue, true)}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-brand-900/70">
                      <div className="h-full bg-gold-500" style={{ width: `${a.cumulativeSharePct}%` }} />
                    </div>
                    <span className="text-xs text-brand-200/70">{a.cumulativeSharePct}%</span>
                  </div>
                </Td>
                <Td>
                  <Badge className={a.class === "A" ? "border-rose-400/40 bg-rose-500/10 text-rose-200" : a.class === "B" ? "border-amber-400/40 bg-amber-500/10 text-amber-200" : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"}>
                    Class {a.class}
                  </Badge>
                </Td>
                <Td className="capitalize">{a.cycleCountFrequency}</Td>
                <Td>{a.countTolerancePct}%</Td>
              </tr>
            ))}
          </Table>
        </Card>
      ) : null}

      {tab === "slow" ? (
        <Card>
          <CardHeader title="Slow-Moving Stock & Tied Capital" subtitle="Ageing inventory flagged with a recommended recovery action" />
          <Table head={["Product", "SKU", "Store", "On hand", "Last movement", "Days idle", "Tied capital", "Recommended action"]}>
            {slow.map((s) => (
              <tr key={s.productId}>
                <Td className="text-brand-50">{s.productName}</Td>
                <Td className="font-mono text-xs">{s.sku}</Td>
                <Td className="text-xs">{s.storeName}</Td>
                <Td>{num(s.onHand)}</Td>
                <Td className="text-xs">{s.lastMovementDate ?? "No issue since receipt"}</Td>
                <Td className={s.daysSinceMovement >= 90 ? "text-rose-300" : "text-amber-300"}>{s.daysSinceMovement}</Td>
                <Td>{money(s.tiedUpCapital, true)}</Td>
                <Td><Badge className={actionStyle(s.suggestedAction)}>{s.suggestedAction.replace(/_/g, " ")}</Badge></Td>
              </tr>
            ))}
          </Table>
          <div className="border-t border-brand-800/70 px-5 py-3 text-xs text-brand-200/60">
            Total capital tied in slow movers: <span className="text-gold-300">{money(slow.reduce((a, s) => a + s.tiedUpCapital, 0))}</span>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function requisitionStyle(status: StoreRequisition["status"]): string {
  switch (status) {
    case "draft": return "border-slate-400/40 bg-slate-500/10 text-slate-200";
    case "pending_approval": return "border-amber-400/40 bg-amber-500/10 text-amber-200";
    case "approved": return "border-sky-400/40 bg-sky-500/10 text-sky-200";
    case "issued": return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200";
    case "partially_issued": return "border-violet-400/40 bg-violet-500/10 text-violet-200";
    case "rejected": return "border-rose-400/40 bg-rose-500/10 text-rose-200";
  }
}

function actionStyle(action: string): string {
  switch (action) {
    case "promote": return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200";
    case "transfer": return "border-sky-400/40 bg-sky-500/10 text-sky-200";
    case "discount": return "border-amber-400/40 bg-amber-500/10 text-amber-200";
    default: return "border-rose-400/40 bg-rose-500/10 text-rose-200";
  }
}
