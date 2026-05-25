import { Hono } from "hono";

export async function render(node: JSX.Element): Promise<string> {
  const app = new Hono();
  app.get("/", (c) => c.html(node as string));
  const res = await app.request("/");
  return res.text();
}
