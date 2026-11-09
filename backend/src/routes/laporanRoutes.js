const express = require("express");
const router = express.Router();

const { getStatistik } = require("../controllers/laporanController");

const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/statistik", verifyToken, getStatistik);

module.exports = router;
