import { Hono } from "hono";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";

const router = new Hono();

router.use("*", requireAuth);

router.get("/", async (c) => {
  const memos = await prisma.memo.findMany({
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  });
  return c.json(memos);
});

router.post("/", async (c) => {
  const body = await c.req.json();
  const memo = await prisma.memo.create({
    data: {
      title: body.title ?? "",
      content: body.content ?? "",
      pinned: body.pinned ?? false,
    },
  });
  return c.json(memo, 201);
});

router.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const memo = await prisma.memo.update({ where: { id }, data: body });
  return c.json(memo);
});

router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.memo.delete({ where: { id } });
  return c.body(null, 204);
});

export default router;
