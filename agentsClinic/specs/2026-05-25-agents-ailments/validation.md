# Phase 2 Validation — Agents & Ailments

Phase 2 is mergeable when all four checks below pass on `phase-2-agents-ailments` without `--no-verify`.

---

## 1. Type check

```
npm run typecheck
```

Exit 0. No TypeScript errors. Every new source file (DB layer, pages, components) must compile under `strict: true`.

---

## 2. Automated tests

```
npm test
```

All tests pass. New tests must cover:

| Test | Assertion |
|---|---|
| `GET /agents` | Returns 200; response body contains all 5 seeded agent names |
| `GET /agents/:id` (valid ID) | Returns 200; body contains the agent's name, model type, status, and at least one ailment name |
| `GET /agents/:id` (unknown ID) | Returns 404 |
| `GET /ailments` | Returns 200; body contains all seeded ailment names |
| `<Header>` component | Renders a `<nav>` with links to `/agents` and `/ailments` |

Existing Phase 1 tests (`GET /`, Layout, Main, Footer) must still pass — no regressions.

---

## 3. Manual curl verification

With `npm run seed` run once and `npm run dev` running:

```bash
curl -s localhost:3000/agents | grep -i "agent"
curl -s localhost:3000/agents/<any-seeded-id> | grep -i "ailment"
curl -s localhost:3000/ailments | grep -i "fatigue"
```

Each command must return non-empty HTML. If any returns a 404 or 500, the phase is not done.

---

## 4. Visual / responsive check

Open `localhost:3000/agents` in a browser. In DevTools, set viewport to **320 px wide**:

- No element overflows the viewport horizontally
- Nav links are visible and tappable (not clipped)
- PicoCSS base styles are applied (readable typography, no raw browser defaults)
- Agent list rows are readable

At **768 px wide**:

- Nav links render as a horizontal row (PicoCSS default nav behaviour)
- Page has visible container padding / max-width from `static/style.css` override

---

## Merge criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm test` — all tests green, including new Phase 2 tests
- [ ] Manual curl checks return valid HTML for all three routes
- [ ] No horizontal overflow at 320 px; nav is horizontal at 768 px
