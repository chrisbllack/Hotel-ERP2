import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity, ArrowLeftRight, BarChart3, Bell, Building2, Command, CreditCard, Crown,
  Car, FileText, Gauge, Globe2, HandCoins, LayoutDashboard, LogOut, Menu, Moon,
  Package, Plug, Search, ShieldCheck, Shirt, Sparkles, TrendingUp, UtensilsCrossed,
  Users, Waves, Wrench, X,
} from "lucide-react";
import { useAuth } from "../auth/auth";
import { PROPERTY } from "../data/demo";
import { ROLE_LABELS } from "../types";
import { cn } from "../lib/utils";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";
import { MarketSwitcher } from "../i18n/MarketSwitcher";
import { IconButton } from "./ui/kit";

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  keywords?: string;
}

interface NavModule {
  label: string;
  code: string;
  badge?: string;
  icon: ReactNode;
  items: NavItem[];
}

const NAV: NavModule[] = [
  {
    label: "Intelligence", code: "M-BUS", icon: <LayoutDashboard size={16} />,
    items: [{ label: "Executive Dashboard", to: "/dashboard", icon: <LayoutDashboard size={15} />, keywords: "kpi report home overview" }],
  },
  {
    label: "Lodging & Guest Ops", code: "M-LOD", badge: "Core", icon: <Building2 size={16} />,
    items: [
      { label: "Front Desk", to: "/front-desk", icon: <ConciergeBell />, keywords: "checkin checkout walkin folio" },
      { label: "Shift Handover", to: "/shift-handover", icon: <ArrowLeftRight size={15} />, keywords: "cashier shift close" },
      { label: "Room Rack", to: "/rooms", icon: <Building2 size={15} />, keywords: "rooms status board" },
      { label: "Reservations", to: "/reservations", icon: <FileText size={15} />, keywords: "booking group" },
      { label: "Housekeeping", to: "/housekeeping", icon: <Sparkles size={15} />, keywords: "clean tasks maid" },
      { label: "Maintenance & PM", to: "/maintenance", icon: <Wrench size={15} />, keywords: "work order repair" },
      { label: "Night Audit", to: "/night-audit", icon: <Moon size={15} />, keywords: "roll business date" },
    ],
  },
  {
    label: "Food & Beverage", code: "M-FNB", badge: "Core", icon: <UtensilsCrossed size={16} />,
    items: [{ label: "POS Terminal", to: "/pos", icon: <UtensilsCrossed size={15} />, keywords: "restaurant bar kds kitchen" }],
  },
  {
    label: "Supply Chain", code: "M-INV", badge: "Core", icon: <Package size={16} />,
    items: [{ label: "Inventory & Stores", to: "/inventory", icon: <Package size={15} />, keywords: "stock purchase stores requisition" }],
  },
  {
    label: "Finance", code: "M-FIN", badge: "Core", icon: <HandCoins size={16} />,
    items: [{ label: "General Ledger", to: "/finance", icon: <HandCoins size={15} />, keywords: "ap ar city ledger cashflow" }],
  },
  {
    label: "Workforce", code: "M-HR", badge: "Core", icon: <Users size={16} />,
    items: [{ label: "Employees & Payroll", to: "/hr", icon: <Users size={15} />, keywords: "staff attendance payroll" }],
  },
  {
    label: "Guest Experience", code: "M-CRM", badge: "Core", icon: <Crown size={16} />,
    items: [{ label: "Guests & Loyalty", to: "/crm", icon: <Crown size={15} />, keywords: "profiles loyalty surveys" }],
  },
  {
    label: "Distribution & Revenue", code: "M-DST", icon: <TrendingUp size={16} />,
    items: [
      { label: "Yield & Dynamic Pricing", to: "/yield-management", icon: <TrendingUp size={15} />, keywords: "rate revenue" },
      { label: "Channel Manager", to: "/channels", icon: <Plug size={15} />, keywords: "ota booking.com expedia" },
    ],
  },
  {
    label: "Ancillary Services", code: "M-ANC", icon: <Waves size={16} />,
    items: [
      { label: "Spa & Wellness", to: "/spa", icon: <Waves size={15} />, keywords: "massage treatment wellness" },
      { label: "Laundry & Linen", to: "/laundry", icon: <Shirt size={15} />, keywords: "wash fold housekeeping" },
      { label: "Transport & Tours", to: "/transport", icon: <Car size={15} />, keywords: "airport shuttle taxi" },
    ],
  },
  {
    label: "Payments", code: "M-PRC", icon: <CreditCard size={16} />,
    items: [{ label: "Transactions & Settlement", to: "/payments", icon: <CreditCard size={15} />, keywords: "gateway reconcile" }],
  },
  {
    label: "Events", code: "M-EVT", icon: <BarChart3 size={16} />,
    items: [{ label: "Function Diary", to: "/events", icon: <BarChart3 size={15} />, keywords: "banquet beo mice" }],
  },
  {
    label: "Devices", code: "M-HDW", icon: <Activity size={16} />,
    items: [{ label: "Device Health", to: "/hardware", icon: <Activity size={15} />, keywords: "locks printers iptv" }],
  },
  {
    label: "Platform", code: "M-PLT", badge: "Core", icon: <ShieldCheck size={16} />,
    items: [
      { label: "Global Localization", to: "/localization", icon: <Globe2 size={15} />, keywords: "currency market country" },
      { label: "Reports & Audit", to: "/reports", icon: <Gauge size={15} />, keywords: "mis audit trail" },
      { label: "System Admin", to: "/admin", icon: <ShieldCheck size={15} />, keywords: "users roles license settings" },
    ],
  },
];

function ConciergeBell() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 16a8 8 0 0 1 16 0" />
      <path d="M2 16h20" />
      <path d="M12 8V6" />
      <path d="M10 6h4" />
    </svg>
  );
}

const ALL_ITEMS = NAV.flatMap((m) => m.items.map((i) => ({ ...i, module: m.label })));

/* ── Command palette (⌘K / Ctrl-K) ──────────────────────────────────────── */

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ITEMS.slice(0, 9);
    return ALL_ITEMS.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.module.toLowerCase().includes(q) ||
        (i.keywords ?? "").includes(q),
    ).slice(0, 9);
  }, [query]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-brand-700/60 bg-brand-900 shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-brand-800/60 px-4">
          <Search size={16} className="text-brand-200/50" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) {
                navigate(results[0].to);
                onClose();
              }
            }}
            placeholder="Jump to any module, screen or action…"
            className="h-12 flex-1 bg-transparent text-sm text-brand-50 placeholder:text-brand-200/40 focus:outline-none"
          />
          <kbd className="rounded border border-brand-700 px-1.5 py-0.5 text-[10px] text-brand-200/50">Esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-xs text-brand-200/50">No matching screens.</li>
          ) : (
            results.map((r) => (
              <li key={r.to}>
                <button
                  onClick={() => {
                    navigate(r.to);
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-brand-800/60"
                >
                  <span className="text-brand-300">{r.icon}</span>
                  <span className="flex-1 text-sm text-brand-50">{r.label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-brand-200/40">{r.module}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export function AppShell() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  const activeModule = NAV.find((m) => m.items.some((i) => i.to === location.pathname));

  return (
    <div className="flex min-h-screen bg-brand-950">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[80] focus:rounded-lg focus:bg-brand-700 focus:px-3 focus:py-2 focus:text-sm focus:text-brand-50"
      >
        Skip to content
      </a>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-brand-800/70 bg-brand-900/70 backdrop-blur transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-brand-800/70 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 font-display text-lg text-gold-400 ring-1 ring-gold-500/40">
              I
            </div>
            <div>
              <p className="font-display text-sm leading-tight text-brand-50">INFINEON</p>
              <p className="text-[10px] uppercase tracking-widest text-gold-500/80">Enterprise</p>
            </div>
          </div>
          <button className="text-brand-200/70 hover:text-brand-50 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4" aria-label="Primary">
          {NAV.map((mod) => {
            const active = mod.items.some((i) => i.to === location.pathname);
            return (
              <div key={mod.code}>
                <div className="flex items-center justify-between px-2 pb-1.5">
                  <p className={cn("text-[10px] font-semibold uppercase tracking-[0.14em]", active ? "text-gold-400" : "text-brand-200/40")}>
                    {mod.code} · {mod.label}
                  </p>
                  {mod.badge ? (
                    <span className="rounded bg-gold-500/15 px-1 text-[9px] font-semibold uppercase text-gold-400">{mod.badge}</span>
                  ) : null}
                </div>
                <ul className="space-y-0.5">
                  {mod.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          cn(
                            "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all",
                            isActive
                              ? "bg-brand-500/20 font-medium text-brand-50 ring-1 ring-brand-400/30"
                              : "text-brand-100/70 hover:bg-brand-800/40 hover:text-brand-50",
                          )
                        }
                      >
                        <span className="text-brand-300 transition-colors group-hover:text-gold-400">{item.icon}</span>
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-brand-800/70 px-4 py-3">
          <p className="text-[10px] text-brand-200/40">
            14 modules · ancillary services included
            <br />
            v0.4.0 · Enterprise Edition
          </p>
        </div>
      </aside>

      {open ? <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} /> : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-brand-800/70 bg-brand-950/85 px-4 backdrop-blur lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button className="text-brand-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <div className="hidden items-center gap-2 rounded-lg border border-brand-800/80 bg-brand-900/50 px-3 py-1.5 sm:flex">
              <Building2 size={14} className="text-gold-400" />
              <div className="leading-tight">
                <p className="text-xs font-medium text-brand-50">{PROPERTY.name}</p>
                <p className="text-[10px] text-brand-200/50">
                  {PROPERTY.code} · Lagos, NG · {activeModule ? activeModule.label : "50 rooms"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-brand-800/80 bg-brand-900/50 px-3 py-1.5 text-xs text-brand-200/60 transition-colors hover:border-brand-600 hover:text-brand-50"
            >
              <Search size={13} />
              <span className="hidden sm:inline">Jump to…</span>
              <kbd className="ml-1 hidden items-center gap-0.5 rounded border border-brand-700 px-1 py-0.5 text-[9px] sm:flex">
                <Command size={9} />K
              </kbd>
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <MarketSwitcher />
            <ThemeSwitcher />
            <IconButton label="Notifications" className="hidden sm:inline-flex">
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gold-400" />
            </IconButton>
            <div className="flex items-center gap-2.5">
              <div className="hidden text-right leading-tight sm:block">
                <p className="text-xs font-medium text-brand-50">{user?.name}</p>
                <p className="text-[10px] text-brand-200/60">{user ? ROLE_LABELS[user.role] : ""}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg border border-brand-800/80 px-2.5 py-1.5 text-xs text-brand-200/80 transition-colors hover:border-brand-600 hover:text-brand-50"
              >
                <LogOut size={13} /> <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </header>

        <main id="main" className="flex-1 px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-[1400px] animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette
        key={paletteOpen ? "command-palette-open" : "command-palette-closed"}
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
}
