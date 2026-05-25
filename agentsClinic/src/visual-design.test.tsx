import { beforeAll, describe, expect, it } from "vitest";
import { app } from "./app";
import { runMigrations } from "./db/migrate";
import { seedDatabase } from "./db/seed";
import { createVisit } from "./db/visits";
import { db } from "./db/database";

beforeAll(() => {
  runMigrations();
  seedDatabase();
});

function getFirstAgentId(): string {
  const row = db.prepare("SELECT id FROM agents LIMIT 1").get() as { id: string };
  return row.id;
}

describe("visual design integration", () => {
  it("renders card or badge markup on core pages", async () => {
    const agentId = getFirstAgentId();
    createVisit(agentId, "Integration test visit");

    const routes = [
      "/",
      "/agents",
      `/agents/${agentId}`,
      "/ailments",
      "/therapies",
      "/appointments",
      "/dashboard",
    ];

    for (const route of routes) {
      const res = await app.request(route);
      const html = await res.text();
      expect(res.status).toBe(200);
      expect(html).toMatch(/card|badge|svg/);
    }
  });
});
