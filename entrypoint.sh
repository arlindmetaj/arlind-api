#!/bin/sh
set -e
npx prisma db push --accept-data-loss --url="$DATABASE_URL"
exec node dist/index.js
