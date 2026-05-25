# Phase 4 Requirements — Appointment Booking

## Scope

- `appointments` table (agent, therapist name, datetime, status, notes)
- Booking form accessible from `/agents/:id` — prefilled with agent ID
- Form submission creates a new appointment row
- Confirmation page at `/appointments/:id` — shows booking details
- `/appointments` list page — all appointments, newest first
- Basic server-side validation (required fields, valid datetime, known agent ID)

## Out of Scope

- Therapist profiles or a `therapists` table — therapist name is a free-text field for MVP
- Email / calendar notifications (post-MVP)
- Editing or cancelling appointments via UI — status changes are manual DB edits for MVP
- Auth or access control on the booking form

## Decisions

### Appointments schema

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (UUID v4) | Primary key |
| `agent_id` | TEXT NOT NULL | FK → agents.id |
| `therapist_name` | TEXT NOT NULL | Free-text; no FK to a therapists table |
| `scheduled_at` | TEXT NOT NULL | ISO 8601 datetime string |
| `status` | TEXT NOT NULL | `scheduled`, `completed`, `cancelled` — default `scheduled` |
| `notes` | TEXT | Optional free-text notes from the booking form |
| `created_at` | TEXT NOT NULL | ISO 8601 timestamp |

### Migration file

`src/db/migrations/006_appointments.sql`

### Booking form validation (server-side)

- `agent_id` must match a row in `agents`; return 400 on unknown ID
- `therapist_name` required, max 100 chars
- `scheduled_at` required, must parse as a valid ISO 8601 datetime and be in the future; return 400 with an inline error message on failure
- `notes` optional, max 500 chars
- On validation failure: re-render the form with inline error messages (no redirect)
- On success: redirect to `/appointments/:id` (POST → redirect → GET pattern)

### No ORM

Consistent with Phase 2 decision. Raw `better-sqlite3` queries, TypeScript wrappers.

### Seed data

No seed appointments — the table starts empty. The validation tests use programmatic inserts.

## Context

Appointment booking is the first write path in the app. The POST → redirect → GET pattern prevents double-submission on browser refresh. Validation must happen on the server, not only in the browser, because the form is the only guard before a row is written.

The booking form on `/agents/:id` should be a minimal `<form>` using PicoCSS semantic form styling. No JavaScript required — the form must work with native HTML form submission.
