import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { CLIENT_URL, LOG_LEVEL, PORT } from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { stripeWebhook } from "./controllers/walletController.js";

async function startServer() {
  await connectDB();

  const app = express();

  // Stripe webhook must use raw body
  app.post(
    "/api/webhook/stripe",
    express.raw({ type: "application/json" }),
    stripeWebhook
  );

  // Standard middlewares
  app.use(
    cors({
      origin: CLIENT_URL || "*",
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(morgan(LOG_LEVEL));
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/wallet", walletRoutes);
  app.use("/api/admin", adminRoutes);

  // 404 and error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`✅ API server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

