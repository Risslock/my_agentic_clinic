import { describe, it, expect } from "vitest";
import { render } from "../test-utils";
import { Button } from "./Button";
import { IconPlus } from "./Icons";

describe("Button", () => {
  it("renders a button when href is absent", async () => {
    const html = await render(<Button>Book</Button>);
    expect(html).toContain("<button");
  });

  it("renders an anchor when href is provided", async () => {
    const html = await render(<Button href="/agents">Agents</Button>);
    expect(html).toContain("<a");
  });

  it("applies the variant class", async () => {
    const html = await render(<Button variant="danger">Delete</Button>);
    expect(html).toContain("button-danger");
  });

  it("renders the icon slot", async () => {
    const html = await render(<Button icon={IconPlus}>Add</Button>);
    expect(html).toContain("button-icon");
  });
});
