const express = require("express");
const router = express.Router();

const {
  listLokasi,
  detailLokasi,
  createLokasi,
  updateLokasi,
  deleteLokasi,
} = require("../controllers/lokasiController");

const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.get("/", verifyToken, listLokasi);
router.get("/:id", verifyToken, detailLokasi);
router.post("/", verifyToken, authorizeRoles("ADMIN"), createLokasi);
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateLokasi);
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteLokasi);

module.exports = router;
