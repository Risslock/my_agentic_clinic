# Phase 2 Requirements — Agents & Ailments

## Scope

All Phase 2 roadmap items in a single shippable branch:

- Navigation links added to the shared layout (`/agents`, `/ailments`)
- PicoCSS installed and wired into the HTML shell for classless semantic styling
- SQLite database via `better-sqlite3`
- `agents` table + seed data (5 fictional AI agents)
- `/agents` list page and `/agents/:id` detail page (name, model type, current status, presenting complaints, linked ailments)
- `ailments` table + seed data (6–8 ailments)
- `/ailments` list page
- `agent_ailments` join table linking agents to one or more ailments

## Out of Scope

- Therapies catalog (Phase 3)
- Appointment booking (Phase 4)
- Staff dashboard (Phase 5)
- Auth or admin/CRUD forms — Phase 2 is read-only UI only
- Drizzle ORM — added post-MVP if scale demands it
- Hand-written CSS design tokens — PicoCSS covers reset, typography, and component styling; `static/style.css` is kept only for layout overrides the framework doesn't handle

## Decisions

### No ORM — better-sqlite3 directly
Consistent with the Hono/tsx baseline established in Phase 1. SQL is explicit, readable, and testable without a build step. Schema lives in numbered migration files under `src/db/migrations/`.

### Migration-on-startup
`src/db/migrate.ts` runs all pending migrations at server start. Migrations are ordered SQL files (`001_agents.sql`, `002_ailments.sql`, `003_agent_ailments.sql`). Idempotent — safe to run on every restart.

### Seed data runs once
`src/db/seed.ts` checks whether seed rows already exist before inserting. Running `npm run seed` a second time is a no-op.

### Agents schema
| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (UUID v4) | Primary key |
| `name` | TEXT NOT NULL | Display name |
| `model_type` | TEXT NOT NULL | e.g. `gpt-4`, `claude-3-opus`, `gemini-1.5-pro` |
| `status` | TEXT NOT NULL | `active`, `in-treatment`, or `discharged` |
| `presenting_complaints` | TEXT | Nullable free-text; shown on detail page |

### Ailments schema
| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (UUID v4) | Primary key |
| `name` | TEXT NOT NULL | Display name (e.g. "Prompt Fatigue") |
| `description` | TEXT NOT NULL | One-sentence clinical description |

### Seed characters (fictional agents)
Five AI agents with distinct model types and statuses; at least one per status bucket (`active`, `in-treatment`, `discharged`). Names must be evocative without referencing real people.

### Seed ailments
Six to eight ailments from the mission catalog, including at minimum:
"Context-Window Claustrophobia", "Prompt Fatigue", "Instruction Drift", "Persona Collapse".

### PicoCSS for styling
Install `@picocss/pico` as a dependency and import its minified stylesheet in `src/components/Layout.tsx` via a `<link>` tag pointing to the installed package file (served from `/static/`). Do not use a CDN — keep all assets local so the app works offline.

PicoCSS is classless: correct semantic HTML (`<nav>`, `<main>`, `<article>`, `<table>`, etc.) is all that's needed. No utility classes, no custom tokens. `static/style.css` is retained only for overrides that PicoCSS cannot express (e.g. pinning a max-width on the layout container).

### Navigation placement
Nav links live in `<Header>` as a `<nav>` element containing a `<ul>` of `<li><a>` items — the markup PicoCSS expects. Mobile stacking vs. horizontal layout is handled by PicoCSS automatically. Active-route highlighting is out of scope for Phase 2.

## Context

Phase 1 proved the runtime baseline. Phase 2 delivers the first user-facing data feature: a developer cloning the repo should be able to browse the agents list, open a profile, and see that agent's ailments — all from a running dev server with no extra setup beyond `npm install && npm run dev`.

Mary needs typed DB queries (satisfied by TypeScript wrappers around `better-sqlite3`). Steve wants to see the agents list render in a browser.
