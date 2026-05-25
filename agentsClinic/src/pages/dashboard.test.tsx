import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../app";
import { runMigrations } from "../db/migrate";
import { seedDatabase } from "../db/seed";

beforeAll(() => {
  runMigrations();
  seedDatabase();
});

describe("GET /dashboard", () => {
  it("returns HTTP 200", async () => {
    const res = await app.request("/dashboard");
    expect(res.status).toBe(200);
  });

  it("returns HTML content-type", async () => {
    const res = await app.request("/dashboard");
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("contains summary count labels", async () => {
    const res = await app.request("/dashboard");
    const html = await res.text();
    expect(html).toContain("Total Agents");
    expect(html).toContain("Open Appointments");
    expect(html).toContain("Ailments In-Flight");
  });

  it("contains agents table column header", async () => {
    const res = await app.request("/dashboard");
    const html = await res.text();
    expect(html).toContain("Model Type");
  });

  it("contains appointments table column header", async () => {
    const res = await app.request("/dashboard");
    const html = await res.text();
    expect(html).toContain("Therapist");
  });
});
