import "dotenv/config";
import clientRoutes from "./routes/client.routes.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import { prisma } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import proposalRoutes from "./routes/proposal.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import path from "path";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/products", productRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);
app.use(
  "/uploads",
  express.static(
    path.resolve(process.cwd(), "uploads")
  )
);
app.use("/api/proposals", proposalRoutes);
app.use(
  "/api/organization",
  organizationRoutes
);
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "Proposal Management API is running",
      database: "connected",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "API is running but database connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});