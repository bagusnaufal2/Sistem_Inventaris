// Mencatat aktivitas ke tabel log_aktivitas (best-effort: gagal catat tidak boleh
// menggagalkan aksi utamanya). Nama pengguna diambil dari tabel users bila ada,
// bila tidak, pakai email dari token.
const { db } = require("../config/database");

const catatLog = async (req, aksi, detail) => {
  try {
    let userId = req.user?.id || null;
    let pengguna = req.user?.email || "Sistem";

    if (userId) {
      const [rows] = await db.execute("SELECT name FROM users WHERE id = ? LIMIT 1", [userId]);
      if (rows.length && rows[0].name) pengguna = rows[0].name;
    }

    await db.execute(
      "INSERT INTO log_aktivitas (user_id, pengguna, aksi, detail) VALUES (?, ?, ?, ?)",
      [userId, pengguna, aksi, detail || null]
    );
  } catch (err) {
    console.error("Gagal mencatat log aktivitas:", err.message);
  }
};

module.exports = { catatLog };
