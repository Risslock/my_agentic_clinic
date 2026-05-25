import { describe, it, expect } from "vitest";
import { render } from "../test-utils";
import { Badge } from "./Badge";
import { IconCheck } from "./Icons";

describe("Badge", () => {
  it("renders badge text", async () => {
    const html = await render(<Badge text="Active" />);
    expect(html).toContain("Active");
  });

  it("applies the variant class", async () => {
    const html = await render(<Badge text="Critical" variant="danger" />);
    expect(html).toContain("badge-danger");
  });

  it("renders an optional icon", async () => {
    const html = await render(<Badge text="Done" icon={IconCheck} />);
    expect(html).toContain("badge-icon");
  });
});
