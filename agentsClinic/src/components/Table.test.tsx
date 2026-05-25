import { describe, it, expect } from "vitest";
import { render } from "../test-utils";
import { Table } from "./Table";

describe("Table", () => {
  it("renders column headers", async () => {
    const html = await render(
      <Table
        columns={["Name", "Status"]}
        rows={[{ Name: "Agent One", Status: "active" }]}
      />
    );
    expect(html).toContain("<th>Name</th>");
    expect(html).toContain("<th>Status</th>");
  });

  it("renders row data", async () => {
    const html = await render(
      <Table
        columns={["Name", "Status"]}
        rows={[{ Name: "Agent One", Status: "active" }]}
      />
    );
    expect(html).toContain("Agent One");
    expect(html).toContain("active");
  });

  it("renders the empty state fallback", async () => {
    const html = await render(
      <Table columns={["Name"]} rows={[]} emptyMessage="No records" />
    );
    expect(html).toContain("No records");
  });
});
