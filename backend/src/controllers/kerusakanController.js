const { z } = require("zod");
const { db } = require("../config/database");
const { parseListQuery, listResponse } = require("../utils/pagination");
const { validateBody } = require("../utils/validate");
const { catatLog } = require("../utils/logAktivitas");

const STATUS = ["Menunggu", "Diproses", "Selesai"];

// Buat laporan baru: kode KR-xxx dibuat otomatis berurutan.
const laporanSchema = z.object({
  inventarisId: z.coerce.number().int().positive().optional().nullable(),
  barang: z.string().trim().min(1, "Nama barang wajib diisi.").max(150),
  pelapor: z.string().trim().min(1, "Nama pelapor wajib diisi.").max(100),
  deskripsi: z.string().trim().min(1, "Deskripsi kerusakan wajib diisi.").max(1000),
  tanggalLaporan: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal harus berformat YYYY-MM-DD.")
    .optional(),
});

// Ubah status laporan saja (dipakai admin saat menindaklanjuti).
const statusSchema = z.object({
  status: z.enum(STATUS, { message: "Status tidak valid." }),
});

const SELECT_LIST = `
  SELECT l.id, l.kode, l.inventaris_id AS inventarisId, l.barang, l.pelapor,
         l.deskripsi, l.status,
         DATE_FORMAT(l.tanggal_laporan, '%Y-%m-%d') AS tanggalLaporan,
         l.created_at AS dibuatPada, l.updated_at AS diubahPada
  FROM laporan_kerusakan l
`;

// GET /api/kerusakan — list + filter status + search
const listKerusakan = async (req, res) => {
  try {
    const { page, limit, offset, q } = parseListQuery(req.query);
    const status = STATUS.includes(req.query.status) ? req.query.status : "";

    const clauses = [];
    const params = [];
    if (q) {
      clauses.push("(l.barang LIKE ? OR l.pelapor LIKE ? OR l.kode LIKE ?)");
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (status) { clauses.push("l.status = ?"); params.push(status); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

    const [rows] = await db.execute(
      `${SELECT_LIST} ${where} ORDER BY l.tanggal_laporan DESC, l.id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [total] = await db.execute(
      `SELECT COUNT(*) AS n FROM laporan_kerusakan l ${where}`,
      params
    );
    return listResponse(res, rows, total[0].n, { page, limit });
  } catch (error) {
    console.error("List kerusakan error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil data laporan kerusakan." });
  }
};

// GET /api/kerusakan/:id
const detailKerusakan = async (req, res) => {
  try {
    const [rows] = await db.execute(`${SELECT_LIST} WHERE l.id = ? LIMIT 1`, [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Laporan tidak ditemukan." });
    }
    return res.status(200).json({ success: true, message: "Laporan ditemukan.", data: rows[0] });
  } catch (error) {
    console.error("Detail kerusakan error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil detail laporan." });
  }
};

// POST /api/kerusakan (ADMIN)
const createKerusakan = async (req, res) => {
  const data = validateBody(laporanSchema, req, res);
  if (!data) return;
  try {
    const [maxRow] = await db.execute(
      "SELECT MAX(CAST(SUBSTRING(kode, 4) AS UNSIGNED)) AS n FROM laporan_kerusakan"
    );
    const kode = `KR-${String((maxRow[0].n || 0) + 1).padStart(3, "0")}`;
    const tanggal = data.tanggalLaporan || new Date().toISOString().slice(0, 10);

    const [result] = await db.execute(
      `INSERT INTO laporan_kerusakan (kode, inventaris_id, barang, pelapor, deskripsi, status, tanggal_laporan)
       VALUES (?, ?, ?, ?, ?, 'Menunggu', ?)`,
      [kode, data.inventarisId || null, data.barang, data.pelapor, data.deskripsi, tanggal]
    );
    await catatLog(req, "Lapor Kerusakan", `Melaporkan kerusakan ${data.barang} (${kode}).`);
    return res.status(201).json({
      success: true,
      message: "Laporan kerusakan berhasil dibuat.",
      data: { id: result.insertId, kode, ...data, status: "Menunggu", tanggalLaporan: tanggal },
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ success: false, message: "Barang inventaris tidak ditemukan." });
    }
    console.error("Create kerusakan error:", error);
    return res.status(500).json({ success: false, message: "Gagal membuat laporan kerusakan." });
  }
};

// PATCH /api/kerusakan/:id/status (ADMIN) — ubah status laporan
const updateStatusKerusakan = async (req, res) => {
  const data = validateBody(statusSchema, req, res);
  if (!data) return;
  try {
    const [rows] = await db.execute("SELECT kode, barang FROM laporan_kerusakan WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Laporan tidak ditemukan." });
    }
    await db.execute("UPDATE laporan_kerusakan SET status = ? WHERE id = ?", [data.status, req.params.id]);
    await catatLog(req, "Ubah Status Laporan", `Status laporan ${rows[0].kode} (${rows[0].barang}) diubah menjadi ${data.status}.`);
    return res.status(200).json({
      success: true,
      message: "Status laporan berhasil diubah.",
      data: { id: Number(req.params.id), kode: rows[0].kode, status: data.status },
    });
  } catch (error) {
    console.error("Update status kerusakan error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengubah status laporan." });
  }
};

// DELETE /api/kerusakan/:id (ADMIN)
const deleteKerusakan = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT kode, barang FROM laporan_kerusakan WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Laporan tidak ditemukan." });
    }
    await db.execute("DELETE FROM laporan_kerusakan WHERE id = ?", [req.params.id]);
    await catatLog(req, "Hapus Laporan", `Menghapus laporan ${rows[0].kode} (${rows[0].barang}).`);
    return res.status(200).json({ success: true, message: "Laporan berhasil dihapus." });
  } catch (error) {
    console.error("Delete kerusakan error:", error);
    return res.status(500).json({ success: false, message: "Gagal menghapus laporan." });
  }
};

module.exports = { listKerusakan, detailKerusakan, createKerusakan, updateStatusKerusakan, deleteKerusakan };
