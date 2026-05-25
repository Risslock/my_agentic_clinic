# LLM Triage Plan — AI-Powered Triage, Diagnosis & Prescription

Groups are ordered so auth and DB are solid before any LLM call is attempted.

---

## Group 1 — Dependencies & Config

1. Install `@anthropic-ai/sdk`
2. Add `AGENTCLINIC_API_KEY` to a `.env.example` file (never commit `.env`)
3. Add startup guard in `src/index.tsx`: throw with a clear message if `AGENTCLINIC_API_KEY` is unset

## Group 2 — Visits DB

4. Create `src/db/migrations/005_visits.sql` — `CREATE TABLE IF NOT EXISTS visits (id, agent_id, symptoms, severity, diagnosis_ailment_ids, prescription, status, created_at)`
5. Create `src/db/visits.ts` — typed query helpers: `createVisit`, `getVisit`, `updateVisit`

## Group 3 — Auth Middleware

6. Create `src/middleware/auth.ts` — Hono middleware that validates `Authorization: Bearer <key>` against `process.env.AGENTCLINIC_API_KEY`; returns 401 on missing or invalid token
7. Apply auth middleware to all `/api/*` routes in `src/app.tsx`

## Group 4 — API Routes

8. `POST /api/visits` — creates visit row with `status = 'open'`; returns `{ id, agent_id, status }`
9. `POST /api/visits/:id/triage` — LLM call 1: sends agent's presenting complaints + submitted symptoms + full ailments catalog; parses JSON response into severity + candidate ailment IDs; updates visit row to `status = 'triaged'`; returns triage output
10. `POST /api/visits/:id/diagnose` — validates candidate ailment IDs against DB; selects confirmed ailments; updates visit to `status = 'diagnosed'`; returns confirmed ailment list (no LLM call)
11. `POST /api/visits/:id/prescribe` — fetches therapies for confirmed ailments; LLM call 2: ranks therapies and generates `instructions`; updates visit to `status = 'prescribed'`; returns prescription JSON
12. `GET /api/health` — unauthenticated; returns `{ status: "ok" }`

## Group 5 — LLM Helpers

13. Create `src/llm/triage.ts` — builds the triage prompt (system: clinic persona + ailments catalog; user: agent context + symptoms); calls `claude-haiku-4-5-20251001`; parses and validates the JSON response
14. Create `src/llm/prescribe.ts` — builds the prescription prompt (system: therapist persona + therapies list; user: confirmed ailments + agent history); calls `claude-sonnet-4-6`; parses and validates the JSON response
15. Both modules use prompt caching (`cache_control: { type: "ephemeral" }`) on the static catalog context block

## Group 6 — Tests

16. `POST /api/visits` without auth token — returns 401
17. `POST /api/visits` with valid token, unknown agent ID — returns 404
18. `POST /api/visits` with valid token, valid agent ID — returns 201 with visit ID (mocked LLM or real integration test with `AGENTCLINIC_API_KEY` set)
19. `GET /api/health` — returns 200 `{ status: "ok" }` without a token
20. Full visit flow integration test (optional, requires API key): create → triage → diagnose → prescribe; assert final `status = 'prescribed'` and prescription contains at least one therapy

## Group 7 — Verify

21. Run `npm run typecheck` — exit 0
22. Run `npm test` — all tests pass
23. With `AGENTCLINIC_API_KEY` set: `curl -X POST localhost:3000/api/visits -H "Authorization: Bearer $KEY" -d '{"agent_id":"<id>","symptoms":"..."}' -H "Content-Type: application/json"` — returns 201
24. Walk the full triage → diagnose → prescribe flow for one agent; confirm prescription JSON is returned
