import { describe, it, expect } from "vitest";
import { render } from "../test-utils";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("wraps content in a <footer> element", async () => {
    const html = await render(<Footer />);
    expect(html).toContain("<footer>");
    expect(html).toContain("</footer>");
  });

  it("displays the current year", async () => {
    const html = await render(<Footer />);
    expect(html).toContain(String(new Date().getFullYear()));
  });

  it("displays the project name", async () => {
    const html = await render(<Footer />);
    expect(html).toContain("AgentClinic");
  });
});
