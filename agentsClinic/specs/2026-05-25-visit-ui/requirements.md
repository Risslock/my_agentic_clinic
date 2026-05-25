# Phase 8 Requirements — Visit UI

## Scope

- Visit history table on `/agents/:id` — shows each visit's date, status, severity, and a link to the visit detail page; ordered newest first
- `/visits/:id` detail page — four sections: submitted symptoms, triage output (severity + rationale), diagnosis (ailment names), and prescription (therapy cards with instructions, ordered by priority)

## Out of Scope

- Visits table or visit count card on `/dashboard` (deferred to a later phase)
- Inline triage/diagnose/prescribe trigger from the browser — the clinical pipeline remains API-only
- Editing visit fields or changing visit status from the UI
- Follow-up outcome recording (post-Phase 8)
- Pagination of visit history (single agent's visit list is small enough for MVP)

## Decisions

### No new migrations

The `visits` table already contains every column needed: `id`, `agent_id`, `symptoms`, `triage_output`, `severity`, `diagnosis_ailment_ids`, `prescription`, `status`, `created_at`. This phase is read-only rendering on top of the existing schema.

### `/visits/:id` page structure

Four sections rendered in clinical order:

1. **Submitted Symptoms** — `visit.symptoms` as a `<blockquote>` or `<p>` in a `<section>`
2. **Triage** — parsed from `visit.triage_output` JSON (`{ severity, candidate_ailment_ids, rationale }`). Severity rendered as a `<mark>` element with the value capitalised. Rationale as a paragraph. If `triage_output` is null (visit status is `open`), show a "Pending triage" note.
3. **Diagnosis** — ailment names resolved from `visit.diagnosis_ailment_ids` (a JSON array of IDs) via a DB JOIN. If null, show "Pending diagnosis."
4. **Prescription** — parsed from `visit.prescription` JSON (`{ prescribed_therapies: [{ therapy_id, therapy_name, instructions, priority }], rationale }`). Therapies rendered as an ordered list sorted by `priority` ascending; each entry shows name and instructions. Overall rationale as a `<blockquote>`. If null, show "Pending prescription."

### Visit history table on agent detail

Appended after the existing booking form section on `/agents/:id`. Columns: Date (ISO string formatted to locale), Status, Severity (or "—" if not yet triaged), and a "View" link to `/visits/:id`. Empty state: "No visits on record."

Visits are fetched by a new `getVisitsByAgent(agentId)` helper returning rows ordered by `created_at DESC`.

### JSON fields parsed at render time

`triage_output` and `prescription` are stored as JSON strings. They are `JSON.parse()`d inside the route handler before being passed as typed props to the component. The component receives structured types, not raw strings. If parsing fails for any reason, the section falls back to the "pending" placeholder.

### Routing

`GET /visits/:id` — new route in `src/app.tsx`. Returns 404 if the visit ID is unknown. Read-only; no `POST /visits` UI route is added in this phase.

## Context

The LLM triage pipeline (Phase 6 LLM work) is fully functional over the API but completely invisible to staff. A clinic operator today has no way to open a browser and see what was diagnosed or prescribed for a given agent. This phase closes that gap: once merged, the full clinical record — from symptom intake to prescription — is readable on a single page. It also sets up Phase 9's follow-up feature by establishing `/visits/:id` as the canonical visit page where an outcome form can later be appended.
