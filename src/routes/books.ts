import { Hono } from "hono";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";

const router = new Hono();

router.use("*", requireAuth);

router.get("/", async (c) => {
  const books = await prisma.book.findMany({ orderBy: { createdAt: "asc" } });
  return c.json(books);
});

router.post("/", async (c) => {
  const body = await c.req.json();
  const book = await prisma.book.create({
    data: {
      title: body.title,
      author: body.author ?? "",
      status: body.status ?? "WANT",
      progress: body.progress ?? 0,
      finishedAt: body.finishedAt ? new Date(body.finishedAt) : null,
    },
  });
  return c.json(book, 201);
});

router.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const data: Record<string, unknown> = { ...body };
  if (body.finishedAt) data.finishedAt = new Date(body.finishedAt);
  const book = await prisma.book.update({ where: { id }, data });
  return c.json(book);
});

router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.book.delete({ where: { id } });
  return c.json({ ok: true });
});

export default router;
