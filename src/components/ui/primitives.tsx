import type { ReactNode } from "react";
import { cn, naira } from "../../lib/utils";

export function Card({ children, className, title, subtitle }: { children: ReactNode; className?: string; title?: ReactNode; subtitle?: string }) {
  return (
    <div className={cn("rounded-xl border border-brand-800/80 bg-brand-900/40 shadow-panel backdrop-blur-sm", className)}>
      {title ? <CardHeader title={title} subtitle={subtitle} /> : null}
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, description, action }: { title: ReactNode; subtitle?: string; description?: string; action?: ReactNode }) {
  const caption = subtitle ?? description;
  return (
    <div className="flex items-center justify-between gap-4 border-b border-brand-800/70 px-5 py-4">
      <div>
        <h3 className="text-sm font-semibold tracking-wide text-brand-50">{title}</h3>
        {caption ? <p className="mt-0.5 text-xs text-brand-200/60">{caption}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, className, variant }: { children: ReactNode; className?: string; variant?: "outline" | "solid" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        variant === "solid" && "border-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({ title, subtitle, description, action, actions }: { title: string; subtitle?: string; description?: string; action?: ReactNode; actions?: ReactNode }) {
  const caption = subtitle ?? description;
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl text-brand-50">{title}</h1>
        {caption ? <p className="mt-1 text-sm text-brand-200/70">{caption}</p> : null}
      </div>
      {action ?? actions ? <div className="flex flex-wrap items-center gap-2">{action ?? actions}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  change,
  trend = "neutral",
  accent = "brand",
}: {
  label: string;
  value: string;
  sub?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  accent?: "brand" | "gold" | "rose" | "sky" | "emerald" | "amber" | "stone" | "purple" | "indigo" | "cyan" | "teal";
}) {
  const accents: Record<string, string> = {
    brand: "text-brand-100",
    gold: "text-gold-400",
    rose: "text-rose-300",
    sky: "text-sky-300",
    emerald: "text-emerald-300",
    amber: "text-amber-300",
    stone: "text-stone-300",
    purple: "text-purple-300",
    indigo: "text-indigo-300",
    cyan: "text-cyan-300",
    teal: "text-teal-300",
  };
  const trendColor = trend === "up" ? "text-emerald-300" : trend === "down" ? "text-rose-300" : "text-brand-200/60";
  const caption = sub ?? change;
  return (
    <Card className="p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-brand-200/60">{label}</p>
      <p className={cn("mt-1 font-display text-2xl", accents[accent])}>{value}</p>
      {caption ? <p className={cn("mt-1 text-xs", trend !== "neutral" ? trendColor : "text-brand-200/50")}>{caption}</p> : null}
    </Card>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-800/70">
            {head.map((h) => (
              <th key={h} className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-brand-200/60">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-800/50">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("px-5 py-3 align-middle text-brand-50/90", className)}>{children}</td>;
}

export function EmptyState({ title, hint, description }: { title: string; hint?: string; description?: string }) {
  const caption = hint ?? description;
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-6 py-12 text-center">
      <p className="text-sm font-medium text-brand-100">{title}</p>
      {caption ? <p className="text-xs text-brand-200/50">{caption}</p> : null}
    </div>
  );
}

export function MoneyCell({ value }: { value: number }) {
  return <span className={value < 0 ? "text-gold-400" : "text-brand-50/90"}>{naira(value)}</span>;
}
