const express = require("express");
const router = express.Router();

const {
  listKerusakan,
  detailKerusakan,
  createKerusakan,
  updateStatusKerusakan,
  deleteKerusakan,
} = require("../controllers/kerusakanController");

const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.get("/", verifyToken, listKerusakan);
router.get("/:id", verifyToken, detailKerusakan);
router.post("/", verifyToken, authorizeRoles("ADMIN"), createKerusakan);
router.patch("/:id/status", verifyToken, authorizeRoles("ADMIN"), updateStatusKerusakan);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteKerusakan);

module.exports = router;
