import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../app";
import { runMigrations } from "../db/migrate";
import { seedDatabase } from "../db/seed";
import { db } from "../db/database";

const TEST_KEY = "test-api-key-12345";

beforeAll(() => {
  process.env.AGENTCLINIC_API_KEY = TEST_KEY;
  runMigrations();
  seedDatabase();
});

function getFirstAgentId(): string {
  const row = db.prepare("SELECT id FROM agents LIMIT 1").get() as { id: string };
  return row.id;
}

describe("GET /api/health", () => {
  it("returns 200 without auth token", async () => {
    const res = await app.request("/api/health");
    expect(res.status).toBe(200);
  });

  it("returns { status: ok }", async () => {
    const res = await app.request("/api/health");
    const body = await res.json();
    expect(body).toEqual({ status: "ok" });
  });
});

describe("POST /api/visits", () => {
  it("returns 401 without auth token", async () => {
    const res = await app.request("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: "x", symptoms: "test" }),
    });
    expect(res.status).toBe(401);
  });

  it("returns 404 for unknown agent_id", async () => {
    const res = await app.request("/api/visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_KEY}`,
      },
      body: JSON.stringify({ agent_id: "does-not-exist", symptoms: "test" }),
    });
    expect(res.status).toBe(404);
  });

  it("returns 201 with visit id for valid agent", async () => {
    const agentId = getFirstAgentId();
    const res = await app.request("/api/visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_KEY}`,
      },
      body: JSON.stringify({ agent_id: agentId, symptoms: "Persistent context confusion" }),
    });
    expect(res.status).toBe(201);
    const body = await res.json() as { id: string; agent_id: string; status: string };
    expect(body.agent_id).toBe(agentId);
    expect(body.status).toBe("open");
    expect(typeof body.id).toBe("string");
  });
});
