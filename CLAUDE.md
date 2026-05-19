# arlind-api project rules

## Stack
- Runtime: Node.js, framework: Hono (`@hono/node-server`)
- ORM: Prisma 7 with `@prisma/adapter-pg` (PostgreSQL)
- Auth: JWT via `jose`, verified with `requireAuth` middleware
- Entry point: `src/index.ts`

## Route conventions
- Every new route file lives in `src/routes/[name].ts`
- All routes (except `/auth/login`) must apply `requireAuth` middleware: `router.use("*", requireAuth)`
- Always import `prisma` from `../db` — never instantiate a new PrismaClient
- Mount new routes in `src/index.ts`: `app.route("/[name]", [name]Routes)`
- Add the corresponding paths to the OpenAPI spec in `src/index.ts`

## Prisma / database
- Schema lives in `prisma/schema.prisma`
- After any schema change, run locally: `npx prisma db push`
- The `entrypoint.sh` runs `prisma db push --accept-data-loss --url="$DATABASE_URL"` on every production deploy — do NOT remove the `--url` flag, it is required for the Docker environment
- Never run `prisma migrate` — this project uses `db push` only
- Always add `@default` values to new schema fields to avoid breaking existing rows

## Environment variables
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_PASSWORD` — single-user password for login
- `AUTH_SECRET` — JWT signing secret (must match the same value in `arlind-tech`)
- `FRONTEND_URL` — allowed CORS origin
- `PORT` — server port (default 4000)
- `import "dotenv/config"` is at the top of `src/index.ts` and `prisma.config.ts` — do not remove it

## Error handling
- Return `c.json({ error: "..." }, statusCode)` for all error responses
- Never leak stack traces or internal error messages in responses

## Git commits
- Never include `Co-Authored-By` lines in commit messages

## Deployment
- This is the backend for `arlind-tech` (frontend)
- Any schema change requires redeploying this service in Coolify so `prisma db push` runs and the DB is updated
- Redeploy `arlind-api` BEFORE `arlind-tech` when both change together
