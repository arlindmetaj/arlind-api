Scaffold a new CRUD route for: $ARGUMENTS

Follow these steps exactly:

## 1. Prisma schema
Add a new model to `prisma/schema.prisma`. Use `cuid()` for IDs, always include `createdAt DateTime @default(now())`, and add sensible `@default` values on every field.

Example pattern:
```prisma
model [Name] {
  id        String   @id @default(cuid())
  title     String
  order     Int      @default(0)
  createdAt DateTime @default(now())
}
```

## 2. Route file
Create `src/routes/[name].ts`:

```ts
import { Hono } from "hono";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";

const router = new Hono();

router.use("*", requireAuth);

router.get("/", async (c) => {
  const items = await prisma.[model].findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return c.json(items);
});

router.post("/", async (c) => {
  const body = await c.req.json();
  const count = await prisma.[model].count();
  const item = await prisma.[model].create({
    data: { ...body, order: count },
  });
  return c.json(item, 201);
});

router.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const item = await prisma.[model].update({ where: { id }, data: body });
  return c.json(item);
});

router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.[model].delete({ where: { id } });
  return c.json({ ok: true });
});

export default router;
```

## 3. Register in src/index.ts
- Import the new route: `import [name]Routes from "./routes/[name]";`
- Mount it: `app.route("/[name]", [name]Routes);`
- Add the OpenAPI paths for GET, POST, PATCH /:id, DELETE /:id to the existing `/openapi.json` spec

## 4. Run migration locally
```bash
npx prisma db push
```

## 5. Remind the user
> ✅ Route scaffolded. Run `npx prisma db push` locally to apply the schema.
> When deploying: redeploy **`arlind-api`** first (runs migration), then **`arlind-tech`** if you added frontend proxy routes.
