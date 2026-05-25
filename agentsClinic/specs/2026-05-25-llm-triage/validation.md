# LLM Triage Validation — AI-Powered Triage, Diagnosis & Prescription

This phase is mergeable when all checks below pass. The integration tests require a real `AGENTCLINIC_API_KEY`.

---

## 1. Type check

```
npm run typecheck
```

Exit 0. LLM helper modules (`src/llm/triage.ts`, `src/llm/prescribe.ts`), DB helpers, and API route handlers must all compile under `strict: true`.

---

## 2. Automated tests

```
npm test
```

All tests pass. New tests must cover:

| Test | Assertion |
|---|---|
| `GET /api/health` | Returns 200 `{ "status": "ok" }` — no auth token required |
| `POST /api/visits` (no token) | Returns 401 |
| `POST /api/visits` (unknown agent_id) | Returns 404 |
| `POST /api/visits` (valid) | Returns 201 with `{ id, agent_id, status: "open" }` |

LLM call tests may be skipped if `AGENTCLINIC_API_KEY` is not set in the test environment (use `test.skipIf(!process.env.AGENTCLINIC_API_KEY)`).

All Phase 1–3 tests must still pass.

---

## 3. Integration verification (requires API key)

With `AGENTCLINIC_API_KEY` set, `npm run seed` run, and `npm run dev` running:

```bash
# Create a visit
VISIT=$(curl -s -X POST localhost:3000/api/visits \
  -H "Authorization: Bearer $AGENTCLINIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id":"<seeded-id>","symptoms":"Unable to follow multi-step instructions after context reset"}' \
  | jq -r '.id')

# Triage
curl -s -X POST localhost:3000/api/visits/$VISIT/triage \
  -H "Authorization: Bearer $AGENTCLINIC_API_KEY" | jq .

# Diagnose
curl -s -X POST localhost:3000/api/visits/$VISIT/diagnose \
  -H "Authorization: Bearer $AGENTCLINIC_API_KEY" | jq .

# Prescribe
curl -s -X POST localhost:3000/api/visits/$VISIT/prescribe \
  -H "Authorization: Bearer $AGENTCLINIC_API_KEY" | jq .
```

Expected: final response contains `status: "prescribed"` and `prescription.prescribed_therapies` is a non-empty array.

---

## 4. Auth guard

```bash
curl -s -X POST localhost:3000/api/visits | jq .status
# expected: 401

curl -s localhost:3000/api/health | jq .status
# expected: "ok"
```

---

## 5. Startup guard

Remove `AGENTCLINIC_API_KEY` from the environment and start the server:

```bash
node -e "delete process.env.AGENTCLINIC_API_KEY" && npm run dev
```

Server must exit with a clear error message rather than starting silently without the key.

---

## Merge criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm test` — all tests green
- [ ] Full triage → diagnose → prescribe flow returns a valid prescription JSON
- [ ] Unauthenticated `/api/visits` returns 401; `/api/health` returns 200 without token
- [ ] Server fails to start (clear error) when `AGENTCLINIC_API_KEY` is unset
