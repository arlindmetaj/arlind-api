import { Hono } from "hono";
import { signJWT, verifyJWT } from "../auth";

const router = new Hono();

router.post("/login", async (c) => {
  const body = await c.req.json();
  const password = body.password || "";

  if (password !== process.env.AUTH_PASSWORD) {
    return c.json({ error: "Invalid password" }, 401);
  }

  const token = await signJWT();
  return c.json({ token });
});

router.get("/me", async (c) => {
  const header = c.req.header("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return c.json({ loggedIn: false });
  }
  const token = header.slice(7);
  const valid = await verifyJWT(token);
  return c.json({ loggedIn: valid });
});

export default router;
