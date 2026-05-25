# Phase 5 Requirements — Staff Dashboard

## Scope

- `/dashboard` page — summary counts: total agents, open appointments, ailments in-flight (agents with active ailment links and no `prescribed` visit)
- Agents table: name, model type, status, ailment count, link to detail page
- Appointments table: agent name, therapist, scheduled datetime, status — sorted by `scheduled_at` DESC
- Nav link to `/dashboard` added to the shared `<Header>`
- Optional: Server-Sent Events (SSE) endpoint at `/api/dashboard/stream` for live count updates

## Out of Scope

- Authentication / access control on the dashboard (post-MVP; assumes private deployment)
- Charts or graphical analytics (post-MVP; Recharts is in the tech stack but not wired until post-MVP)
- Editing records from the dashboard — read-only for MVP
- Paginating large tables — dashboard assumes a small fleet for MVP

## Decisions

### Summary counts query

All three counts are computed in a single DB round-trip using three `SELECT COUNT(*)` subqueries (or a `WITH` CTE). No ORM.

### "Ailments in-flight" definition

An agent is "in-flight" if they have at least one row in `agent_ailments` AND their most recent visit either has `status = 'triaged'` or `status = 'diagnosed'` (i.e., not yet `prescribed`). Agents with no visits are excluded from the in-flight count.

### SSE (optional for MVP)

If implemented: `/api/dashboard/stream` returns `text/event-stream`. The server pushes a `data: {...counts...}` event every 30 seconds. The dashboard page includes a minimal `<script>` block that opens the SSE connection and updates the count elements in place. If SSE is deferred: the dashboard is static HTML, refreshed on page load only. Mark the SSE feature as `[ ] optional` in the plan.

### Responsive tables

Tables use PicoCSS `<table>` defaults. On narrow viewports (< 640 px) tables scroll horizontally inside a `<div style="overflow-x: auto">` wrapper so the layout never breaks.

## Context

Phase 5 is Mary's dashboard — the operator view. It surfaces the clinic's current state at a glance: how many agents are registered, how many appointments are open, and how many agents are still waiting on a prescription. This is the first page that proves the full data model (agents → ailments → visits → appointments) is wired together correctly.
