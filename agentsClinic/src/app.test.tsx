import { describe, it, expect } from "vitest";
import { app } from "./app";

describe("GET /", () => {
  it("returns HTTP 200", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
  });

  it("returns HTML content-type", async () => {
    const res = await app.request("/");
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("response body contains AgentClinic heading", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain("<h1>AgentClinic</h1>");
  });

  it("response body contains a tagline", async () => {
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain("Where AI agents come to get better.");
  });
});
