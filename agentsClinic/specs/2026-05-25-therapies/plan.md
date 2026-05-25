# Phase 3 Plan — Therapies Catalog

Groups are ordered to minimise rework: migrations first, then seed, then routes, then tests.

---

## Group 1 — DB: Therapies

1. Create `src/db/migrations/004_therapies.sql` — `CREATE TABLE IF NOT EXISTS therapies (id, name, description, instructions)`
2. Create `src/db/migrations/004b_ailment_therapies.sql` — join table `(ailment_id, therapy_id)`
3. Add 8–10 therapy rows to `src/db/seed.ts`; add ailment–therapy mapping rows; guard with existence check (idempotent)

## Group 2 — Therapies List Page

4. Create `src/pages/TherapiesList.tsx` — queries all therapies, renders name and description; semantic `<ul>` or `<table>`
5. Register `GET /therapies` in `src/app.tsx`
6. Add `/therapies` link to `<Header>` nav; update `Header` Vitest test

## Group 3 — Ailment Detail Page

7. Create `src/pages/AilmentDetail.tsx` — queries one ailment by ID with a JOIN to `ailment_therapies` + `therapies`; renders name, description, and linked therapy names; returns 404 on unknown ID
8. Register `GET /ailments/:id` in `src/app.tsx`

## Group 4 — Agent Detail Update

9. Update `src/pages/AgentDetail.tsx` — for each linked ailment, add a link to `/ailments/:id`; no new DB queries required (ailment IDs are already fetched)

## Group 5 — Tests

10. `GET /therapies` — returns 200; body contains all seeded therapy names
11. `GET /ailments/:id` (valid) — returns 200; body contains therapy names mapped to that ailment
12. `GET /ailments/:id` (unknown) — returns 404
13. `<Header>` component — renders nav link to `/therapies`

## Group 6 — Verify

14. Run `npm run typecheck` — exit 0
15. Run `npm test` — all tests pass (Phase 3 new + Phase 1/2 existing)
16. Run `npm run seed` then `npm run dev`; manually curl `/therapies` and `/ailments/:id` — non-empty HTML returned
17. Open browser; verify nav link renders; confirm `/ailments/:id` shows therapy names
