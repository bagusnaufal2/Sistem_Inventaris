const express = require("express");
const router = express.Router();

const {
  listInventaris,
  detailInventaris,
  createInventaris,
  updateInventaris,
  deleteInventaris,
} = require("../controllers/inventarisController");

const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.get("/", verifyToken, listInventaris);
router.get("/:id", verifyToken, detailInventaris);
router.post("/", verifyToken, authorizeRoles("ADMIN"), createInventaris);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateInventaris);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteInventaris);

module.exports = router;
