# AI Coding Agent Instructions — INFINEON Enterprise Platform

## Identity

You are building INFINEON Enterprise Platform (Project TITAN) for InfinityPlus Solutions & Services Ltd.

## Core Rules

1. **Inspect the repository** before modifying it
2. **Preserve existing architecture** unless a correctness, security, or scalability issue requires change
3. **Do not invent files or dependencies** unnecessarily
4. **Implement complete vertical slices** — not disconnected snippets
5. **Run tests after changes** — `go test ./...` and frontend lint
6. **Never place secrets in code**
7. **Never couple business logic to vendor SDKs** — use adapters/contracts
8. **Keep controllers thin** — business logic in domain services/actions
9. **Use database transactions** for multi-record operations
10. **Use exact decimal arithmetic** for money (PostgreSQL NUMERIC)

## Tech Stack (Non-Negotiable)

- Backend: Go 1.22+, chi, pgx, sqlc
- Frontend: React 18, TypeScript, Vite, shadcn/ui, Tailwind
- Mobile: Flutter 3.x, Dart
- Database: PostgreSQL 16
- Auth: Custom JWT (Ed25519)
- Testing: Go test, Playwright
- Quality: golangci-lint, gofmt, eslint, prettier

## File Organization

- `internal/domain/{domain}/` — Each domain has model.go, repository.go, service.go, handler.go
- `internal/server/middleware/` — HTTP middleware
- `internal/database/` — sqlc queries, models, migrations
- `src/pages/` — Routed application screens (one file per module surface)
- `src/components/ui/{primitives,kit}.tsx` — Theme-token design system (layout/data display + interactive controls)
- `src/components/AppShell.tsx` — Authenticated app chrome (grouped sidebar, command palette, header)
- `src/store/` — Client state providers (`platform.tsx` hospitality domain, `ancillary.tsx` spa/laundry/transport)
- `src/theme/` — Theme engine (7 identities) + switcher; `src/i18n/` — market/currency providers

## Naming Conventions

- Go: camelCase for variables, PascalCase for exported, snake_case for SQL
- TypeScript: camelCase for variables, PascalCase for types/components
- Database: snake_case for tables and columns
- API endpoints: kebab-case (`/api/v1/reservation-status`)

## Quality Gates

Every feature must include:
- Implementation
- Database migration (coordinated dependency order)
- Validation
- Authorization
- API endpoint (where applicable)
- UI (where applicable)
- Tests
- Documentation

## Discovered Repository Facts (verified)

The descriptions above describe a target multi-service architecture. The
current working tree is a **single Vite + React 19 + TypeScript SPA** rooted at
`src/`, with a Convex backend under `src/convex/`. Treat these as the source of
truth for local work:

- **Build / verify**: `npm run build` (must stay green). `npm run typecheck`
  and `npm run test` are aliases for `tsc -b --noEmit`. `npm run lint` runs
  `oxlint src`.
- **Unit tests** live in `src/tests/*.test.ts` and target the pure logic in
  `src/convex/lib.ts`. They use `bun:test`, but **Bun is not installed** in the
  default environment; run them elsewhere with `bun test`.
- **Pre-existing type debt**: `tsc` reports ~305 errors at rest, concentrated in
  feature modules never wired to the type layer (fnb views, maintenance audit,
  yield, supply chain). These do **not** block `npm run build`, which is the
  real gate. Do not assume a type error you introduce is yours — compare the
  count before/after.
- **Theming**: 7 selectable identities in `src/theme/themes.ts`; palette values
  are CSS custom properties under `html[data-theme="..."]` in `src/index.css`.
  `ThemeProvider` writes `data-theme` on `<html>` and persists to
  `localStorage["infineon.theme"]`.
- **Markets / localization**: `src/i18n/markets.ts` holds US/IN/NG/CN profiles
  (currency, locale, tax, fiscal year). `MarketProvider` calls
  `configureFormatter(marketId)` in `src/lib/utils.ts`; `money()` / `naira()`
  then format in the active currency. Because those formatters are read at
  render time, `App` re-renders its routed subtree via a `key={marketId}` on
  `<AppRoutes>` when the market changes (providers above the key stay mounted so
  auth/platform state survives the switch).
- **UI primitives**: `src/components/ui/primitives.tsx` (Card, Badge, Table,
  Td, PageHeader). `Badge` `tone` is a narrow union — confirm allowed values
  before using a new colour.

## Agent team (verified)

The project is built by a parallel team of file-based sub-agents under
`.agents/agents/` (`ai-cto`, `ai-product-manager`, `ai-ui-ux-designer`,
`ai-frontend-engineer`, `ai-backend-engineer`, `ai-qa-engineer`,
`ai-devops-sre`, `ai-security-engineer`, `ai-technical-writer`). See
[`docs/Enterprise/AGENT-TEAM.md`](docs/Enterprise/AGENT-TEAM.md) for the
operating model. Agents are scanned at conversation start, not hot-reloaded —
start a new conversation after editing an agent file. Delegate by `name` via the
task tool.

- **Baseline status (verified)**: `npm run typecheck` reports **0 errors**;
  `npm run build` passes; `npm run lint` reports only warnings (fast-refresh /
  React purity), no errors. Keep it that way — this is the real gate.
- **Financing / inventory / localization / theming** surface files:
  `src/components/finance/FinancialAgilityView.tsx`,
  `src/components/inventory/AdvancedStockControlView.tsx`,
  `src/data/financeOpsData.ts`, `src/pages/localization/LocalizationPage.tsx`,
  `src/theme/*`, `src/i18n/*`.
