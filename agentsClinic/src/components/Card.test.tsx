import { describe, it, expect } from "vitest";
import { render } from "../test-utils";
import { Card } from "./Card";
import { IconAgent } from "./Icons";

describe("Card", () => {
  it("renders the title", async () => {
    const html = await render(<Card title="Team Overview" icon={IconAgent}>Overview content</Card>);
    expect(html).toContain("Team Overview");
  });

  it("renders children", async () => {
    const html = await render(<Card title="Team Overview">Overview content</Card>);
    expect(html).toContain("Overview content");
  });

  it("applies the variant class", async () => {
    const html = await render(<Card title="Alert" variant="danger">Critical</Card>);
    expect(html).toContain("card-danger");
  });
});
