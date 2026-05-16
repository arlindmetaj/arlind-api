import { Hono } from "hono";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";

const router = new Hono();

router.use("*", requireAuth);

const DEFAULT_ROUTINE: { dayOfWeek: number; activities: string[] }[] = [
  { dayOfWeek: 1, activities: ["Wake up at 6:45", "Gym", "Work", "Go out / Activity", "Read"] },
  { dayOfWeek: 2, activities: ["Wake up at 6:45", "Study / Plan / Think", "Work", "Discuss with Esmeralda — go out, dinner, movie?", "Read"] },
  { dayOfWeek: 3, activities: ["Wake up at 6:45", "Gym", "Work", "Go out? / Upscale myself", "Read"] },
  { dayOfWeek: 4, activities: ["Wake up at 6:45", "Study / Plan / Think", "Work", "Family time / Discuss relationship with Esmeralda", "Read"] },
  { dayOfWeek: 5, activities: ["Wake up at 6:45", "Gym", "Work", "Plan with Esmeralda / Find time for friends", "Read"] },
  { dayOfWeek: 6, activities: ["Wake up at 6:45", "Free morning", "Outdoor / Social", "Read"] },
  { dayOfWeek: 0, activities: ["Wake up relaxed", "Family / Rest", "Prep for the week", "Read"] },
];

router.post("/", async (c) => {
  const existing = await prisma.routineActivity.count();
  if (existing > 0) {
    return c.json({ message: "Already seeded" });
  }
  for (const day of DEFAULT_ROUTINE) {
    for (let i = 0; i < day.activities.length; i++) {
      await prisma.routineActivity.create({
        data: { dayOfWeek: day.dayOfWeek, title: day.activities[i], order: i },
      });
    }
  }
  return c.json({ message: "Seeded successfully" }, 201);
});

export default router;
