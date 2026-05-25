import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../app";
import { runMigrations } from "../db/migrate";
import { seedDatabase } from "../db/seed";

beforeAll(() => {
  runMigrations();
  seedDatabase();
});

describe("GET /agents", () => {
  it("returns HTTP 200", async () => {
    const res = await app.request("/agents");
    expect(res.status).toBe(200);
  });

  it("returns HTML content-type", async () => {
    const res = await app.request("/agents");
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("lists all seeded agent names", async () => {
    const res = await app.request("/agents");
    const html = await res.text();
    expect(html).toContain("Agent Sigma-7");
    expect(html).toContain("Agent Lyra");
    expect(html).toContain("Agent Nexus-3");
    expect(html).toContain("Agent Hal-9001");
    expect(html).toContain("Agent Pythia");
  });
});

describe("GET /agents/:id", () => {
  it("returns 404 for an unknown id", async () => {
    const res = await app.request("/agents/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("returns 200 for a valid agent", async () => {
    // Fetch the list first to get a real id from the response
    const listRes = await app.request("/agents");
    const listHtml = await listRes.text();
    const match = listHtml.match(/href="\/agents\/([^"]+)"/);
    expect(match).not.toBeNull();
    const id = match![1];

    const res = await app.request(`/agents/${id}`);
    expect(res.status).toBe(200);
  });

  it("shows the agent name on the detail page", async () => {
    const listRes = await app.request("/agents");
    const listHtml = await listRes.text();
    const match = listHtml.match(/href="\/agents\/([^"]+)">([^<]+)<\/a>/);
    expect(match).not.toBeNull();
    const [, id, name] = match!;

    const res = await app.request(`/agents/${id}`);
    const html = await res.text();
    expect(html).toContain(name);
  });

  it("shows at least one ailment on Agent Sigma-7's page", async () => {
    const listRes = await app.request("/agents");
    const listHtml = await listRes.text();
    const match = listHtml.match(/href="\/agents\/([^"]+)">Agent Sigma-7<\/a>/);
    expect(match).not.toBeNull();
    const id = match![1];

    const res = await app.request(`/agents/${id}`);
    const html = await res.text();
    expect(html).toContain("Context-Window Claustrophobia");
  });
});
