import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import authRoutes     from "./routes/auth";
import booksRoutes    from "./routes/books";
import routineRoutes  from "./routes/routine";
import todosRoutes    from "./routes/todos";
import goalsRoutes    from "./routes/goals";
import ideasRoutes    from "./routes/ideas";
import notesRoutes    from "./routes/notes";
import bookmarksRoutes from "./routes/bookmarks";
import seedRoutes     from "./routes/seed";

const app = new Hono();

// ── Middleware ───────────────────────────────────
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (process.env.FRONTEND_URL || "http://localhost:3000").split(","),
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ── Health ───────────────────────────────────────
app.get("/health", (c) => c.json({ ok: true, service: "arlind-api" }));

// ── Routes ───────────────────────────────────────
app.route("/auth",      authRoutes);
app.route("/books",     booksRoutes);
app.route("/routine",   routineRoutes);
app.route("/todos",     todosRoutes);
app.route("/goals",     goalsRoutes);
app.route("/ideas",     ideasRoutes);
app.route("/notes",     notesRoutes);
app.route("/bookmarks", bookmarksRoutes);
app.route("/seed",      seedRoutes);

// ── Start ────────────────────────────────────────
const port = parseInt(process.env.PORT || "4000");
serve({ fetch: app.fetch, port }, () => {
  console.log(`arlind-api running on http://localhost:${port}`);
});
