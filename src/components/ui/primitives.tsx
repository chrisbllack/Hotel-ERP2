import type { ReactNode } from "react";
import { cn, money } from "../../lib/utils";

/* ============================================================================
 * Layout + data-display primitives. These consume the semantic theme tokens
 * (--surface-panel, --border-subtle, brand/gold ramps) so every one of the
 * seven theme identities repaints them automatically. The public API is
 * intentionally stable: existing pages keep working unchanged.
 * ========================================================================== */

export function Card({
  children,
  className,
  title,
  subtitle,
}: {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  subtitle?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-brand-800/70 bg-brand-900/40 shadow-panel backdrop-blur-sm",
        className,
      )}
    >
      {title ? <CardHeader title={title} subtitle={subtitle} /> : null}
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  subtitle,
  description,
  action,
}: {
  title: ReactNode;
  subtitle?: string;
  description?: string;
  action?: ReactNode;
}) {
  const caption = subtitle ?? description;
  return (
    <header className="flex items-center justify-between gap-4 border-b border-brand-800/60 px-5 py-3.5">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold tracking-wide text-brand-50">{title}</h3>
        {caption ? <p className="mt-0.5 truncate text-xs text-brand-200/55">{caption}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function Badge({
  children,
  className,
  variant,
}: {
  children: ReactNode;
  className?: string;
  variant?: "outline" | "solid";
}) {
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

export function PageHeader({
  title,
  subtitle,
  description,
  action,
  actions,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  description?: string;
  action?: ReactNode;
  actions?: ReactNode;
  breadcrumb?: string;
}) {
  const caption = subtitle ?? description;
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {breadcrumb ? (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-500/70">{breadcrumb}</p>
        ) : null}
        <h1 className="font-display text-2xl text-brand-50 sm:text-[28px]">{title}</h1>
        {caption ? <p className="mt-1 max-w-2xl text-sm text-brand-200/65">{caption}</p> : null}
      </div>
      {action ?? actions ? <div className="flex flex-wrap items-center gap-2">{action ?? actions}</div> : null}
    </div>
  );
}

type AccentTone =
  | "brand" | "gold" | "rose" | "sky" | "emerald"
  | "amber" | "stone" | "purple" | "indigo" | "cyan" | "teal";

export function StatCard({
  label,
  value,
  sub,
  change,
  trend = "neutral",
  accent = "brand",
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  accent?: AccentTone;
  icon?: ReactNode;
}) {
  const accents: Record<AccentTone, string> = {
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
  const trendColor = trend === "up" ? "text-emerald-300" : trend === "down" ? "text-rose-300" : "text-brand-200/55";
  const caption = sub ?? change;
  return (
    <Card className="group relative p-4 transition-colors hover:border-brand-600/60">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-brand-200/55">{label}</p>
        {icon ? <span className={cn("opacity-70 transition-opacity group-hover:opacity-100", accents[accent])}>{icon}</span> : null}
      </div>
      <p className={cn("mt-1.5 font-display text-[26px] leading-none tracking-tight", accents[accent])}>{value}</p>
      {caption ? <p className={cn("mt-1.5 text-xs", trend !== "neutral" ? trendColor : "text-brand-200/45")}>{caption}</p> : null}
    </Card>
  );
}

export function Table({
  head,
  children,
  stickyHeader,
}: {
  head: string[];
  children: ReactNode;
  stickyHeader?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className={cn(stickyHeader && "sticky top-0 z-10 bg-brand-900/95 backdrop-blur")}>
          <tr className="border-b border-brand-800/60">
            {head.map((h) => (
              <th
                key={h}
                className="whitespace-nowrap px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-brand-200/55"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-800/40">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("px-5 py-3 align-middle text-brand-50/90", className)}>{children}</td>;
}

export function Tr({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn("transition-colors hover:bg-brand-800/25", onClick && "cursor-pointer", className)}
    >
      {children}
    </tr>
  );
}

export function EmptyState({
  title,
  hint,
  description,
  icon,
  action,
}: {
  title: string;
  hint?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  const caption = hint ?? description;
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      {icon ? (
        <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-brand-800/50 text-brand-300">
          {icon}
        </div>
      ) : null}
      <p className="text-sm font-medium text-brand-100">{title}</p>
      {caption ? <p className="max-w-sm text-xs text-brand-200/50">{caption}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function MoneyCell({ value }: { value: number }) {
  return (
    <span className={cn("font-mono text-[13px] tabular-nums", value < 0 ? "text-gold-400" : "text-brand-50/90")}>
      {money(value)}
    </span>
  );
}
