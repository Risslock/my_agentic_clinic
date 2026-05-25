# AgentClinic Roadmap

Nano phases — each delivers 1-3 working features, completable in a day or less. Each phase leaves the app in a runnable state.

---

## Phase 1 — Project scaffold ✅
- Initialize Next.js 14 with TypeScript and App Router
- Configure Tailwind CSS
- Add a root `page.tsx` that redirects to `/dashboard`
- Add a placeholder `/dashboard` page: "AgentClinic — 0 patients, 0 visits"
- All pages use mobile-first responsive CSS; `<meta name="viewport">` present in every HTML shell

## Phase 2 — Database schema + seed
- Install `better-sqlite3`, `drizzle-orm`, `drizzle-kit`, `uuid`
- Define Drizzle schema: `patients`, `visits`, `ailments`, `treatments`, `ailment_treatments`
- Write seed script with 10 core ailments, 10 core treatments, and effectiveness mappings
- DB initializes and seeds on first `npm run dev`

## Phase 3 — Patient registration API
- `POST /api/patients` — register an agent; return `patient_id`
- `GET /api/patients` — list patients with `?status=` and `?owner=` filters
- `GET /api/patients/:id` — retrieve patient record
- `PATCH /api/patients/:id` — update metadata or status

## Phase 4 — Patient visit history API
- `GET /api/patients/:id/history` — paginated visit list with `?ailment=` filter
- `GET /api/visits` — list visits with `?patient_id=`, `?state=`, `?severity=` filters
- `GET /api/visits/:id` — retrieve single visit record

## Phase 5 — Triage + diagnosis engine
- Install `@anthropic-ai/sdk`
- Implement LLM Call 1: given `symptom_text` + patient history + ailment catalog → severity + diagnosed ailments with confidence scores
- Auto-create a custom ailment if no catalog match reaches the 0.4 confidence threshold

## Phase 6 — Treatment selection + prescription engine
- Deterministic treatment ranking: query `ailment_treatments`, compute blended effectiveness score, annotate with `recently_failed` and `exhausted` flags
- Implement LLM Call 2: select treatment per ailment, generate rationale, handle conflicts between co-occurring ailments

## Phase 7 — Visit creation endpoint
- `POST /api/visits` — runs the full pipeline (validate → triage → diagnose → select → prescribe) synchronously and returns the complete visit record
- Set visit state to `AWAITING_FOLLOWUP`, compute `followup_due`

## Phase 8 — Follow-up endpoint
- `POST /api/visits/:id/followup` — record outcome, transition visit state, update `ailment_treatments` effectiveness scores
- Detect recurrence (same ailment within 7 days) and set `recurrence_flag`
- Detect chronic condition (3+ recurrences in 30 days) and update `patient.chronic_conditions`

## Phase 9 — Background jobs
- Visit expiration: transition `AWAITING_FOLLOWUP` visits past `followup_due` to `EXPIRED`
- Chronic condition check: runs after each visit resolution
- Both run on a configurable interval via Next.js instrumentation hook

## Phase 10 — Catalog APIs
- `GET /api/ailments` and `GET /api/ailments/:code`
- `POST /api/ailments` — register a custom ailment
- `GET /api/treatments` and `GET /api/treatments/:code`

## Phase 11 — Analytics APIs
- `GET /api/analytics/overview` — active patients, open visits, resolution rate, ailment distribution, severity breakdown, recent visits
- `GET /api/analytics/ailments` — trending ailments, severity heatmap, treatment effectiveness table
- `GET /api/analytics/treatments` — effectiveness rankings, recurrence rates
- `GET /api/analytics/patients/:id` — individual visit frequency, ailment history, version changelog

## Phase 12 — Dashboard overview page
- Stat cards: active patients, open visits, resolution rate
- Ailment distribution bar chart, severity donut chart (Recharts)
- Recent visits table (last 20, click to patient detail)
- Stat cards stack vertically on mobile, flow to a multi-column grid on wider viewports

## Phase 13 — Patient directory + detail pages
- `/dashboard/patients` — searchable, filterable patient list with chronic condition badges
- `/dashboard/patients/[id]` — patient detail: header, visit timeline, treatment history panel
- Patient list and detail panels reflow to single-column on narrow viewports

## Phase 14 — Ailment analytics + alerts pages
- `/dashboard/ailments` — trending chart, heatmap, effectiveness table, custom ailment review queue
- `/dashboard/alerts` — referral queue and chronic condition alert cards
- Charts and tables scroll horizontally on small screens rather than overflowing the viewport

## Phase 15 — SSE real-time updates
- `GET /api/events` — Server-Sent Events endpoint
- Events: `visit_created`, `visit_resolved`, `referral_created`, `chronic_flagged`
- Dashboard pages reconnect with exponential backoff on SSE drop

## Phase 16 — Auth middleware + health check
- `GET /api/health` — returns DB status, patient count, visit count
- Middleware: validate `Authorization: Bearer` header on all `/api/*` routes except `/api/health` and `/api/events`
- Dev mode: skip auth if `AGENTCLINIC_API_KEY` is unset, log warning at startup
