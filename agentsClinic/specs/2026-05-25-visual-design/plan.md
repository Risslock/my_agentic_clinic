# Phase 9 Plan — Visual Design & UI Templates

Groups are ordered to minimise rework: theme tokens first, then reusable components, then page refactors, then polish, then tests.

---

## Group 1 — Design tokens & base theme

1. Create `static/theme.css` with CSS custom properties for brand colours (primary, secondary, accent), font stack, border radii, spacing scale, and shadow values
2. Link `theme.css` in `src/components/Layout.tsx` after `pico.min.css` and before `style.css`
3. Adopt or craft a Pico-compatible colour theme that overrides `--pico-primary`, `--pico-color`, `--pico-background`, etc. using the new custom properties
4. Add a logo/favicon — an inline SVG `<link rel="icon">` or a static file placed in `static/`
5. Update `style.css` to reference theme tokens where hardcoded values exist

## Group 2 — SVG icon components

6. Create `src/components/Icons.tsx` — define `IconProps { name: string; size?: number; class?: string }` and a set of inline SVG icon components:
   - IconAgent, IconAilment, IconTherapy, IconAppointment, IconDashboard
   - IconSeverityLow, IconSeverityMedium, IconSeverityHigh, IconSeverityCritical
   - IconArrowLeft, IconMenu, IconX, IconCheck, IconAlertTriangle, IconSearch, IconPlus, IconCalendar
7. Each icon renders a `<svg>` element with `width`, `height`, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, and `stroke-width="2"`
8. Export a utility `icon(name)` that maps string names to icon components for dynamic usage

## Group 3 — Reusable UI components

9. Create `src/components/Card.tsx` — an `<article>`-based card wrapper with optional `title`, `icon`, and `variant` (default / primary / danger) props; render children inside the card body
10. Create `src/components/Badge.tsx` — renders a `<span>` with class `badge` and a `variant` prop (info / success / warning / danger) mapped to colour classes; supports an optional `icon` slot
11. Create `src/components/Button.tsx` — renders a `<a>` or `<button>` element with variant (primary / secondary / danger / ghost), size (sm / md / lg), and optional icon props
12. Create `src/components/Table.tsx` — renders a `<table>` inside a scrollable `<div>` wrapper, accepting `columns` and `rows` props or a children-based API
13. Create `src/components/FormField.tsx` — wraps a `<label>`, input element, and optional error `<small>` into a consistent field component
14. Create `src/components/EmptyState.tsx` — renders an icon, heading, description paragraph, and optional action button for empty-list scenarios

## Group 4 — Page refactoring

15. Refactor `Home.tsx` — use Card for the hero content, add icon, update layout to be more inviting
16. Refactor `Header.tsx` — add icons next to each nav link, add hamburger toggle for small viewports
17. Refactor `AgentsList.tsx` — use Card-wrapped Table, add status Badge for each agent, add EmptyState when no agents
18. Refactor `AgentDetail.tsx` — use Card sections for ailments list, booking form, and visit history; use Badge for status/severity; use FormField for inputs
19. Refactor `AilmentsList.tsx` — use Card for each ailment, add icon, use Badge for metadata
20. Refactor `AilmentDetail.tsx` — use Card sections, Badge-styled therapy links
21. Refactor `TherapiesList.tsx` — use Card for each therapy, add icon, show instructions in a consistent format
22. Refactor `VisitDetail.tsx` — use Card for each section (Symptoms, Triage, Diagnosis, Prescription), use Badge for severity, use icons for section headings
23. Refactor `AppointmentsList.tsx` — use Card-wrapped Table, status Badges
24. Refactor `AppointmentConfirmation.tsx` — use Card with confirm icon, consistent field layout
25. Refactor `Dashboard.tsx` — update summary cards to use Card component with icons, update tables with Badge for status columns

## Group 5 — Enhanced visual states

26. Create `static/theme.css` shimmer/skeleton keyframes for loading states
27. Add skeleton placeholder markup to pages that fetch async data (visit detail pending sections, dashboard counts)
28. Update EmptyState usage across all pages — consistent icon + heading + description + optional action link
29. Audit all error states — use Card with `variant="danger"` and AlertTriangle icon for error messages

## Group 6 — Responsive refinement

30. Add hamburger menu toggle in Header — a `<button>` with IconMenu that toggles a `data-open` attribute on the `<nav>`, styled with CSS only (no JS)
31. Add CSS for mobile nav: hide `<ul>` by default on <640px, show when `[data-open="true"]`
32. Make all tables responsive via scrollable wrapper (existing pattern in `style.css`)
33. Ensure touch targets are at least 44×44 px on all interactive elements
34. Test and fix any layout breakage at 320 px, 640 px, and 1024 px viewport widths

## Group 7 — Tests

35. Add component render tests for each new component in `src/components/`:
    - `Card.test.tsx` — renders title, icon, children, variant classes
    - `Badge.test.tsx` — renders text, variant class, optional icon
    - `Button.test.tsx` — renders as `<a>` or `<button>` based on props, variant class, icon
    - `Table.test.tsx` — renders columns, rows, empty state fallback
    - `FormField.test.tsx` — renders label, input, error message
    - `EmptyState.test.tsx` — renders icon, heading, description, action link
36. Update existing page tests (`agents.test.tsx`, `ailments.test.tsx`, etc.) where HTML output changed (new class names, icons, card wrappers)
37. Update `Header.test.tsx` — assert nav icons exist
38. Add an integration test that checks each page returns 200 and contains at least one Card or Badge element

## Group 8 — Verify

39. Run `npm run typecheck` — exit 0
40. Run `npm test` — all tests pass (new Phase 9 tests + all prior tests)
41. Walk through every page in the browser — confirm icons render, cards have correct borders/backgrounds, badges show proper colours
42. Resize to 320 px — confirm hamburger nav works, no horizontal overflow
43. Check keyboard navigation — all interactive elements reachable via Tab, focus styles visible
44. Open an agent with no ailments — confirm EmptyState renders instead of bare "No ailments on record." text
