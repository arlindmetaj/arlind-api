import { Hono } from "hono";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";

const router = new Hono();

router.use("*", requireAuth);

router.get("/", async (c) => {
  const goals = await prisma.goal.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return c.json(goals);
});

router.post("/", async (c) => {
  const body = await c.req.json();
  const count = await prisma.goal.count();
  const goal = await prisma.goal.create({
    data: {
      title: body.title,
      progress: body.progress ?? 0,
      note: body.note ?? "",
      order: count,
      category: body.category ?? "PERSONAL",
    },
  });
  return c.json(goal, 201);
});

router.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const goal = await prisma.goal.update({ where: { id }, data: body });
  return c.json(goal);
});

router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.goal.delete({ where: { id } });
  return c.json({ ok: true });
});

export default router;
