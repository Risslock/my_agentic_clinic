import { serve } from "@hono/node-server";
import { app } from "./app";
import { runMigrations } from "./db/migrate";

if (!process.env.AGENTCLINIC_API_KEY) {
  console.warn(
    "WARN: AGENTCLINIC_API_KEY is not set. Running in demo mode — /api/* routes require no auth token."
  );
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    "WARN: ANTHROPIC_API_KEY is not set. LLM triage and prescription will return stub responses."
  );
}

runMigrations();

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});
