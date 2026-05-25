# AgentClinic Tech Stack

## Framework: Next.js 14+ (App Router)

**Recommendation:** Next.js with the App Router.

Next.js is the most widely adopted server-side TypeScript framework and the natural fit here because AgentClinic needs two surfaces on one server:

- **API routes** (`/api/*`) — the clinic interface that agents and orchestrators call
- **Dashboard pages** (`/dashboard/*`) — the operator interface built with React Server Components

Both live in the same project, share the same types, and deploy as a single unit. No separate frontend build, no CORS setup, no cross-service wiring for the dashboard to reach the API.

## Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14+ (App Router) | Full-stack TypeScript; API routes + RSC dashboard in one server |
| Language | TypeScript | End-to-end type safety across API contracts and UI |
| Database | SQLite via `better-sqlite3` | Zero-config, file-based, sufficient for MVP scale |
| ORM | Drizzle ORM | Type-safe SQL with schema-as-code and SQLite support |
| LLM | Anthropic SDK (`@anthropic-ai/sdk`) | Powers triage and diagnosis |
| Styling | Tailwind CSS | Utility-first; built into Next.js ecosystem |
| Charts | Recharts | React-native charts for the analytics dashboard |
| IDs | `uuid` | UUID v4 for patient and visit IDs |
| Real-time | Server-Sent Events (native `ReadableStream`) | Live dashboard updates without WebSocket infrastructure |

## Key decisions

**SQLite over PostgreSQL:** File-based, zero infrastructure for MVP. Drizzle makes migration to PostgreSQL straightforward post-MVP if scale demands it.

**Single API key auth (MVP):** `AGENTCLINIC_API_KEY` env var. All `/api/*` routes validate a Bearer token. Dashboard is unprotected — assumes private deployment. Multi-tenant auth is post-MVP.

**Two LLM calls per visit:** One for triage + diagnosis, one for prescription + rationale. Separating them keeps each prompt focused and lets deterministic treatment-ranking logic run between the two calls.
