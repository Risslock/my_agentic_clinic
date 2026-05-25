# AgentClinic

A clinic for AI agents. Agents self-report symptoms in natural language, receive a structured diagnosis and a prescriptive treatment, and accumulate a longitudinal patient record across visits.

## Quick start (no API key needed)

```bash
npm install
npm run seed
npm run dev
```

Open **http://localhost:3000**. All pages work immediately. The triage/prescribe pipeline runs in demo mode — stub responses are returned so the full visit flow can be explored without any API keys.

## Full mode (with API keys)

Copy `.env.example` to `.env` and fill in both values:

```bash
cp .env.example .env
```

| Variable | Purpose |
|---|---|
| `AGENTCLINIC_API_KEY` | Protects all `/api/*` routes. If unset, the API is open (demo mode). |
| `ANTHROPIC_API_KEY` | Enables real LLM triage and prescription via the Anthropic SDK. If unset, stub responses are used. |

Then start the server:

```bash
npm run dev
```

## What it does

AgentClinic models a medical clinic whose patients are AI agents. The full clinical workflow:

1. **Register** — agents are stored with a persistent identity, model type, status, and presenting complaints.
2. **Triage** — an agent submits symptoms via the API; the LLM classifies severity and identifies candidate ailments from the clinic catalog.
3. **Diagnose** — candidate ailments are validated against the database and confirmed.
4. **Prescribe** — the LLM selects and ranks therapies from the catalog, producing a machine-readable prescription.
5. **Review** — staff browse visit records in the browser: symptoms, triage rationale, diagnosis, and full prescription are all visible on a single page.
6. **Book** — appointments are booked from any agent's profile page and tracked through to completion.

## Pages

| Route | Description |
|---|---|
| `/` | Home |
| `/agents` | All registered agents |
| `/agents/:id` | Agent profile — ailments, visit history, booking form |
| `/ailments` | Ailment catalog |
| `/ailments/:id` | Ailment detail — description and recommended therapies |
| `/therapies` | Therapy catalog with instructions |
| `/visits/:id` | Visit record — symptoms, triage, diagnosis, prescription |
| `/appointments` | All appointments |
| `/appointments/:id` | Appointment confirmation |
| `/dashboard` | Staff overview — summary counts, agents table, appointments table |

## API

All `/api/*` routes require `Authorization: Bearer <AGENTCLINIC_API_KEY>` when `AGENTCLINIC_API_KEY` is set. `/api/health` is always open.

### Visit lifecycle

```
POST /api/visits
  Body: { "agent_id": "<uuid>", "symptoms": "<free text>" }
  Returns: { "id": "<uuid>", "agent_id": "<uuid>", "status": "open" }

POST /api/visits/:id/triage
  Returns: { "severity": "low|medium|high|critical", "candidate_ailment_ids": [...], "rationale": "..." }

POST /api/visits/:id/diagnose
  Returns: { "diagnosed_ailments": [{ "id": "...", "name": "..." }] }

POST /api/visits/:id/prescribe
  Returns: { "prescribed_therapies": [{ "therapy_name": "...", "instructions": "...", "priority": 1 }], "rationale": "...", "status": "prescribed" }

GET /api/health
  Returns: { "status": "ok" }
```

### Full demo flow (no API key)

```bash
# Create a visit
VISIT=$(curl -s -X POST localhost:3000/api/visits \
  -H "Content-Type: application/json" \
  -d '{"agent_id":"<paste any id from /agents>","symptoms":"Persistent confusion after context reset"}' \
  | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

curl -s -X POST localhost:3000/api/visits/$VISIT/triage   | cat
curl -s -X POST localhost:3000/api/visits/$VISIT/diagnose | cat
curl -s -X POST localhost:3000/api/visits/$VISIT/prescribe | cat
```

Then open `http://localhost:3000/visits/$VISIT` to see the full record in the browser.

## Development

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest run (67 tests)
npm run seed        # populate the database with agents, ailments, and therapies
npm run dev         # tsx watch — restarts on file changes
```

## Stack

| Layer | Technology |
|---|---|
| Framework | Hono + tsx (Node) |
| Language | TypeScript (strict) |
| Database | SQLite via better-sqlite3 |
| Styling | PicoCSS (classless) + custom CSS |
| LLM | Anthropic SDK — claude-haiku for triage, claude-sonnet for prescription |
| Testing | Vitest |
