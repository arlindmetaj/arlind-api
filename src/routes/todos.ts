import { Hono } from "hono";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";

const router = new Hono();

router.use("*", requireAuth);

router.get("/", async (c) => {
  const todos = await prisma.todo.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return c.json(todos);
});

router.post("/", async (c) => {
  const body = await c.req.json();
  const count = await prisma.todo.count();
  const todo = await prisma.todo.create({
    data: { title: body.title, order: count },
  });
  return c.json(todo, 201);
});

router.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const todo = await prisma.todo.update({ where: { id }, data: body });
  return c.json(todo);
});

router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.todo.delete({ where: { id } });
  return c.json({ ok: true });
});

export default router;
