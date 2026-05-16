import { createMiddleware } from "hono/factory";
import { verifyJWT } from "../auth";

export const requireAuth = createMiddleware(async (c, next) => {
  const header = c.req.header("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const token = header.slice(7);
  const valid = await verifyJWT(token);
  if (!valid) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});
