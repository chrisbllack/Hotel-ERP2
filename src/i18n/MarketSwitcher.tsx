import { useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { cn } from "../lib/utils";
import { useMarket } from "../i18n/MarketProvider";

/** Header control for choosing the operating market (US / IN / NG / CN). */
export function MarketSwitcher() {
  const { market, marketId, markets, setMarket } = useMarket();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-brand-800/80 px-2.5 py-1.5 text-xs text-brand-100/80 transition-colors hover:border-gold-500/50 hover:text-brand-50"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Operating market: ${market.country}`}
      >
        <Globe size={15} />
        <span aria-hidden="true">{market.flag}</span>
        <span className="hidden md:inline">{market.id} · {market.currency}</span>
        <ChevronDown size={13} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            role="listbox"
            aria-label="Operating market"
            className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-brand-800/80 bg-brand-950 shadow-float"
          >
            <p className="border-b border-brand-800/70 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-brand-200/50">
              Operating market
            </p>
            {markets.map((m) => {
              const active = m.id === marketId;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setMarket(m.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                    active ? "bg-gold-500/10" : "hover:bg-brand-900/60",
                  )}
                >
                  <span className="text-lg leading-none" aria-hidden="true">{m.flag}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-brand-50">{m.country}</span>
                      <span className="text-xs text-brand-200/60">{m.currency}</span>
                    </span>
                    <span className="mt-0.5 block text-[11px] text-brand-200/60">
                      {m.taxes[0]?.name} {Math.round((m.taxes[0]?.rate ?? 0) * 1000) / 10}% · FY from {m.fiscalYearStart}
                    </span>
                  </span>
                  {active ? <Check size={15} className="mt-0.5 flex-none text-gold-400" /> : null}
                </button>
              );
            })}
            <p className="border-t border-brand-800/70 px-4 py-2 text-[10px] text-brand-200/40">
              Sets tax, currency, locale, invoice naming and compliance defaults.
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
