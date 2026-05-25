import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../app";
import { runMigrations } from "../db/migrate";
import { seedDatabase } from "../db/seed";
import { createVisit } from "../db/visits";
import { db } from "../db/database";

beforeAll(() => {
  runMigrations();
  seedDatabase();
});

function getFirstAgentId(): string {
  const row = db.prepare("SELECT id FROM agents LIMIT 1").get() as { id: string };
  return row.id;
}

describe("GET /visits/:id", () => {
  it("returns 404 for an unknown id", async () => {
    const res = await app.request("/visits/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("returns 200 for a valid open visit", async () => {
    const agentId = getFirstAgentId();
    const visit = createVisit(agentId, "Test symptom text for open visit");
    const res = await app.request(`/visits/${visit.id}`);
    expect(res.status).toBe(200);
  });

  it("shows the submitted symptoms on an open visit", async () => {
    const agentId = getFirstAgentId();
    const visit = createVisit(agentId, "Unique symptom: context boundary confusion");
    const res = await app.request(`/visits/${visit.id}`);
    const html = await res.text();
    expect(html).toContain("Unique symptom: context boundary confusion");
  });

  it("shows 'Pending triage' when visit has not been triaged", async () => {
    const agentId = getFirstAgentId();
    const visit = createVisit(agentId, "Another symptom");
    const res = await app.request(`/visits/${visit.id}`);
    const html = await res.text();
    expect(html).toContain("Pending triage");
  });

  it("shows 'Pending diagnosis' when visit has not been diagnosed", async () => {
    const agentId = getFirstAgentId();
    const visit = createVisit(agentId, "Yet another symptom");
    const res = await app.request(`/visits/${visit.id}`);
    const html = await res.text();
    expect(html).toContain("Pending diagnosis");
  });

  it("shows 'Pending prescription' when visit has not been prescribed", async () => {
    const agentId = getFirstAgentId();
    const visit = createVisit(agentId, "Symptom without prescription");
    const res = await app.request(`/visits/${visit.id}`);
    const html = await res.text();
    expect(html).toContain("Pending prescription");
  });
});

describe("GET /agents/:id with visit history", () => {
  it("shows 'Visit History' section on agent detail page", async () => {
    const agentId = getFirstAgentId();
    const res = await app.request(`/agents/${agentId}`);
    const html = await res.text();
    expect(html).toContain("Visit History");
  });

  it("shows visit row after creating a visit for that agent", async () => {
    const agentId = getFirstAgentId();
    createVisit(agentId, "Visit for history table test");
    const res = await app.request(`/agents/${agentId}`);
    const html = await res.text();
    expect(html).toContain(`/visits/`);
  });
});
