# Phase 8 Plan — Visit UI

Groups are ordered to minimise rework: DB helpers first, then the new page, then the updated component, then routes, then tests.

---

## Group 1 — DB helpers

1. Add `getVisitsByAgent(agentId: string): Visit[]` to `src/db/visits.ts` — `SELECT * FROM visits WHERE agent_id = ? ORDER BY created_at DESC`
2. Add `getVisitWithAilments(id: string)` to `src/db/visits.ts` — returns the visit row plus a `diagnosed_ailments: Pick<Ailment, "id" | "name">[]` array resolved from `diagnosis_ailment_ids` JSON; returns `undefined` if the visit does not exist

## Group 2 — VisitDetail page

3. Create `src/pages/VisitDetail.tsx` — accepts `visit: Visit` and `diagnosedAilments: Pick<Ailment, "id" | "name">[]`; renders four `<section>` blocks:
   - **Symptoms** — `visit.symptoms` in a `<blockquote>`
   - **Triage** — parse `visit.triage_output`; show severity as `<mark>`, rationale as `<p>`; fall back to "Pending triage" when null
   - **Diagnosis** — render `diagnosedAilments` as a `<ul>` of ailment names linked to `/ailments/:id`; fall back to "Pending diagnosis" when `visit.diagnosis_ailment_ids` is null
   - **Prescription** — parse `visit.prescription`; render therapies as an `<ol>` sorted by `priority`, each `<li>` showing therapy name and instructions; render overall rationale as a `<blockquote>`; fall back to "Pending prescription" when null
4. Add a `<p><a href="/agents/{visit.agent_id}">← Back to agent</a></p>` footer link

## Group 3 — AgentDetail update

5. Add `visits: Visit[]` prop to `AgentDetailProps` in `src/pages/AgentDetail.tsx`
6. Append a **Visit History** `<section>` below the booking form — `<table>` with columns Date, Status, Severity, and a "View" link; empty state: "No visits on record."

## Group 4 — Routes

7. Add `GET /visits/:id` to `src/app.tsx`:
   - Call `getVisitWithAilments(id)`
   - Return 404 if undefined
   - Render `<VisitDetail visit={...} diagnosedAilments={...} />`
8. Update `GET /agents/:id` in `src/app.tsx`:
   - Call `getVisitsByAgent(agent.id)`
   - Pass `visits` to `<AgentDetail />`
9. Add `/visits` nav link is **not** added — visits are accessed only from agent detail pages (no standalone list page in this phase)

## Group 5 — Tests

10. `GET /visits/does-not-exist` — returns 404
11. `GET /visits/:id` for an open visit (status `open`) — returns 200; body contains the submitted symptoms text and "Pending triage"
12. `GET /agents/:id` for any seeded agent — body contains "Visit History"
13. `GET /visits/:id` for a prescribed visit (if API key available, create one via `POST /api/visits` + triage + diagnose + prescribe) — body contains a therapy name from the prescription

## Group 6 — Verify

14. Run `npm run typecheck` — exit 0
15. Run `npm test` — all tests pass (new Phase 8 tests + all prior tests)
16. Create a visit via API: `POST /api/visits` → open `/visits/:id` in browser; confirm "Submitted Symptoms" and "Pending triage" render correctly
17. Run the full pipeline (`/triage` → `/diagnose` → `/prescribe`) then reload `/visits/:id`; confirm all four sections show real data
18. Open `/agents/:id` for a seeded agent; confirm the Visit History table appears below the booking form
19. Verify no horizontal overflow at 320 px viewport on either `/visits/:id` or the updated `/agents/:id`
