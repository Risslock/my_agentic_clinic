import { serve } from "@hono/node-server";
import { app } from "./app";
import { runMigrations } from "./db/migrate";

if (!process.env.AGENTCLINIC_API_KEY) {
  console.error(
    "ERROR: AGENTCLINIC_API_KEY is not set. Set this environment variable before starting the server."
  );
  process.exit(1);
}

runMigrations();

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});
