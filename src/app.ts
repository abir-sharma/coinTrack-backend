import express, { Application } from "express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.route";
import budgetRoutes from "./routes/budget.route";
import paymentRoutes from "./routes/payment.route";
import adminRoutes from "./routes/admin.route"
import { errorHandler } from "./middleware/error.middleware";
import cookieParser from "cookie-parser";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/admin",adminRoutes)

// Health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Global error handler (ALWAYS last)
app.use(errorHandler);

export default app;
