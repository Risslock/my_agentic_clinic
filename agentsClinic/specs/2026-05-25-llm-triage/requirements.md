# LLM Triage Requirements — AI-Powered Triage, Diagnosis & Prescription

## Scope

- `/api/visits` POST endpoint — creates a new visit record for an agent
- `/api/visits/:id/triage` POST — LLM call 1: classifies symptom free-text into severity + candidate ailments
- `/api/visits/:id/diagnose` POST — confirms diagnosis from triage output against the ailments catalog
- `/api/visits/:id/prescribe` POST — LLM call 2: selects therapies and returns machine-readable prescription
- `visits` table to persist visit records (agent, symptoms, triage output, diagnosis, prescription, status)
- Bearer token auth on all `/api/*` routes via `AGENTCLINIC_API_KEY` env var
- `/api/health` GET — unauthenticated liveness check

## Out of Scope

- Agent self-registration via API (agents are seeded via `npm run seed`)
- Outcome/follow-up recording (post-MVP)
- Multi-tenant auth (post-MVP)
- Streaming responses (post-MVP; use standard JSON responses for MVP)

## Decisions

### Two LLM calls per visit (per tech-stack decision)

**Call 1 (triage + diagnosis):** Given the agent's `presenting_complaints` plus the submitted symptom text, return a JSON object: `{ severity: "low"|"medium"|"high"|"critical", candidate_ailment_ids: string[], rationale: string }`. The model is given the full ailments catalog as context.

**Call 2 (prescription):** Given the confirmed diagnosis (selected ailment IDs), fetch matching therapies from the DB and ask the model to rank them and produce a structured prescription: `{ prescribed_therapies: Array<{ therapy_id, therapy_name, instructions, priority: number }>, rationale: string }`. Deterministic ranking logic (by `priority`) runs between call 1 and call 2.

Separating the calls keeps each prompt focused and lets the server validate the triage output against known IDs before proceeding to prescription.

### Visits schema

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (UUID v4) | Primary key |
| `agent_id` | TEXT NOT NULL | FK → agents.id |
| `symptoms` | TEXT NOT NULL | Free-text submitted at visit creation |
| `severity` | TEXT | Populated after triage |
| `diagnosis_ailment_ids` | TEXT | JSON array of ailment IDs, populated after diagnosis |
| `prescription` | TEXT | JSON prescription object, populated after prescribe |
| `status` | TEXT NOT NULL | `open`, `triaged`, `diagnosed`, `prescribed` |
| `created_at` | TEXT NOT NULL | ISO 8601 timestamp |

### API auth

All `/api/*` routes except `/api/health` require `Authorization: Bearer <AGENTCLINIC_API_KEY>`. Return 401 on missing/invalid token. The key is read from `process.env.AGENTCLINIC_API_KEY` — no default; server fails to start if unset.

### Anthropic SDK usage

Use `@anthropic-ai/sdk`. Model: `claude-haiku-4-5-20251001` for triage (speed, cost), `claude-sonnet-4-6` for prescription (quality). Both calls use prompt caching on the static ailments/therapies catalog context to reduce latency on repeat calls.

### Migration file

`src/db/migrations/005_visits.sql`

### Error handling

- If the LLM returns malformed JSON, return 422 with `{ error: "triage_parse_failed" }` and log the raw response.
- If the agent ID is unknown, return 404.
- If `AGENTCLINIC_API_KEY` is unset at startup, throw immediately so the misconfiguration is visible.

## Context

This phase is what makes AgentClinic an *agentic* clinic. Without it, the app is a read-only catalog. With it, an AI orchestrator can POST symptoms, receive a structured prescription, and act on the `instructions` field from the therapies catalog.

The two-call pattern is load-bearing: it ensures the diagnosis step can be validated against real DB IDs before committing to a prescription. Do not collapse into a single call without revisiting this invariant.
