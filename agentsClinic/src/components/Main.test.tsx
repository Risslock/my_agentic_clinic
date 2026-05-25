import { describe, it, expect } from "vitest";
import { render } from "../test-utils";
import { Main } from "./Main";

describe("Main", () => {
  it("wraps children in a <main> element", async () => {
    const html = await render(<Main><p>content</p></Main>);
    expect(html).toContain("<main>");
    expect(html).toContain("</main>");
  });

  it("renders children inside the <main> element", async () => {
    const html = await render(<Main><p id="test">hello</p></Main>);
    expect(html).toContain('<p id="test">hello</p>');
  });
});
