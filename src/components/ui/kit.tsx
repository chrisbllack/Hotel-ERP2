import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

/* ============================================================================
 * INFINEON UI kit — interactive primitives built on the semantic theme tokens.
 * Everything here recolours automatically with the active data-theme, so the
 * seven identities (Emerald, Midnight, Saffron, Dynasty, Lagoon, Aurora,
 * Porcelain) stay pixel-consistent without per-theme branching in components.
 * ========================================================================== */

/* ── Button ─────────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-brand-500 to-brand-700 text-brand-50 shadow-panel ring-1 ring-brand-400/30 hover:from-brand-400 hover:to-brand-600",
  accent:
    "bg-gradient-to-br from-gold-400 to-gold-600 text-brand-950 font-semibold shadow-panel hover:from-gold-300 hover:to-gold-500",
  secondary:
    "bg-brand-800/60 text-brand-50 ring-1 ring-brand-700/70 hover:bg-brand-700/70",
  outline:
    "bg-transparent text-brand-100 ring-1 ring-brand-700/80 hover:bg-brand-800/50 hover:text-brand-50",
  ghost: "bg-transparent text-brand-100/80 hover:bg-brand-800/50 hover:text-brand-50",
  danger:
    "bg-rose-600/90 text-white ring-1 ring-rose-400/40 hover:bg-rose-500",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
  icon: "h-9 w-9 rounded-lg justify-center",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading, leftIcon, rightIcon, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex select-none items-center font-medium transition-all duration-150 active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]",
        "disabled:pointer-events-none disabled:opacity-45",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner className="h-3.5 w-3.5" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ── IconButton ─────────────────────────────────────────────────────────── */

export function IconButton({ label, className, variant = "ghost", ...rest }: ButtonProps & { label: string }) {
  return (
    <Button
      aria-label={label}
      title={label}
      variant={variant}
      size="icon"
      className={cn("relative", className)}
      {...rest}
    />
  );
}

/* ── Field wrappers + controls ──────────────────────────────────────────── */

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      {label ? (
        <span className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-brand-200/70">
          {label}
          {required ? <span className="text-rose-300">*</span> : null}
        </span>
      ) : null}
      {children}
      {error ? (
        <span className="mt-1 block text-[11px] font-medium text-rose-300">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[11px] text-brand-200/50">{hint}</span>
      ) : null}
    </label>
  );
}

const CONTROL =
  "w-full rounded-lg border border-brand-700/70 bg-brand-950/60 px-3 py-2 text-sm text-brand-50 placeholder:text-brand-200/35 " +
  "transition-colors focus:border-brand-400 focus:bg-brand-950 focus:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(CONTROL, "h-10", className)} {...rest} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return <textarea ref={ref} className={cn(CONTROL, "min-h-24 resize-y", className)} {...rest} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select ref={ref} className={cn(CONTROL, "h-10 cursor-pointer appearance-none pr-8", className)} {...rest}>
        {children}
      </select>
    );
  },
);

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-200/40"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(CONTROL, "h-10 pl-9")}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-brand-200/50 hover:text-brand-50"
        >
          <X size={13} />
        </button>
      ) : null}
    </div>
  );
}

/* ── Segmented control ──────────────────────────────────────────────────── */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: Array<{ value: T; label: ReactNode }>;
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-0.5 rounded-xl border border-brand-800/80 bg-brand-950/60 p-0.5", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            value === o.value
              ? "bg-brand-600/40 text-brand-50 ring-1 ring-brand-400/30"
              : "text-brand-200/60 hover:text-brand-50",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Tabs ───────────────────────────────────────────────────────────────── */

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
}
const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
  className?: string;
}) {
  const baseId = useId();
  const ctx = useMemo(() => ({ value, setValue: onChange, baseId }), [value, onChange, baseId]);
  return (
    <TabsContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="tablist" className={cn("flex items-center gap-1 overflow-x-auto border-b border-brand-800/70", className)}>
      {children}
    </div>
  );
}

export function Tab({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab must be used within Tabs");
  const active = ctx.value === value;
  return (
    <button
      role="tab"
      type="button"
      aria-selected={active}
      onClick={() => ctx.setValue(value)}
      className={cn(
        "relative whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors",
        active ? "text-brand-50" : "text-brand-200/55 hover:text-brand-100",
      )}
    >
      {children}
      {active ? <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gold-400" /> : null}
    </button>
  );
}

export function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabPanel must be used within Tabs");
  if (ctx.value !== value) return null;
  return (
    <div role="tabpanel" className="animate-fade-up pt-4">
      {children}
    </div>
  );
}

/* ── Modal ──────────────────────────────────────────────────────────────── */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-brand-700/60 bg-brand-900 shadow-float sm:rounded-2xl",
          widths[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className="flex items-start justify-between gap-4 border-b border-brand-800/70 px-5 py-4">
            <div>
              <h2 className="font-display text-lg text-brand-50">{title}</h2>
              {description ? <p className="mt-0.5 text-xs text-brand-200/60">{description}</p> : null}
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-lg p-1.5 text-brand-200/60 transition-colors hover:bg-brand-800/50 hover:text-brand-50"
            >
              <X size={17} />
            </button>
          </div>
        ) : null}
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="flex items-center justify-end gap-2 border-t border-brand-800/70 px-5 py-3">{footer}</div> : null}
      </div>
    </div>
  );
}

/* ── Progress / Meter ───────────────────────────────────────────────────── */

export function Progress({
  value,
  className,
  tone = "brand",
}: {
  value: number;
  className?: string;
  tone?: "brand" | "gold" | "emerald" | "amber" | "rose" | "sky";
}) {
  const pct = Math.max(0, Math.min(100, value));
  const tones: Record<string, string> = {
    brand: "bg-brand-400",
    gold: "bg-gold-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
    sky: "bg-sky-400",
  };
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-brand-800/60", className)}>
      <div className={cn("h-full rounded-full transition-all duration-500", tones[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ── Chip / status dot ──────────────────────────────────────────────────── */

export function StatusDot({ className }: { className?: string }) {
  return <span className={cn("inline-block h-2 w-2 rounded-full", className)} aria-hidden="true" />;
}

export function Chip({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "accent";
}) {
  const tones: Record<string, string> = {
    neutral: "border-brand-600/40 bg-brand-700/25 text-brand-100",
    success: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
    warning: "border-amber-400/40 bg-amber-500/15 text-amber-200",
    danger: "border-rose-400/40 bg-rose-500/15 text-rose-200",
    info: "border-sky-400/40 bg-sky-500/15 text-sky-200",
    accent: "border-gold-400/40 bg-gold-500/15 text-gold-300",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

/* ── Skeleton ───────────────────────────────────────────────────────────── */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-brand-800/50", className)} />;
}

/* ── Toast system ───────────────────────────────────────────────────────── */

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone?: "success" | "error" | "info";
}
interface ToastContextValue {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));
  const push = (t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => dismiss(id), 4200);
  };
  return (
    <ToastContext.Provider value={{ toasts, push, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto animate-fade-up rounded-xl border bg-brand-900/95 px-4 py-3 shadow-float backdrop-blur",
              t.tone === "error" ? "border-rose-500/40" : t.tone === "success" ? "border-emerald-500/40" : "border-brand-700/70",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-brand-50">{t.title}</p>
                {t.description ? <p className="mt-0.5 text-xs text-brand-200/60">{t.description}</p> : null}
              </div>
              <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-brand-200/50 hover:text-brand-50">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
