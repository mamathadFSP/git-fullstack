import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import analyzeRouter from "./routes/analyze.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", analyzeRouter);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// --- Production: serve the built React client ---
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
// Catch-all: send index.html for React Router client-side routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
