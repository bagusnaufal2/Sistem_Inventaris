const express = require("express");
const router = express.Router();

const { getAdminDashboard } = require("../controllers/dashboardController");

const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// Dashboard khusus Admin
router.get(
  "/admin",
  verifyToken,
  authorizeRoles("ADMIN"),
  getAdminDashboard
);

module.exports = router;
