# Phase 4 Plan — Appointment Booking

Groups are ordered so the DB is ready before routes, and validation is tested before the confirmation flow.

---

## Group 1 — DB: Appointments

1. Create `src/db/migrations/006_appointments.sql` — `CREATE TABLE IF NOT EXISTS appointments (id, agent_id, therapist_name, scheduled_at, status, notes, created_at)`
2. Create typed query helpers in `src/db/appointments.ts`: `createAppointment`, `getAppointment`, `listAppointments`

## Group 2 — Appointments List Page

3. Create `src/pages/AppointmentsList.tsx` — queries all appointments ORDER BY `scheduled_at` DESC; renders agent name (via JOIN), therapist name, datetime, and status as a `<table>`
4. Register `GET /appointments` in `src/app.tsx`
5. Add `/appointments` link to `<Header>` nav; update `Header` Vitest test

## Group 3 — Booking Form

6. Update `src/pages/AgentDetail.tsx` — add a `<form action="/appointments" method="POST">` below the agent profile; include a hidden `<input name="agent_id" value="...">`, a `therapist_name` text input, a `scheduled_at` datetime-local input, and an optional `notes` textarea
7. Create `src/pages/AppointmentConfirmation.tsx` — reads the appointment row by ID and renders booking details

## Group 4 — POST Handler

8. Register `POST /appointments` in `src/app.tsx`:
   - Parse form body
   - Server-side validation (required fields, agent exists, future datetime, length limits)
   - On failure: re-render the agent detail page with inline error messages (status 400)
   - On success: insert row, redirect to `GET /appointments/:id`
9. Register `GET /appointments/:id` — renders `AppointmentConfirmation`; returns 404 on unknown ID

## Group 5 — Tests

10. `POST /appointments` with missing `therapist_name` — returns 400 with error in body
11. `POST /appointments` with past `scheduled_at` — returns 400
12. `POST /appointments` with unknown `agent_id` — returns 400
13. `POST /appointments` with valid data — returns 302 redirect to `/appointments/:id`
14. `GET /appointments/:id` (valid) — returns 200; body contains therapist name and scheduled datetime
15. `GET /appointments/:id` (unknown) — returns 404
16. `GET /appointments` — returns 200; body contains appointment rows

## Group 6 — Verify

17. Run `npm run typecheck` — exit 0
18. Run `npm test` — all tests pass
19. Open browser; navigate to an agent detail page; submit the booking form; confirm redirect to confirmation page
20. Verify form re-renders with inline errors when required fields are blank or datetime is in the past
