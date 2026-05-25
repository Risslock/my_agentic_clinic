# Phase 9 Requirements — Visual Design & UI Templates

## Scope

- Custom theme and branding — color palette, typography, logo/favicon, design tokens via CSS custom properties
- Reusable UI component library — shared `<Card>`, `<Badge>`, `<Button>`, `<Table>`, `<FormField>`, `<EmptyState>` components
- SVG icon system with status/severity indicators for agents, ailments, and visits
- Consistent card-based page templates for list, detail, and dashboard views
- Enhanced visual states — empty states, error states, loading/skeleton patterns
- Responsive refinement — hamburger nav, touch-friendly tables, custom breakpoints

## Out of Scope

- Any database schema changes (all required data already exists)
- New API routes or backend behaviour changes
- Client-side JavaScript framework or interactivity beyond HTML/CSS
- Animation libraries or CSS-in-JS solutions
- User-uploadable images or dynamic asset management
- Third-party design system migration (e.g. Material UI, Bootstrap classes)

## Decisions

### Public template as base theme
Pico CSS includes a community theme catalogue (picocss.com/themes). The project will adopt a Pico-compatible theme as the foundation — either an existing community theme or a hand-rolled set of CSS custom properties that override Pico defaults. No separate CSS framework or design tool is introduced. Theme tokens (colours, fonts, spacing, radii) are declared in a single `static/theme.css` file.

### Inline SVG icons from a public library
Icons are sourced from Lucide (MIT license, ~1000 icons). Each icon is hand-picked and inlined as a Hono JSX `svg` element inside `src/components/Icons.tsx`. Icons render at `1em` width and inherit the current text colour via `currentColor`. This avoids any network requests for icon fonts or sprite sheets. Target icons: Agent, Ailment, Therapy, Appointment, Dashboard, Calendar, Severity (Low/Medium/High/Critical), ArrowLeft, Menu, X, Check, AlertTriangle, Search, Plus.

### Component conventions
Every new UI component lives in `src/components/`, follows the existing `FC` / `PropsWithChildren` pattern from `hono/jsx`, and is tested in isolation via the existing `render()` test utility. Components accept data via props only — no internal state, no context, no hooks. This keeps them pure render functions that produce HTML strings.

### No new npm dependencies
All visual work uses what's already in `package.json`. Icons are inlined SVGs — no icon package is installed. Templates are built from Hono JSX components, not a template engine.

### Page refactoring is incremental
Each page is updated one at a time to use the new components. The refactor is purely additive — existing tests should pass without changes to test logic (only updated HTML assertions where markup changes).

## Context

Phase 6 (Polish & Accessibility) ensured the app works well semantically and at all viewport sizes, but the visual experience is still bare-bones Pico defaults — no brand identity, no icons, no visual hierarchy beyond basic HTML headings. This phase gives the app a professional appearance that makes it presentation-ready for demos, conference booths, and course students. The reusable component library also accelerates all future phases by providing ready-made UI primitives.
