import { Hono } from "hono";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";

const router = new Hono();

router.use("*", requireAuth);

router.get("/", async (c) => {
  const date = c.req.query("date");
  const notes = await prisma.note.findMany({
    where: date ? { date: new Date(date) } : undefined,
    orderBy: { createdAt: "asc" },
  });
  return c.json(notes);
});

router.post("/", async (c) => {
  const body = await c.req.json();
  const note = await prisma.note.create({
    data: { content: body.content, date: new Date(body.date) },
  });
  return c.json(note, 201);
});

router.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const note = await prisma.note.update({ where: { id }, data: body });
  return c.json(note);
});

router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.note.delete({ where: { id } });
  return c.body(null, 204);
});

export default router;
