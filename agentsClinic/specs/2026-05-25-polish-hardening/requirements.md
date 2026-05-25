# Phase 6+7 Requirements — Polish & Hardening

## Scope

### Phase 6 — Polish & Accessibility
- Responsive layout audit: every page and component renders correctly from 320 px to 1280 px with no horizontal overflow
- Semantic HTML audit: pages use correct landmark elements (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`) so screen readers get accurate document structure
- Keyboard navigation: all interactive elements (links, buttons, form fields) are reachable and operable via Tab/Shift-Tab/Enter/Space
- Visible focus styles on all interactive elements (`:focus-visible` ring; PicoCSS provides defaults — verify they are not overridden)
- `alt` text on any images (none expected in MVP; audit confirms absence)
- `<label>` elements associated with every form input (`for`/`id` pairing)

### Phase 7 — Hardening
- Custom 404 page — rendered by Hono's `notFound` handler; uses the shared `<Layout>` component
- Custom 500 page — rendered by Hono's `onError` handler; logs the error server-side; returns a generic user-facing message
- Input sanitization on all POST form fields: strip leading/trailing whitespace; reject inputs that exceed column `maxlength` limits; no raw SQL concatenation anywhere (already satisfied by parameterised `better-sqlite3` statements — audit confirms this)
- Basic logging middleware: log method, path, status code, and response time (ms) for every request to stdout in a single line; use Hono's built-in `logger` middleware
- `AGENTCLINIC_API_KEY` startup guard extended to print a clear error and exit if the key is missing (LLM Triage phase may have partially covered this — verify and harden)

## Out of Scope

- WCAG 2.1 AA full audit — semantic correctness and keyboard navigation are in scope; colour contrast ratios and ARIA roles beyond landmark semantics are post-MVP
- Rate limiting (post-MVP)
- Content Security Policy headers (post-MVP)
- Automated accessibility testing (axe-core, Playwright) — manual spot-check is sufficient for MVP

## Decisions

### Audit-driven approach

Phase 6+7 is primarily an audit-and-fix phase. The plan enumerates each page and component as a checklist item. No new features are added; only regressions are fixed and gaps are filled.

### Logging format

```
[2026-05-25T12:34:56.789Z] GET /agents 200 12ms
```

Single line per request. No structured JSON logging for MVP — plain text is sufficient for a dev/demo environment.

### Error page design

Both 404 and 500 pages use the shared `<Layout>` component so the header and footer are present. The 404 page includes a link back to `/`. The 500 page shows a generic "Something went wrong" message — no stack traces in the response body.

### No new migrations

Phase 6+7 adds no DB changes. If an audit reveals a missing index that affects query performance, it may be added as `007_indexes.sql`, but this is optional.

## Context

Phase 6+7 is the gate before MVP is considered shippable. It ensures that a real operator (Mary) can use the dashboard without friction, and that a real orchestrator (an agent framework) can call the API without hitting unhandled edge cases. Shipping this phase means the app is defensible at a conference demo and usable in a real small deployment.
