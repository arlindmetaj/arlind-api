import { Hono } from "hono";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";

const router = new Hono();

router.use("*", requireAuth);

router.get("/", async (c) => {
  const ideas = await prisma.idea.findMany({ orderBy: { createdAt: "desc" } });
  return c.json(ideas);
});

router.post("/", async (c) => {
  const body = await c.req.json();
  const idea = await prisma.idea.create({
    data: { content: body.content, tags: body.tags ?? [] },
  });
  return c.json(idea, 201);
});

router.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const idea = await prisma.idea.update({ where: { id }, data: body });
  return c.json(idea);
});

router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.idea.delete({ where: { id } });
  return c.json({ ok: true });
});

export default router;
