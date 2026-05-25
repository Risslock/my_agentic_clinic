# Phase 9 Validation — Visual Design & UI Templates

Phase 9 is mergeable when all checks below pass on `phase-9-visual-design` without `--no-verify`.

---

## 1. Type check

```
npm run typecheck
```

Exit 0. All new component files (`Card.tsx`, `Badge.tsx`, `Button.tsx`, `Table.tsx`, `FormField.tsx`, `EmptyState.tsx`, `Icons.tsx`) must compile under `strict: true`. Refactored page files must compile without type errors. No `any` types in icon SVG definitions.

---

## 2. Automated tests

```
npm test
```

All tests pass. New tests must cover:

| Test | Assertion |
|---|---|
| `Card` renders title | Output contains the title text |
| `Card` renders children | Output contains child text/elements |
| `Card` applies variant class | Output contains a class matching the variant |
| `Badge` renders text | Output contains the badge text |
| `Badge` applies variant class | Output contains a class matching the variant |
| `Button` renders as `<button>` | Output contains `<button>` when `href` is absent |
| `Button` renders as `<a>` | Output contains `<a>` when `href` is provided |
| `Button` applies variant class | Output contains a class matching the variant |
| `Table` renders column headers | Output contains each column name in `<th>` |
| `Table` renders row data | Output contains each row cell value |
| `Table` renders empty state fallback | Output contains empty-state message when rows empty |
| `FormField` renders label and input | Output contains `<label>` and `<input>` |
| `FormField` renders error | Output contains error text when `error` prop set |
| `EmptyState` renders icon | Output contains an `<svg>` element |
| `EmptyState` renders heading and description | Output contains heading and description text |
| `Header` renders nav icons | Output contains SVG icon elements in the nav |

All Phase 1–8 tests must still pass — no regressions.

---

## 3. Manual verification

With `npm run seed` run once and `npm run dev` running:

**Step 1 — Theme and branding**

Open `localhost:3000` in a browser:
- [ ] Page loads with a distinct colour palette (not Pico defaults)
- [ ] Brand text "AgentClinic" is styled with the theme font/colour
- [ ] Browser tab shows a favicon
- [ ] All pages share a consistent colour scheme

**Step 2 — Icons**

Navigate to each page:
- [ ] `/` — page icon or brand icon visible
- [ ] `/agents` — agent icon next to each agent name
- [ ] `/agents/:id` — status icon/badge for agent state
- [ ] `/ailments` — ailment icon next to each ailment
- [ ] `/therapies` — therapy icon
- [ ] `/appointments` — calendar icon
- [ ] `/dashboard` — dashboard summary cards have icons
- [ ] `/visits/:id` — each section has a heading icon

**Step 3 — Card-based templates**

- [ ] Every page uses Card components to visually group content sections
- [ ] Cards have consistent borders, background, and padding
- [ ] Dashboard summary cards are visually distinct from content cards
- [ ] Detail pages (agent, ailment, visit) group each info section in its own Card

**Step 4 — Badges**

- [ ] Agent status values (active, idle, error) render as coloured Badges
- [ ] Visit severity values (low, medium, high, critical) render as coloured Badges
- [ ] Appointment status values render as Badges

**Step 5 — Enhanced states**

- [ ] Agent detail "Ailments" section with no data shows a styled EmptyState (icon + message)
- [ ] Agent detail "Visit History" with no visits shows EmptyState
- [ ] Therapies page with no therapies shows EmptyState
- [ ] Visit detail "Pending triage" shows a skeleton or badge styled placeholder
- [ ] Form validation errors show with error icon and red Card

**Step 6 — Responsive layout**

At 320 px viewport width:
- [ ] Header nav collapses to a hamburger menu
- [ ] Tapping hamburger toggles nav links
- [ ] No horizontal overflow on any page
- [ ] Tables scroll within their wrapper (no page-level overflow)

At 640 px viewport width:
- [ ] Nav links are fully visible (no hamburger)
- [ ] Cards stack in a single column

At 1024 px viewport width:
- [ ] Dashboard cards form a multi-column grid
- [ ] Content is centred with comfortable whitespace

**Step 7 — Keyboard navigation**

- [ ] Tab through every interactive element — all links and buttons reachable
- [ ] Focused elements have a visible focus ring or outline
- [ ] Hamburger toggle reachable via keyboard

---

## 4. Merge criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm test` — all tests green including new Phase 9 tests
- [ ] All 10 pages load with Card-based layout and icons
- [ ] Theme is visibly different from Pico defaults
- [ ] Badges render for status and severity values across the app
- [ ] EmptyState renders on pages/views with no data
- [ ] Nav collapses to hamburger at 320 px and toggles correctly
- [ ] No horizontal overflow on any page at 320 px viewport
- [ ] Keyboard navigation works across all interactive elements
