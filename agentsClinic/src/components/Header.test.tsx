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
});
