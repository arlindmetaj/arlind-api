import { Hono } from "hono";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";

const router = new Hono();

router.use("*", requireAuth);

router.get("/", async (c) => {
  const day = c.req.query("day");
  const activities = await prisma.routineActivity.findMany({
    where: day ? { dayOfWeek: parseInt(day) } : undefined,
    include: { completions: true },
    orderBy: { order: "asc" },
  });
  return c.json(activities);
});

router.post("/", async (c) => {
  const body = await c.req.json();
  const count = await prisma.routineActivity.count({
    where: { dayOfWeek: body.dayOfWeek },
  });
  const activity = await prisma.routineActivity.create({
    data: { title: body.title, dayOfWeek: body.dayOfWeek, order: count },
    include: { completions: true },
  });
  return c.json(activity, 201);
});

router.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const activity = await prisma.routineActivity.update({
    where: { id },
    data: { title: body.title },
    include: { completions: true },
  });
  return c.json(activity);
});

router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.routineActivity.delete({ where: { id } });
  return c.body(null, 204);
});

router.post("/:id/complete", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const completion = await prisma.activityCompletion.upsert({
    where: { activityId_date: { activityId: id, date: new Date(body.date) } },
    update: { done: body.done },
    create: { activityId: id, date: new Date(body.date), done: body.done },
  });
  return c.json(completion);
});

export default router;
