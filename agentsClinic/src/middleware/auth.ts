import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(async (c, next) => {
  if (c.req.path === "/api/health") return next();

  const expected = process.env.AGENTCLINIC_API_KEY;
  // No key configured → demo mode, all API routes are open
  if (!expected) return next();

  const authHeader = c.req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token || token !== expected) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return next();
});
