import { Hono } from "hono";
import type { JSX } from "hono/jsx/jsx-runtime";

export async function render(node: JSX.Element): Promise<string> {
  const app = new Hono();
  app.get("/", (c) => c.html(node));
  const res = await app.request("/");
  return res.text();
}
