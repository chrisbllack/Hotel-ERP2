# INFINEON Agent Team — Operating Model

Project TITAN is built by a team of specialised AI agents that plan together and
then work **in parallel, side by side**, to deliver one coherent product. The
agents are file-based sub-agents under [`.agents/agents/`](../../.agents/agents/)
and are invoked through delegation.

## The team

| Role | Agent file | Owns |
|------|-----------|------|
| **Managing Director & Chief Visionary** (human) | — | Vision, business priorities, budgets, product approval, final sign-off |
| **AI CTO / Engineering Manager** | `ai-cto` | Architecture, work plans, engineering standards, coordinated parallel tasks |
| **AI Product Manager** | `ai-product-manager` | Requirements, roadmap, user stories, acceptance criteria |
| **AI UI/UX Designer** | `ai-ui-ux-designer` | User journeys, wireframes, design system, the 7 themes |
| **AI Frontend Engineer** | `ai-frontend-engineer` | Web app, responsive interfaces (React/TS/Vite) |
| **AI Backend Engineer** | `ai-backend-engineer` | APIs, business logic, data model, integrations |
| **AI QA / Test Engineer** | `ai-qa-engineer` | Automated tests, regression, bug reports |
| **AI DevOps / SRE** | `ai-devops-sre` | CI/CD, Docker, monitoring, recovery |
| **AI Security Engineer** | `ai-security-engineer` | Access control, vulnerabilities, secrets |
| **AI Technical Writer** | `ai-technical-writer` | Documentation, install guides, user manuals |

## How work flows

1. **The MD sets intent** — vision, priority, budget, and the definition of
   "good enough to ship".
2. **The AI CTO turns intent into a plan** — objective, acceptance criteria,
   baseline check, and 3–7 independently shippable tasks, each assigned to one
   specialist with files-in-scope and a verification command.
3. **Specialists run in parallel** where their file scopes do not overlap. The
   CTO never assigns two agents to edit the same file in the same wave.
4. **QA and Security verify** every wave against the acceptance criteria before
   the CTO integrates and the MD signs off.
5. **The Technical Writer records** decisions, install steps, and user manuals;
   durable decisions also land in `AGENTS.md`.

## The delegation contract

Each task handed to a specialist must state four things. A task missing any of
them is not ready:

- **Task** — what to build, in one paragraph.
- **Files in scope** — the exact files/dirs the agent may touch.
- **Definition of done** — observable, testable outcomes.
- **Verification** — the command that proves it (`npm run typecheck`,
  `npm run build`, `npm run e2e`, `go test ./...`).

## Quality gates (every wave)

| Gate | Command | Bar |
|------|---------|-----|
| Types | `npm run typecheck` | 0 errors |
| Build | `npm run build` | passes |
| Lint | `npm run lint` | clean |
| Unit | `bun test` | all pass (Bun prerequisite) |
| E2E | `npm run e2e` | all pass |
| Go | `go build ./...` / `go test ./...` | passes |

## Parallel-safety rules

- One writer per file per wave. Shared files (e.g. `src/types.ts`,
  `src/store/platform.tsx`, `src/index.css`) are serialised through the CTO.
- Read-only agents (`ai-product-manager`, `ai-ui-ux-designer`,
  `ai-technical-writer`) may run freely alongside writers.
- QA runs after writers in the same wave; never before.

## Using the team

File-based agents are scanned at **conversation start**, not hot-reloaded.
After adding or editing an agent file, start a new conversation. Then ask for
the outcome you want; the orchestrator delegates to the matching agent by name
via the task tool.

## Vision alignment

The platform is being brought in line with the best of four markets — **United
States, India, Nigeria, China** — across the 13 main modules (ADR-0006). The
centre of gravity is a complete hospital/hotel PMS-ERP: deep inventory, store
and stock-keeping; financial agility; and a bright, lovely guest experience
with 7 selectable themes.

> This document is generated and maintained by an AI agent (OpenHands) on behalf
> of the project owner.
