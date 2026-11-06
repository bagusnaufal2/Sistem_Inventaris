
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // Ambil token dari Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Token tidak ditemukan.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verifikasi token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan informasi pengguna ke request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kedaluwarsa.",
    });
  }
};

module.exports = { verifyToken };
