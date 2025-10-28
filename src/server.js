import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// Global error diagnostics for unexpected crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
process.on('beforeExit', (code) => {
  console.warn('Process beforeExit with code:', code);
});
process.on('exit', (code) => {
  console.warn('Process exit with code:', code);
});
process.on('SIGINT', () => {
  console.warn('Received SIGINT');
});
process.on('SIGTERM', () => {
  console.warn('Received SIGTERM');
});

// health
app.get("/health", (_req, res) => res.status(200).json({ ok: true }));


app.use("/api/categories", categoryRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/posts", postRoutes);
app.use("/tasks", taskRoutes);

// Serve bundled OpenAPI spec and Swagger UI
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(undefined, {
  swaggerOptions: { url: "/bundled.yaml" },
  customSiteTitle: "API Docs",
}));

// central error handler
app.use((err, _req, res, _next) => {
  // 400 should use { errors: [...] }
  if (err.status === 400) return res.status(400).json({ errors: err.errors ?? ["Bad request"] });
  // 404 should use { error: "..." }
  if (err.status === 404) return res.status(404).json({ error: err.message || "Not found" });
  // 409 should use { error: "..." }
  if (err.status === 409) return res.status(409).json({ error: err.message || "Conflict" });

  console.error(err);
  return res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
if (process.env.NODE_ENV !== "test") {
  const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
  server.on('close', () => {
    console.log('Server closed');
  });

  // Lightweight heartbeat to ensure event loop stays active and give visibility
  setInterval(() => {
    // comment out if too noisy
    // console.log('Heartbeat: server alive');
  }, 30000);
}
export default app;