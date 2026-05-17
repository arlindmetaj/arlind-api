import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";

import authRoutes      from "./routes/auth";
import booksRoutes     from "./routes/books";
import routineRoutes   from "./routes/routine";
import todosRoutes     from "./routes/todos";
import goalsRoutes     from "./routes/goals";
import ideasRoutes     from "./routes/ideas";
import notesRoutes     from "./routes/notes";
import bookmarksRoutes from "./routes/bookmarks";
import seedRoutes      from "./routes/seed";

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

// ── OpenAPI spec ─────────────────────────────────
app.get("/openapi.json", (c) =>
  c.json({
    openapi: "3.0.0",
    info: { title: "arlind-api", version: "1.0.0", description: "Personal backend API" },
    servers: [{ url: `http://localhost:${process.env.PORT || 4000}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/health": {
        get: { tags: ["System"], summary: "Health check", security: [], responses: { "200": { description: "OK" } } },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"], summary: "Sign in", security: [],
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { password: { type: "string" } }, required: ["password"] } } } },
          responses: { "200": { description: "Returns JWT token" }, "401": { description: "Invalid password" } },
        },
      },
      "/auth/me": {
        get: { tags: ["Auth"], summary: "Check session", responses: { "200": { description: "Session status" } } },
      },
      "/books": {
        get:  { tags: ["Books"], summary: "List all books", responses: { "200": { description: "Array of books" } } },
        post: { tags: ["Books"], summary: "Add a book",
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { title: { type: "string" }, author: { type: "string" }, status: { type: "string", enum: ["WANT", "READING", "FINISHED"] } }, required: ["title"] } } } },
          responses: { "201": { description: "Created book" } } },
      },
      "/books/{id}": {
        patch:  { tags: ["Books"], summary: "Update a book",  parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Updated book" } } },
        delete: { tags: ["Books"], summary: "Delete a book",  parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } },
      },
      "/todos": {
        get:  { tags: ["Todos"], summary: "List todos", responses: { "200": { description: "Array of todos" } } },
        post: { tags: ["Todos"], summary: "Add a todo", requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { title: { type: "string" } }, required: ["title"] } } } }, responses: { "201": { description: "Created todo" } } },
      },
      "/todos/{id}": {
        patch:  { tags: ["Todos"], summary: "Update a todo",  parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Updated todo" } } },
        delete: { tags: ["Todos"], summary: "Delete a todo",  parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } },
      },
      "/goals": {
        get:  { tags: ["Goals"], summary: "List goals", responses: { "200": { description: "Array of goals" } } },
        post: { tags: ["Goals"], summary: "Add a goal", requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { title: { type: "string" }, progress: { type: "number" }, note: { type: "string" } }, required: ["title"] } } } }, responses: { "201": { description: "Created goal" } } },
      },
      "/goals/{id}": {
        patch:  { tags: ["Goals"], summary: "Update a goal",  parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Updated goal" } } },
        delete: { tags: ["Goals"], summary: "Delete a goal",  parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } },
      },
      "/ideas": {
        get:  { tags: ["Ideas"], summary: "List ideas", responses: { "200": { description: "Array of ideas" } } },
        post: { tags: ["Ideas"], summary: "Add an idea", requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { content: { type: "string" }, tags: { type: "array", items: { type: "string" } } }, required: ["content"] } } } }, responses: { "201": { description: "Created idea" } } },
      },
      "/ideas/{id}": {
        patch:  { tags: ["Ideas"], summary: "Update an idea",  parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Updated idea" } } },
        delete: { tags: ["Ideas"], summary: "Delete an idea",  parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } },
      },
      "/notes": {
        get:  { tags: ["Notes"], summary: "List notes", parameters: [{ name: "date", in: "query", schema: { type: "string", format: "date" } }], responses: { "200": { description: "Array of notes" } } },
        post: { tags: ["Notes"], summary: "Add a note", requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { content: { type: "string" }, date: { type: "string", format: "date" } }, required: ["content", "date"] } } } }, responses: { "201": { description: "Created note" } } },
      },
      "/notes/{id}": {
        patch:  { tags: ["Notes"], summary: "Update a note",  parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Updated note" } } },
        delete: { tags: ["Notes"], summary: "Delete a note",  parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "204": { description: "Deleted" } } },
      },
      "/bookmarks": {
        get:  { tags: ["Bookmarks"], summary: "List bookmarks", responses: { "200": { description: "Array of bookmarks" } } },
        post: { tags: ["Bookmarks"], summary: "Add a bookmark", requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { url: { type: "string" }, title: { type: "string" }, tags: { type: "array", items: { type: "string" } } }, required: ["url", "title"] } } } }, responses: { "201": { description: "Created bookmark" } } },
      },
      "/bookmarks/{id}": {
        patch:  { tags: ["Bookmarks"], summary: "Update a bookmark", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Updated bookmark" } } },
        delete: { tags: ["Bookmarks"], summary: "Delete a bookmark", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } },
      },
      "/routine": {
        get:  { tags: ["Routine"], summary: "List activities", parameters: [{ name: "day", in: "query", schema: { type: "integer", minimum: 0, maximum: 6 }, description: "Day of week (0=Sun, 1=Mon … 6=Sat)" }], responses: { "200": { description: "Array of activities with completions" } } },
        post: { tags: ["Routine"], summary: "Add an activity", requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { title: { type: "string" }, dayOfWeek: { type: "integer" } }, required: ["title", "dayOfWeek"] } } } }, responses: { "201": { description: "Created activity" } } },
      },
      "/routine/{id}": {
        patch:  { tags: ["Routine"], summary: "Update an activity", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "Updated activity" } } },
        delete: { tags: ["Routine"], summary: "Delete an activity", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "204": { description: "Deleted" } } },
      },
      "/routine/{id}/complete": {
        post: { tags: ["Routine"], summary: "Toggle completion", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { date: { type: "string", format: "date" }, done: { type: "boolean" } }, required: ["date", "done"] } } } }, responses: { "200": { description: "Completion record" } } },
      },
      "/seed": {
        post: { tags: ["System"], summary: "Seed default routine", responses: { "201": { description: "Seeded" }, "200": { description: "Already seeded" } } },
      },
    },
  })
);

// ── Swagger UI ───────────────────────────────────
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

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
  console.log(`Swagger UI →  http://localhost:${port}/docs`);
});
