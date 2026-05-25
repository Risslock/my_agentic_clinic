import { describe, it, expect } from "vitest";
import { render } from "../test-utils";
import { EmptyState } from "./EmptyState";
import { IconAlertTriangle } from "./Icons";

describe("EmptyState", () => {
  it("renders an icon", async () => {
    const html = await render(
      <EmptyState
        heading="Nothing here"
        description="No entries yet"
        icon={IconAlertTriangle}
      />
    );
    expect(html).toContain("<svg");
  });

  it("renders the heading and description", async () => {
    const html = await render(
      <EmptyState
        heading="Nothing here"
        description="No entries yet"
        icon={IconAlertTriangle}
      />
    );
    expect(html).toContain("Nothing here");
    expect(html).toContain("No entries yet");
  });
});
