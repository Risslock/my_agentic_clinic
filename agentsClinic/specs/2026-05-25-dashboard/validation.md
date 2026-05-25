# Phase 5 Validation — Staff Dashboard

Phase 5 is mergeable when all checks below pass on `mvp` without `--no-verify`.

---

## 1. Type check

```
npm run typecheck
```

Exit 0. Dashboard DB helpers and the `Dashboard.tsx` page component compile under `strict: true`.

---

## 2. Automated tests

```
npm test
```

All tests pass. New tests must cover:

| Test | Assertion |
|---|---|
| `GET /dashboard` | Returns 200 |
| `GET /dashboard` | Body contains "Total Agents", "Open Appointments", "Ailments In-Flight" |
| `GET /dashboard` | Body contains at least one agents table column header (e.g. "Model Type") |
| `GET /dashboard` | Body contains at least one appointments table column header (e.g. "Therapist") |
| `<Header>` component | Renders nav link to `/dashboard` |

All Phase 1–4 tests must still pass.

---

## 3. Manual verification

With `npm run seed` run, one appointment booked (from Phase 4), and `npm run dev` running:

```bash
curl -s localhost:3000/dashboard | grep -i "total agents"
```

Returns non-empty HTML containing the count labels.

In browser at `localhost:3000/dashboard`:

- Summary cards show non-zero counts for agents and ailments in-flight
- Agents table lists all 5 seeded agents with name, model type, status, and ailment count
- Appointments table lists the booked appointment with agent name, therapist, datetime, and status

---

## 4. Responsive check

At 320 px:

- Summary cards stack vertically — no horizontal overflow
- Tables scroll horizontally inside their `overflow-x: auto` wrappers — no page-level overflow
- Nav link to `/dashboard` is visible and tappable

At 768 px:

- Summary cards render in a row (if styled as a flex/grid row) or at least are not cramped
- Tables are fully visible without horizontal scroll

---

## Merge criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm test` — all tests green including new Phase 5 tests
- [ ] `/dashboard` shows correct summary counts after seeding
- [ ] Agents table and appointments table both render with data
- [ ] No horizontal overflow at 320 px; tables scroll within their wrappers
