# Phase 6+7 Validation — Polish & Hardening

This phase is mergeable when every item in the merge criteria checklist is checked.

---

## 1. Type check

```
npm run typecheck
```

Exit 0.

---

## 2. Automated tests

```
npm test
```

All tests pass. New tests must cover:

| Test | Assertion |
|---|---|
| `GET /nonexistent-route` | Returns 404; body contains "Page Not Found" or equivalent |

All Phase 1–5 tests must still pass.

---

## 3. Error page verification

```bash
# 404
curl -s -o /dev/null -w "%{http_code}" localhost:3000/does-not-exist
# expected: 404

curl -s localhost:3000/does-not-exist | grep -i "not found"
# expected: non-empty match
```

Trigger a 500 by temporarily adding `throw new Error("test")` to any route handler, then reverting:

- Server logs the error to stderr
- Browser receives a 500 response with a generic "Something went wrong" message
- No stack trace in the response body

---

## 4. Logging verification

With `npm run dev` running, make any request (e.g. `curl localhost:3000/`). Terminal must show a line in the format:

```
[2026-05-25T12:34:56.789Z] GET / 200 5ms
```

---

## 5. Input sanitization audit

- [ ] Confirm each POST handler trims all string fields (`therapist_name.trim()`, etc.)
- [ ] Confirm no SQL string concatenation — all queries use `?` placeholders
- [ ] Form `<input>` and `<textarea>` elements have `maxlength` attributes matching column limits

---

## 6. Semantic HTML audit

For each page (`Home`, `AgentsList`, `AgentDetail`, `AilmentsList`, `AilmentDetail`, `TherapiesList`, `AppointmentsList`, `AppointmentConfirmation`, `Dashboard`):

- [ ] Exactly one `<main>` landmark per page
- [ ] `<header>` wraps the site header; `<footer>` wraps the site footer
- [ ] All form inputs have associated `<label>` elements

---

## 7. Keyboard navigation spot-check

Tab through `/agents`, `/agents/:id` (booking form), and `/dashboard`:

- [ ] All links, buttons, and form fields are Tab-reachable in logical order
- [ ] `:focus-visible` ring is visible on focused elements

---

## 8. Responsive audit

At 320 px, for every page:

- [ ] No element overflows the viewport horizontally
- [ ] Nav links are visible and tappable

At 768 px:

- [ ] Nav links are horizontal
- [ ] Container has max-width / padding from `static/style.css`

---

## Merge criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm test` — all tests green including new 404 test
- [ ] 404 route returns 404 with "Page Not Found" in body
- [ ] 500 error returns generic message with no stack trace; error logged to stderr
- [ ] Log line appears in terminal on every request
- [ ] All POST form fields are trimmed; no SQL concatenation
- [ ] All form inputs have `<label>` elements
- [ ] Tab navigation works on `/agents/:id` booking form
- [ ] No horizontal overflow at 320 px on any page
