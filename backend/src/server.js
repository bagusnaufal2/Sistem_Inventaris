const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dashboardRoutes = require("./routes/dashboardRoutes");

const { testConnection } = require("./config/database");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware harus dipasang sebelum routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Sistem Inventaris SMPIT At-Taufiq berjalan!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server API berjalan dengan baik",
  });
});

const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Backend gagal dijalankan karena database bermasalah.");
    process.exit(1);
  }
};

startServer();
