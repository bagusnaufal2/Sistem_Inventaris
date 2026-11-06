const express = require("express");
const router = express.Router();

const {
  login,
  getMe,
} = require("../controllers/authController");

const {
  verifyToken,
} = require("../middlewares/authMiddleware");

// Login
router.post("/login", login);

// Ambil data pengguna yang sedang login
router.get("/me", verifyToken, getMe);

module.exports = router;
