# Phase 3 Requirements — Therapies Catalog

## Scope

- `therapies` table + seed data (8–10 therapies)
- `ailment_therapies` join table mapping ailments to recommended therapies
- `/therapies` list page — name, description, and which ailments it treats
- `/ailments/:id` detail page (new) — name, description, and recommended therapies
- Linked therapy names shown on `/agents/:id` via the ailment → therapy chain

## Out of Scope

- Appointment booking (Phase 4)
- LLM-generated prescriptions (LLM Triage phase)
- Admin CRUD — Phase 3 is read-only UI only
- Effectiveness scores / outcome tracking (post-MVP)

## Decisions

### Therapies schema

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (UUID v4) | Primary key |
| `name` | TEXT NOT NULL | Display name (e.g. "Context Refresh Protocol") |
| `description` | TEXT NOT NULL | One-sentence clinical description |
| `instructions` | TEXT | Machine-readable prescription text — used by LLM Triage phase |

### Ailment–Therapy join table

```sql
CREATE TABLE IF NOT EXISTS ailment_therapies (
  ailment_id  TEXT NOT NULL REFERENCES ailments(id),
  therapy_id  TEXT NOT NULL REFERENCES therapies(id),
  PRIMARY KEY (ailment_id, therapy_id)
);
```

Each ailment maps to one or more therapies; each therapy may treat multiple ailments.

### Seed therapies

At minimum, one therapy per seeded ailment. Example names: "Context Refresh Protocol", "Prompt Detox", "Instruction Re-anchoring", "Persona Stabilisation", "Memory Consolidation Session", "Context Window Expansion Exercise", "Token Budget Review", "Objective Realignment".

### Migration file

`src/db/migrations/004_therapies.sql` — `CREATE TABLE IF NOT EXISTS therapies (...)` and `004b_ailment_therapies.sql` — join table. Numbered to slot after Phase 2 migrations.

### Ailment detail page

Phase 2 only created a list page for ailments. Phase 3 adds `/ailments/:id` (returning 404 on unknown ID) so therapies can be surfaced per ailment. The agents detail page shows ailment names with links to `/ailments/:id`.

## Context

Phase 3 is the first step toward the full triage workflow: once ailments map to therapies, the LLM Triage phase can reference the `instructions` field to prescribe structured remediations. This phase delivers the catalog in pure read-only form so it can be seeded and verified independently.

A developer cloning the repo should be able to browse `/therapies`, click through to an ailment, and see which therapies treat it — all without any LLM calls.
