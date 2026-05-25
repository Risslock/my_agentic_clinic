import { describe, it, expect } from "vitest";
import { render } from "../test-utils";
import { Header } from "./Header";

describe("Header", () => {
  it("renders a link to /", async () => {
    const html = await render(<Header />);
    expect(html).toContain('href="/"');
  });

  it("displays the brand name", async () => {
    const html = await render(<Header />);
    expect(html).toContain("AgentClinic");
  });

  it("wraps content in a <header> element", async () => {
    const html = await render(<Header />);
    expect(html).toContain("<header>");
    expect(html).toContain("</header>");
  });

  it("renders a <nav> element", async () => {
    const html = await render(<Header />);
    expect(html).toContain("<nav>");
  });

  it("has a link to /agents", async () => {
    const html = await render(<Header />);
    expect(html).toContain('href="/agents"');
  });

  it("has a link to /ailments", async () => {
    const html = await render(<Header />);
    expect(html).toContain('href="/ailments"');
  });

  it("has a link to /therapies", async () => {
    const html = await render(<Header />);
    expect(html).toContain('href="/therapies"');
  });

  it("has a link to /appointments", async () => {
    const html = await render(<Header />);
    expect(html).toContain('href="/appointments"');
  });

  it("has a link to /dashboard", async () => {
    const html = await render(<Header />);
    expect(html).toContain('href="/dashboard"');
  });

  it("renders nav icons", async () => {
    const html = await render(<Header />);
    expect(html).toContain("<svg");
  });
});
