# Phase 6+7 Plan — Polish & Hardening

This phase is audit-and-fix. Work through the checklist page by page; record fixes as small commits.

---

## Group 1 — Logging Middleware (Phase 7)

1. Import Hono's built-in `logger` middleware in `src/app.tsx`; register it before all routes
2. Verify log line format in terminal: `[timestamp] METHOD /path STATUS Nms`

## Group 2 — Error Pages (Phase 7)

3. Add `app.notFound(c => ...)` in `src/app.tsx` — renders a 404 page using `<Layout>`; includes an `<h1>Page Not Found</h1>` and a link back to `/`
4. Add `app.onError((err, c) => ...)` in `src/app.tsx` — logs the error to stderr; renders a 500 page using `<Layout>`; returns status 500 with a generic user-facing message; no stack trace in response body
5. Write tests: `GET /nonexistent-route` — returns 404 with "Page Not Found" in body

## Group 3 — Input Sanitization Audit (Phase 7)

6. Audit all `POST` handlers: confirm every form field is trimmed (`str.trim()`) before DB insertion; confirm no string concatenation in SQL (only parameterised `?` placeholders)
7. Add `maxlength` attributes to all form `<input>` and `<textarea>` elements matching column limits
8. Confirm `AGENTCLINIC_API_KEY` startup guard throws clearly if missing

## Group 4 — Semantic HTML Audit (Phase 6)

9. Audit each page: `Home`, `AgentsList`, `AgentDetail`, `AilmentsList`, `AilmentDetail`, `TherapiesList`, `AppointmentsList`, `AppointmentConfirmation`, `Dashboard`
10. Ensure each page has exactly one `<main>` landmark; `<Header>` uses `<header>`; `<Footer>` uses `<footer>`
11. Ensure all form `<input>` and `<textarea>` elements have associated `<label for="...">` elements

## Group 5 — Keyboard Navigation Audit (Phase 6)

12. Tab through every page; confirm all links, buttons, and form fields receive focus in logical order
13. Confirm `:focus-visible` ring is visible on all focused interactive elements; patch `static/style.css` if PicoCSS focus styles are being unintentionally overridden

## Group 6 — Responsive Audit (Phase 6)

14. For each page listed in Group 4, open in DevTools at 320 px: no horizontal overflow, no clipped nav, all content readable
15. At 768 px: nav is horizontal, container has visible max-width/padding
16. Fix any overflowing elements found (most likely candidate: tables — wrap in `overflow-x: auto` if not already done)

## Group 7 — Final Verify

17. Run `npm run typecheck` — exit 0
18. Run `npm test` — all tests pass including new 404 test
19. Manual walk-through: visit every route, trigger a 404, trigger a 500 (temporarily throw in a handler), submit a form with missing fields; confirm all error states render correctly
20. Check terminal for structured log lines on each request
