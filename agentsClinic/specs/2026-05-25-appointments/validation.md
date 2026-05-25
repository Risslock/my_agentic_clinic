# Phase 4 Validation — Appointment Booking

Phase 4 is mergeable when all checks below pass on `mvp` without `--no-verify`.

---

## 1. Type check

```
npm run typecheck
```

Exit 0. New DB helpers, page components, and route handlers compile under `strict: true`.

---

## 2. Automated tests

```
npm test
```

All tests pass. New tests must cover:

| Test | Assertion |
|---|---|
| `POST /appointments` (missing `therapist_name`) | Returns 400; body contains error message |
| `POST /appointments` (past `scheduled_at`) | Returns 400; body contains error message |
| `POST /appointments` (unknown `agent_id`) | Returns 400 |
| `POST /appointments` (valid data) | Returns 302 redirect to `/appointments/:id` |
| `GET /appointments/:id` (valid) | Returns 200; body contains therapist name and formatted datetime |
| `GET /appointments/:id` (unknown) | Returns 404 |
| `GET /appointments` | Returns 200; body contains appointment table headers |
| `<Header>` component | Renders nav link to `/appointments` |

All Phase 1–3 tests must still pass.

---

## 3. Manual form verification

With `npm run seed` run and `npm run dev` running:

1. Open `localhost:3000/agents/<any-seeded-id>` — booking form is present on the page
2. Submit the form with all fields empty — form re-renders with inline error messages (no redirect)
3. Submit the form with a past datetime — form re-renders with a datetime error
4. Submit a valid booking — browser redirects to `/appointments/<new-id>` and shows booking details
5. Open `localhost:3000/appointments` — the new appointment appears in the table

---

## 4. Visual / responsive check

At 320 px viewport:

- Booking form on agent detail page has no horizontal overflow
- Appointments list table scrolls horizontally inside its wrapper if it overflows (no page-level overflow)
- Confirmation page is readable

---

## Merge criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm test` — all tests green including new Phase 4 tests
- [ ] Form validation re-renders with errors on bad input (no redirect)
- [ ] Valid form submission redirects to confirmation page
- [ ] Appointments list page shows the booked appointment
- [ ] No horizontal overflow at 320 px
