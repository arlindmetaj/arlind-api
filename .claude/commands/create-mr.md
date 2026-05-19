Create a GitHub Pull Request for the current branch. $ARGUMENTS (optional: custom title or notes).

Follow these steps:

## 1. Gather context
Run these in parallel:
```bash
git status
git log --oneline origin/main..HEAD
git diff origin/main..HEAD
```

## 2. Check branch
If already on `main`, tell the user:
> You're on `main` — create a feature branch first with `git checkout -b your-branch-name`, then run this command again.
Stop here if on main.

## 3. Push branch
```bash
git push -u origin HEAD
```

## 4. Draft PR title and body
- Title: short, under 70 chars, imperative ("Add goals category", "Fix auth middleware")
- Body template:

```
## What changed
<bullet points of routes/schema/middleware added or changed>

## Schema changes
<list any prisma model changes, or "None">

## Deploy order
- [ ] Redeploy `arlind-api` in Coolify
- [ ] Redeploy `arlind-tech` if frontend proxy routes were added

## Test plan
- [ ] Tested locally with `npm run dev`
- [ ] API responds correctly at localhost:4000
- [ ] `npx prisma db push` run locally if schema changed
```

## 5. Create the PR
```bash
gh pr create --title "<title>" --body "<body>" --base main
```

## 6. Return the PR URL to the user.
