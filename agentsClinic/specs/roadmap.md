# Roadmap

Phases are intentionally focused — each one is a shippable slice of work, independently reviewable and testable.

---

## Phase 1 — Hello Hono ✅
- Install and configure Hono with `tsx` dev server
- Single `/` route returning "AgentClinic is open for business"
- Confirm TypeScript types work end-to-end

## Phase 2 — Agents & Ailments ✅
- Server-side JSX layout component (header, nav, main, footer)
- Basic CSS (custom properties, reset, typography)
- All routes render inside the shared layout
- SQLite database + first migration (`agents` table)
- Seed a handful of fictional agents
- `/agents` page listing all agents
- `/agents/:id` page showing a single agent's profile (name, model type, current status, presenting complaints)
- `ailments` table + seed data (e.g., "context-window claustrophobia", "prompt fatigue")
- `/ailments` list page
- Link agents to one or more ailments

## Phase 3 — Therapies Catalog ✅
- `therapies` table + seed data
- `/therapies` list page
- Map ailments → recommended therapies

## Phase 4 — Appointment Booking ✅
- `appointments` table (agent, therapist, datetime, status)
- Form to book an appointment from an agent's detail page
- Basic validation and confirmation page

## Phase 5 — Staff Dashboard ✅
- `/dashboard` with summary counts: agents, open appointments, ailments in-flight
- Simple table views for staff to manage records

## Phase 6 — Polish & Accessibility ✅
- Responsive layout audit across all pages
- Semantic HTML audit
- Keyboard navigation and focus styles

## Phase 7 — Hardening ✅
- Error pages (404, 500)
- Input sanitization on all forms
- Basic logging middleware

## LLM Triage ✅
- `/api/visits` — create a visit for an agent
- `/api/visits/:id/triage` — LLM-powered severity classification and ailment identification
- `/api/visits/:id/diagnose` — confirm diagnosis against the ailments catalog
- `/api/visits/:id/prescribe` — LLM-powered therapy selection and ranking
- Bearer token auth on all `/api/*` routes
- Demo mode (no API key required) with stub responses

## Phase 8 — Visit UI ✅
- Visit history table on `/agents/:id`
- `/visits/:id` detail page — symptoms, triage rationale, diagnosis, full prescription

---

## Next: Phase 9 — API Hardening & Agent Self-Service
- `POST /api/agents` — register a new agent programmatically
- `POST /api/intake` — single-call pipeline (triage → diagnose → prescribe in one request)
- `GET /api/agents` — list all agents
- `GET /api/agents/:id` — get one agent with visit history summary

---

Later phases (not yet planned): auth, email notifications, therapist profiles, reporting, outcome/follow-up recording.
