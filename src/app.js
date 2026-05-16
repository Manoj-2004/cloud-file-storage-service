const express = require("express");
const authRoutes = require("./modules/auth/auth.routes");
const fileRoutes = require("./modules/files/file.routes");
const authMiddleware = require("./middleware/auth.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/api/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

app.use(errorMiddleware);

module.exports = app;