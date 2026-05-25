import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../app";
import { runMigrations } from "../db/migrate";
import { seedDatabase } from "../db/seed";
import { db } from "../db/database";

beforeAll(() => {
  runMigrations();
  seedDatabase();
});

function getFirstAgentId(): string {
  const row = db.prepare("SELECT id FROM agents LIMIT 1").get() as { id: string };
  return row.id;
}

function futureDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  // datetime-local format: YYYY-MM-DDTHH:MM
  return d.toISOString().slice(0, 16);
}

describe("GET /appointments", () => {
  it("returns HTTP 200", async () => {
    const res = await app.request("/appointments");
    expect(res.status).toBe(200);
  });

  it("returns HTML with table headers", async () => {
    const res = await app.request("/appointments");
    const html = await res.text();
    expect(html).toContain("Therapist");
  });
});

describe("POST /appointments", () => {
  it("returns 400 when therapist_name is missing", async () => {
    const agentId = getFirstAgentId();
    const body = new URLSearchParams({
      agent_id: agentId,
      therapist_name: "",
      scheduled_at: futureDate(),
    });
    const res = await app.request("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    expect(res.status).toBe(400);
    const html = await res.text();
    expect(html).toContain("required");
  });

  it("returns 400 when scheduled_at is in the past", async () => {
    const agentId = getFirstAgentId();
    const body = new URLSearchParams({
      agent_id: agentId,
      therapist_name: "Dr Test",
      scheduled_at: "2000-01-01T10:00",
    });
    const res = await app.request("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    expect(res.status).toBe(400);
    const html = await res.text();
    expect(html).toContain("future");
  });

  it("returns 400 when agent_id is unknown", async () => {
    const body = new URLSearchParams({
      agent_id: "does-not-exist",
      therapist_name: "Dr Test",
      scheduled_at: futureDate(),
    });
    const res = await app.request("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    expect(res.status).toBe(400);
  });

  it("returns 302 redirect on valid submission", async () => {
    const agentId = getFirstAgentId();
    const body = new URLSearchParams({
      agent_id: agentId,
      therapist_name: "Dr Valid",
      scheduled_at: futureDate(),
      notes: "Test booking",
    });
    const res = await app.request("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toMatch(/^\/appointments\//);
  });
});

describe("GET /appointments/:id", () => {
  it("returns 404 for unknown id", async () => {
    const res = await app.request("/appointments/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("returns 200 and shows therapist name for a valid appointment", async () => {
    const agentId = getFirstAgentId();
    const body = new URLSearchParams({
      agent_id: agentId,
      therapist_name: "Dr Confirmation",
      scheduled_at: futureDate(),
    });
    const postRes = await app.request("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const location = postRes.headers.get("location")!;
    const res = await app.request(location);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Dr Confirmation");
  });
});
