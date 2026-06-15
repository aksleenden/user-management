require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connectToDatabase } = require("../src/db");
const authRoutes = require("../src/routes/auth");
const usersRoutes = require("../src/routes/users");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// IMPORTANT: ensure the DB connection is ready before handling each request -
// serverless functions don't have a persistent "startup" phase like app.listen().
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Export the app instead of calling app.listen() - Vercel handles the listening.
module.exports = app;
