import { describe, it, expect } from "vitest";
import { render } from "../test-utils";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("renders the label and input", async () => {
    const html = await render(<FormField label="Therapist" name="therapist_name" />);
    expect(html).toContain("<label");
    expect(html).toContain("<input");
    expect(html).toContain("Therapist");
  });

  it("renders the error message", async () => {
    const html = await render(
      <FormField label="Therapist" name="therapist_name" error="Required" />
    );
    expect(html).toContain("Required");
  });
});
