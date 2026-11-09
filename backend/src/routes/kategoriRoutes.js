const express = require("express");
const router = express.Router();

const {
  listKategori,
  detailKategori,
  createKategori,
  updateKategori,
  deleteKategori,
} = require("../controllers/kategoriController");

const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.get("/", verifyToken, listKategori);
router.get("/:id", verifyToken, detailKategori);
router.post("/", verifyToken, authorizeRoles("ADMIN"), createKategori);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateKategori);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteKategori);

module.exports = router;
