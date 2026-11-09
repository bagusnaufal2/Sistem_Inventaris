const { db } = require("../config/database");
const { parseListQuery, listResponse } = require("../utils/pagination");

// GET /api/log-aktivitas — riwayat aktivitas (hanya baca, ADMIN)
const listLog = async (req, res) => {
  try {
    const { page, limit, offset, q } = parseListQuery(req.query);

    const clauses = [];
    const params = [];
    if (q) {
      clauses.push("(pengguna LIKE ? OR aksi LIKE ? OR detail LIKE ?)");
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

    const [rows] = await db.execute(
      `SELECT id, user_id AS userId, pengguna, aksi, detail, created_at AS waktu
       FROM log_aktivitas ${where}
       ORDER BY created_at DESC, id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [total] = await db.execute(
      `SELECT COUNT(*) AS n FROM log_aktivitas ${where}`,
      params
    );
    return listResponse(res, rows, total[0].n, { page, limit });
  } catch (error) {
    console.error("List log error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil log aktivitas." });
  }
};

module.exports = { listLog };
