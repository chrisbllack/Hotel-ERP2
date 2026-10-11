import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_THEME, THEMES, getTheme, isThemeId, type ThemeDefinition, type ThemeId } from "./themes";

const STORAGE_KEY = "infineon.theme";

interface ThemeState {
  theme: ThemeDefinition;
  themeId: ThemeId;
  themes: ThemeDefinition[];
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isThemeId(stored)) return stored;
  } catch {
    /* storage unavailable (private mode) — fall through to default */
  }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(readStoredTheme);

  const applyTheme = useCallback((id: ThemeId) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", id);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = getTheme(id).swatch[0];
  }, []);

  useEffect(() => {
    applyTheme(themeId);
    try {
      window.localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      /* ignore persistence failures */
    }
  }, [themeId, applyTheme]);

  // Keep multiple tabs in step with one another.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && isThemeId(event.newValue)) {
        setThemeId(event.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<ThemeState>(
    () => ({
      theme: getTheme(themeId),
      themeId,
      themes: THEMES,
      setTheme: setThemeId,
    }),
    [themeId],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
