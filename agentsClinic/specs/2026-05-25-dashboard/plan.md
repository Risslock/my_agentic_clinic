# Phase 5 Plan — Staff Dashboard

Groups are ordered to deliver the static summary first, then extend with live data if SSE is in scope.

---

## Group 1 — Summary Counts Query

1. Create `src/db/dashboard.ts` — `getDashboardCounts()`: returns `{ totalAgents, openAppointments, ailmentsInFlight }` in a single DB call using three `SELECT COUNT(*)` subqueries; define "in-flight" per requirements

## Group 2 — Dashboard Page

2. Create `src/pages/Dashboard.tsx` — renders three summary cards (total agents, open appointments, ailments in-flight); renders agents table and appointments table using data from typed DB helpers
3. Register `GET /dashboard` in `src/app.tsx`
4. Add `/dashboard` nav link to `<Header>`; update `Header` Vitest test

## Group 3 — Responsive Tables

5. Wrap each `<table>` in `<div style="overflow-x: auto">` in `Dashboard.tsx`
6. Verify at 320 px no table causes horizontal overflow on the page

## Group 4 — SSE (Optional)

7. [ ] Create `src/api/dashboardStream.ts` — opens a `ReadableStream`; pushes `getDashboardCounts()` result as `data: {...}\n\n` every 30 seconds
8. [ ] Register `GET /api/dashboard/stream` in `src/app.tsx` with `Content-Type: text/event-stream`
9. [ ] Add a minimal `<script>` block to `Dashboard.tsx` that opens `EventSource('/api/dashboard/stream')` and updates count elements by ID on each `message` event

_Items marked `[ ]` are optional for MVP. Skip if time-constrained; the dashboard is fully functional as static HTML._

## Group 5 — Tests

10. `GET /dashboard` — returns 200; body contains the three count labels ("Total Agents", "Open Appointments", "Ailments In-Flight")
11. `GET /dashboard` — body contains the agents table and the appointments table (assert at least one column header)
12. `<Header>` component — renders nav link to `/dashboard`

## Group 6 — Verify

13. Run `npm run typecheck` — exit 0
14. Run `npm test` — all tests pass
15. Open browser at `localhost:3000/dashboard`; confirm counts are non-zero after seeding; confirm tables render; confirm no horizontal overflow at 320 px
