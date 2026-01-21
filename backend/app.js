import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

import healthRoutes from "./routes/healthRoutes.js";
import approvalRoutes from "./routes/approvalRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import riskRoutes from "./routes/riskRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import devRoutes from "./routes/devRoutes.js";

export const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: false,
  }),
);

// backend test
app.use("/", (req, res, next) => {
  res.send("Upstream Task Management Backend is running");
  next();
});

// routes here listed
app.use("/api", healthRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/risks", riskRoutes);
app.use("/api/exports", exportRoutes);
app.use("/api/dev", devRoutes);

app.use(errorMiddleware);
