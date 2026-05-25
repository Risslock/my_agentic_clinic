# Phase 3 Validation — Therapies Catalog

Phase 3 is mergeable when all checks below pass on `mvp` without `--no-verify`.

---

## 1. Type check

```
npm run typecheck
```

Exit 0. Every new source file (DB layer, pages) compiles under `strict: true`.

---

## 2. Automated tests

```
npm test
```

All tests pass. New tests must cover:

| Test | Assertion |
|---|---|
| `GET /therapies` | Returns 200; body contains all seeded therapy names |
| `GET /ailments/:id` (valid) | Returns 200; body contains therapy names mapped to that ailment |
| `GET /ailments/:id` (unknown) | Returns 404 |
| `<Header>` component | Renders nav link to `/therapies` |

Phase 1 and Phase 2 tests must still pass — no regressions.

---

## 3. Manual curl verification

With `npm run seed` run once and `npm run dev` running:

```bash
curl -s localhost:3000/therapies | grep -i "protocol"
curl -s localhost:3000/ailments/<any-seeded-id> | grep -i "therapy"
```

Each command returns non-empty HTML. A 404 or 500 means the phase is not done.

---

## 4. Visual check

Open `localhost:3000/therapies` in a browser:

- Nav includes a `/therapies` link
- Therapies list shows name and description for all seeded therapies
- At 320 px: no horizontal overflow
- Open `/ailments/:id`: therapy names are listed under the ailment

---

## Merge criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm test` — all tests green including new Phase 3 tests
- [ ] Manual curl returns valid HTML for `/therapies` and `/ailments/:id`
- [ ] `/ailments/:id` shows linked therapy names in browser
- [ ] No horizontal overflow at 320 px
