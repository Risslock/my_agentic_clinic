import { describe, it, expect } from "vitest";
import { render } from "../test-utils";
import { Layout } from "./Layout";

describe("Layout", () => {
  it("renders an <html> element with lang=en", async () => {
    const html = await render(<Layout><span /></Layout>);
    expect(html).toContain('<html lang="en"');
  });

  it("includes the page title", async () => {
    const html = await render(<Layout><span /></Layout>);
    expect(html).toContain("<title>AgentClinic</title>");
  });

  it("links to the stylesheet", async () => {
    const html = await render(<Layout><span /></Layout>);
    expect(html).toContain('href="/static/style.css"');
  });

  it("sets UTF-8 charset", async () => {
    const html = await render(<Layout><span /></Layout>);
    expect(html).toContain('charset="UTF-8"');
  });

  it("includes viewport meta tag", async () => {
    const html = await render(<Layout><span /></Layout>);
    expect(html).toContain('name="viewport"');
  });

  it("composes Header, Main, and Footer", async () => {
    const html = await render(<Layout><span /></Layout>);
    expect(html).toContain("<header>");
    expect(html).toContain("<main>");
    expect(html).toContain("<footer>");
  });

  it("renders page children inside the document", async () => {
    const html = await render(<Layout><p id="slot">page content</p></Layout>);
    expect(html).toContain('<p id="slot">page content</p>');
  });
});
