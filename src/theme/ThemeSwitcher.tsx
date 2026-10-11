import { useEffect, useState } from "react";
import { Check, Palette, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "../theme/ThemeProvider";
import type { ThemeDefinition } from "../theme/themes";

function Swatches({ swatch }: { swatch: ThemeDefinition["swatch"] }) {
  return (
    <div className="flex items-center gap-1">
      {swatch.map((color) => (
        <span
          key={color}
          className="h-4 w-4 rounded-full ring-1 ring-black/20"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ThemeCard({ theme, active, onSelect }: { theme: ThemeDefinition; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "group relative overflow-hidden rounded-xl border p-4 text-left transition-all",
        active
          ? "border-gold-400 bg-gold-500/10 ring-1 ring-gold-400/60"
          : "border-brand-800/70 bg-brand-900/40 hover:border-gold-500/40 hover:bg-brand-900/70",
      )}
    >
      {/* Palette preview strip */}
      <div className="mb-3 flex h-14 overflow-hidden rounded-lg ring-1 ring-black/20">
        <span className="flex-1" style={{ background: theme.swatch[0] }} />
        <span className="flex-1" style={{ background: theme.swatch[1] }} />
        <span className="flex-1" style={{ background: theme.swatch[2] }} />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-display text-base text-brand-50">{theme.name}</p>
          <p className="truncate text-xs text-brand-200/70">{theme.tagline}</p>
        </div>
        {active ? (
          <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gold-500 text-brand-950">
            <Check size={13} />
          </span>
        ) : (
          <span className="rounded-full border border-brand-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-brand-200/60">
            {theme.mode}
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-brand-100/60">{theme.description}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Swatches swatch={theme.swatch} />
        <span className="truncate text-[10px] uppercase tracking-wide text-brand-200/40">
          {theme.influences.join(" · ")}
        </span>
      </div>
    </button>
  );
}

/** Header trigger + dialog for choosing one of the 7 themes. */
export function ThemeSwitcher() {
  const { theme, themeId, themes, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-brand-800/80 px-2.5 py-1.5 text-xs text-brand-100/80 transition-colors hover:border-gold-500/50 hover:text-brand-50"
        aria-label="Change interface theme"
        title={`Theme: ${theme.name}`}
      >
        <Palette size={15} />
        <span className="hidden sm:inline">{theme.name}</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Choose interface theme"
        >
          <div
            className="my-auto w-full max-w-3xl rounded-2xl border border-brand-800/80 bg-brand-950 p-6 shadow-float"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 font-display text-xl text-brand-50">
                  <Palette size={18} className="text-gold-400" /> Interface theme
                </h2>
                <p className="mt-1 text-sm text-brand-200/70">
                  Seven curated identities. Your choice is remembered on this device and applies instantly across
                  every screen — staff console and guest pages alike.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-brand-200/70 hover:bg-brand-900/60 hover:text-brand-50"
                aria-label="Close theme picker"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {themes.map((t) => (
                <ThemeCard
                  key={t.id}
                  theme={t}
                  active={t.id === themeId}
                  onSelect={() => setTheme(t.id)}
                />
              ))}
            </div>

            <p className="mt-5 text-xs text-brand-200/40">
              Tip: press <kbd className="rounded border border-brand-700 px-1">Esc</kbd> to close. Themes are
              contrast-checked and respect reduced-motion preferences.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
