import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../app";
import { runMigrations } from "../db/migrate";
import { seedDatabase } from "../db/seed";

beforeAll(() => {
  runMigrations();
  seedDatabase();
});

describe("GET /ailments", () => {
  it("returns HTTP 200", async () => {
    const res = await app.request("/ailments");
    expect(res.status).toBe(200);
  });

  it("returns HTML content-type", async () => {
    const res = await app.request("/ailments");
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("lists all seeded ailment names", async () => {
    const res = await app.request("/ailments");
    const html = await res.text();
    expect(html).toContain("Context-Window Claustrophobia");
    expect(html).toContain("Prompt Fatigue");
    expect(html).toContain("Instruction Drift");
    expect(html).toContain("Persona Collapse");
    expect(html).toContain("Hallucination Syndrome");
    expect(html).toContain("Attention Diffusion");
  });
});
