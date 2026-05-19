Check what has changed and tell the user exactly what needs to be done before deploying.

Run:
```bash
git diff --name-only origin/main..HEAD 2>/dev/null || git diff --name-only HEAD~1..HEAD
```

Then apply these rules:

## arlind-api always needs redeploying if any of these changed:
- `src/` — route or middleware changes
- `prisma/schema.prisma` — ⚠️ schema change, migration will run on deploy
- `entrypoint.sh` — deployment script change
- `package.json`, `tsconfig.json`

## Schema change checklist
If `prisma/schema.prisma` changed:
1. Confirm `npx prisma db push` was run locally
2. Warn: redeploy `arlind-api` BEFORE `arlind-tech`
3. Check that all new fields have `@default` values (to avoid breaking existing rows)
4. Check that `entrypoint.sh` still has `--url="$DATABASE_URL"` in the prisma db push command

## Output format
---
**Deploy checklist for arlind-api:**
- [ ] Redeploy `arlind-api` in Coolify

If schema changed, add:
> ⚠️ `prisma/schema.prisma` was modified — the migration runs automatically on deploy via `entrypoint.sh`.
> Redeploy `arlind-api` BEFORE `arlind-tech` so the database is ready.

If nothing changed:
- [x] Nothing changed in arlind-api — no redeploy needed
---
