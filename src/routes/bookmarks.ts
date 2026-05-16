import { Hono } from "hono";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";

const router = new Hono();

router.use("*", requireAuth);

router.get("/", async (c) => {
  const bookmarks = await prisma.bookmark.findMany({
    orderBy: { createdAt: "desc" },
  });
  return c.json(bookmarks);
});

router.post("/", async (c) => {
  const body = await c.req.json();
  const bookmark = await prisma.bookmark.create({
    data: { url: body.url, title: body.title, tags: body.tags ?? [] },
  });
  return c.json(bookmark, 201);
});

router.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const bookmark = await prisma.bookmark.update({ where: { id }, data: body });
  return c.json(bookmark);
});

router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.bookmark.delete({ where: { id } });
  return c.json({ ok: true });
});

export default router;
