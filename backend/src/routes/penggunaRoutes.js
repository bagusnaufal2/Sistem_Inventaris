const express = require("express");
const router = express.Router();

const {
  listPengguna,
  detailPengguna,
  createPengguna,
  updatePengguna,
  deletePengguna,
} = require("../controllers/penggunaController");

const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// Manajemen pengguna khusus ADMIN.
router.use(verifyToken, authorizeRoles("ADMIN"));

router.get("/", listPengguna);
router.get("/:id", detailPengguna);
router.post("/", createPengguna);
router.put("/:id", updatePengguna);
router.delete("/:id", deletePengguna);

module.exports = router;
