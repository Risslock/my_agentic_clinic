# Phase 2 Plan — Agents & Ailments

Groups are ordered for minimal rework: PicoCSS first, then DB, then routes, then tests.

---

## Group 1 — PicoCSS Setup

1. Install `@picocss/pico` as a production dependency
2. Copy the minified stylesheet (`node_modules/@picocss/pico/css/pico.min.css`) into `static/pico.min.css` as part of a build/copy step, **or** serve it directly from `node_modules` via the static middleware — pick whichever is simpler; document the choice in a comment in `src/index.tsx`
3. Add `<link rel="stylesheet" href="/static/pico.min.css">` to `src/components/Layout.tsx` (before the existing `style.css` link so local overrides win)
4. Trim `static/style.css` down to layout-only overrides (e.g. `max-width` container, body padding); remove any rules that PicoCSS now handles (reset, typography, colour)

## Group 2 — Navigation

5. Update `src/components/Header.tsx` to include a `<nav>` element wrapping a `<ul>` of `<li><a href="...">` items for `/agents` and `/ailments` — the semantic structure PicoCSS styles automatically
6. Update Vitest tests for `Header` to assert the nav links are present

## Group 3 — Database Setup

7. Install `better-sqlite3` and `@types/better-sqlite3`; install `uuid` and `@types/uuid`
8. Create `src/db/database.ts` — opens (or creates) `clinic.sqlite`, exports the `Database` instance
9. Create `src/db/migrate.ts` — reads all `*.sql` files from `src/db/migrations/` in filename order and executes each; idempotent (safe to run on every restart)
10. Call `migrate()` at server startup in `src/index.tsx` before `serve()`

## Group 4 — Agents Feature

11. Create `src/db/migrations/001_agents.sql` — `CREATE TABLE IF NOT EXISTS agents (...)`
12. Create `src/db/seed.ts` with 5 fictional agents; check for existing rows before inserting
13. Add `"seed": "tsx src/db/seed.ts"` to `package.json` scripts
14. Create `src/pages/AgentsList.tsx` — queries all agents, renders a list with name, model type, and status; each row links to `/agents/:id`
15. Create `src/pages/AgentDetail.tsx` — queries one agent by ID; returns 404 if not found; shows name, model type, status, presenting complaints, and linked ailments
16. Register `GET /agents` and `GET /agents/:id` routes in `src/app.tsx`
17. Write Vitest tests: `GET /agents` returns 200 with agent names; `GET /agents/[valid-id]` returns 200; `GET /agents/[bad-id]` returns 404

## Group 5 — Ailments Feature

18. Create `src/db/migrations/002_ailments.sql` — `CREATE TABLE IF NOT EXISTS ailments (...)`
19. Add 6–8 ailments to `src/db/seed.ts`
20. Create `src/pages/AilmentsList.tsx` — queries all ailments, renders a list with name and description
21. Register `GET /ailments` route in `src/app.tsx`
22. Write Vitest tests: `GET /ailments` returns 200 with ailment names

## Group 6 — Agent–Ailment Linking

23. Create `src/db/migrations/003_agent_ailments.sql` — `CREATE TABLE IF NOT EXISTS agent_ailments (agent_id TEXT, ailment_id TEXT, PRIMARY KEY (agent_id, ailment_id), FOREIGN KEY ...)`
24. Add agent-ailment seed rows to `src/db/seed.ts` — each agent linked to at least one ailment; at least one agent linked to two or more
25. Update `AgentDetail.tsx` to JOIN `agent_ailments` and `ailments` and display the linked ailment names
26. Extend Vitest test for `GET /agents/:id` to assert ailment names appear in the response body

## Group 7 — Verify

27. Run `npm run typecheck` — exit 0, no errors
28. Run `npm test` — all tests pass (new + existing)
29. Run `npm run seed` then `npm run dev`; manually curl `/agents`, `/agents/:id`, and `/ailments` and confirm HTML is returned
30. Open browser at `localhost:3000` and verify nav links work and no horizontal overflow at 320 px viewport width
