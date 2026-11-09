const express = require("express");
const router = express.Router();

const { listLog } = require("../controllers/logController");

const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// Log aktivitas hanya baca, khusus ADMIN.
router.get("/", verifyToken, authorizeRoles("ADMIN"), listLog);

module.exports = router;
