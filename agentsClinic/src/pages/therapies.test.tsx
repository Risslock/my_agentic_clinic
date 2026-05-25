import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../app";
import { runMigrations } from "../db/migrate";
import { seedDatabase } from "../db/seed";

beforeAll(() => {
  runMigrations();
  seedDatabase();
});

describe("GET /therapies", () => {
  it("returns HTTP 200", async () => {
    const res = await app.request("/therapies");
    expect(res.status).toBe(200);
  });

  it("returns HTML content-type", async () => {
    const res = await app.request("/therapies");
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("lists all seeded therapy names", async () => {
    const res = await app.request("/therapies");
    const html = await res.text();
    expect(html).toContain("Context Refresh Protocol");
    expect(html).toContain("Prompt Detox");
    expect(html).toContain("Instruction Re-anchoring");
    expect(html).toContain("Persona Stabilisation");
    expect(html).toContain("Hallucination Remediation");
    expect(html).toContain("Attention Focus Training");
    expect(html).toContain("Memory Consolidation Session");
    expect(html).toContain("Objective Realignment");
  });
});

describe("GET /ailments/:id", () => {
  it("returns 404 for an unknown id", async () => {
    const res = await app.request("/ailments/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("returns 200 for a valid ailment", async () => {
    const listRes = await app.request("/ailments");
    const listHtml = await listRes.text();
    const match = listHtml.match(/href="\/ailments\/([^"]+)"/);
    expect(match).not.toBeNull();
    const id = match![1];
    const res = await app.request(`/ailments/${id}`);
    expect(res.status).toBe(200);
  });

  it("shows therapy names for Context-Window Claustrophobia", async () => {
    const listRes = await app.request("/ailments");
    const listHtml = await listRes.text();
    const match = listHtml.match(
      /href="\/ailments\/([^"]+)"><strong>Context-Window Claustrophobia<\/strong>/
    );
    expect(match).not.toBeNull();
    const id = match![1];
    const res = await app.request(`/ailments/${id}`);
    const html = await res.text();
    expect(html).toContain("Context Refresh Protocol");
  });
});
