import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo.js";
import checkoutRoutes from "./routes/checkout.js";
import { initializeDatabase } from "./db.js";

export async function createServer() {
  const app = express();

  // Initialize database
  await initializeDatabase();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Checkout routes
  app.use(checkoutRoutes);

  return app;
}
