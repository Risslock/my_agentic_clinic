# Phase 8 Validation — Visit UI

Phase 8 is mergeable when all checks below pass on `phase-8-visit-ui` without `--no-verify`.

---

## 1. Type check

```
npm run typecheck
```

Exit 0. `VisitDetail.tsx`, the updated `AgentDetail.tsx`, and the new DB helper signatures must all compile under `strict: true`. JSON `parse` calls must be typed — no implicit `any`.

---

## 2. Automated tests

```
npm test
```

All tests pass. New tests must cover:

| Test | Assertion |
|---|---|
| `GET /visits/does-not-exist` | Returns 404 |
| `GET /visits/:id` (open visit) | Returns 200; body contains the submitted symptoms text |
| `GET /visits/:id` (open visit) | Body contains "Pending triage" |
| `GET /agents/:id` (any seeded agent) | Returns 200; body contains "Visit History" |

All Phase 1–7 tests must still pass — no regressions.

---

## 3. Manual verification

With `npm run seed` run once, `AGENTCLINIC_API_KEY` set, and `npm run dev` running:

**Step 1 — Create an open visit**

```bash
AGENT_ID=$(curl -s localhost:3000/agents | grep -oP 'href="/agents/\K[^"]+' | head -1)

VISIT_ID=$(curl -s -X POST localhost:3000/api/visits \
  -H "Authorization: Bearer $AGENTCLINIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"agent_id\":\"$AGENT_ID\",\"symptoms\":\"Persistent confusion after long context chains\"}" \
  | grep -oP '"id":"\K[^"]+')

echo "Visit: $VISIT_ID"
```

Open `localhost:3000/visits/$VISIT_ID` in a browser:
- [ ] "Submitted Symptoms" section shows the symptom text
- [ ] "Triage" section shows "Pending triage"
- [ ] "Diagnosis" section shows "Pending diagnosis"
- [ ] "Prescription" section shows "Pending prescription"
- [ ] "← Back to agent" link is present and works

**Step 2 — Run the full pipeline**

```bash
curl -s -X POST localhost:3000/api/visits/$VISIT_ID/triage \
  -H "Authorization: Bearer $AGENTCLINIC_API_KEY" | jq .severity

curl -s -X POST localhost:3000/api/visits/$VISIT_ID/diagnose \
  -H "Authorization: Bearer $AGENTCLINIC_API_KEY" | jq .

curl -s -X POST localhost:3000/api/visits/$VISIT_ID/prescribe \
  -H "Authorization: Bearer $AGENTCLINIC_API_KEY" | jq .prescribed_therapies[0].therapy_name
```

Reload `localhost:3000/visits/$VISIT_ID`:
- [ ] "Triage" section shows a severity badge (low/medium/high/critical) and rationale text
- [ ] "Diagnosis" section shows at least one ailment name
- [ ] "Prescription" section shows at least one therapy name with instructions

**Step 3 — Visit history on agent detail**

Open `localhost:3000/agents/$AGENT_ID`:
- [ ] "Visit History" section is visible below the booking form
- [ ] The visit row shows the correct date, status (`prescribed`), and severity
- [ ] Clicking "View" navigates to `/visits/$VISIT_ID`

**Step 4 — Responsive check**

At 320 px viewport width:
- [ ] `/visits/:id` has no horizontal overflow
- [ ] `/agents/:id` visit history table scrolls within its wrapper (no page-level overflow)

---

## 4. Merge criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm test` — all tests green including new Phase 8 tests
- [ ] Open visit shows four "Pending …" placeholders in browser
- [ ] Prescribed visit shows real triage, diagnosis, and prescription data
- [ ] Agent detail page shows Visit History table with correct rows
- [ ] No horizontal overflow at 320 px on either page
