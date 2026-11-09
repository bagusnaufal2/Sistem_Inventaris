const express = require("express");
const router = express.Router();

const {
  listPerbaikan,
  detailPerbaikan,
  createPerbaikan,
  updatePerbaikan,
  updateStatusPerbaikan,
  deletePerbaikan,
} = require("../controllers/perbaikanController");

const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.get("/", verifyToken, listPerbaikan);
router.get("/:id", verifyToken, detailPerbaikan);
router.post("/", verifyToken, authorizeRoles("ADMIN"), createPerbaikan);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updatePerbaikan);
router.patch("/:id/status", verifyToken, authorizeRoles("ADMIN"), updateStatusPerbaikan);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deletePerbaikan);

module.exports = router;
