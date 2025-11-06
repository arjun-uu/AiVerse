import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import { clerkMiddleware, requireAuth } from "@clerk/express"; // ✅ correct import
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudnary.js";
import creationsRouter from "./routes/userRoutes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://ai-verse-three.vercel.app"],
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());

// ✅ Apply Clerk middleware directly (no redefinition)
app.use(clerkMiddleware());

// Debug log
app.use((req, res, next) => {
  console.log("📩 Incoming:", req.method, req.url);
  next();
});

app.get("/", (req, res) => res.send("🚀 Server is live and running!"));

// Routes
app.use("/api/ai", requireAuth(), aiRouter);
app.use("/api/creations", creationsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server with Cloudinary
(async () => {
  try {
    await connectCloudinary();
    console.log("✅ Cloudinary connected successfully!");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`✅ Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
})();
