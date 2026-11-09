const { z } = require("zod");
const { db } = require("../config/database");
const { parseListQuery, listResponse } = require("../utils/pagination");
const { validateBody } = require("../utils/validate");
const { catatLog } = require("../utils/logAktivitas");

const lokasiSchema = z.object({
  nama: z.string().trim().min(1, "Nama ruangan wajib diisi.").max(100),
  gedung: z.string().trim().max(100).optional().nullable(),
  penanggungJawab: z.string().trim().max(100).optional().nullable(),
});

// GET /api/lokasi — list + jumlah barang per ruangan
const listLokasi = async (req, res) => {
  try {
    const { page, limit, offset, q } = parseListQuery(req.query);
    const where = q ? "WHERE l.nama LIKE ? OR l.gedung LIKE ? OR l.penanggung_jawab LIKE ?" : "";
    const params = q ? [`%${q}%`, `%${q}%`, `%${q}%`] : [];

    const [rows] = await db.execute(
      `SELECT l.id, l.nama, l.gedung, l.penanggung_jawab AS penanggungJawab,
              COUNT(i.id) AS jumlahBarang,
              l.created_at AS dibuatPada, l.updated_at AS diubahPada
       FROM lokasi l
       LEFT JOIN inventaris i ON i.lokasi_id = l.id
       ${where}
       GROUP BY l.id, l.nama, l.gedung, l.penanggung_jawab, l.created_at, l.updated_at
       ORDER BY l.nama ASC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [total] = await db.execute(
      `SELECT COUNT(*) AS n FROM lokasi l ${where}`,
      params
    );
    return listResponse(res, rows, total[0].n, { page, limit });
  } catch (error) {
    console.error("List lokasi error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil data lokasi." });
  }
};

// GET /api/lokasi/:id
const detailLokasi = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT l.id, l.nama, l.gedung, l.penanggung_jawab AS penanggungJawab,
              COUNT(i.id) AS jumlahBarang
       FROM lokasi l
       LEFT JOIN inventaris i ON i.lokasi_id = l.id
       WHERE l.id = ? GROUP BY l.id`,
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Ruangan tidak ditemukan." });
    }
    return res.status(200).json({ success: true, message: "Ruangan ditemukan.", data: rows[0] });
  } catch (error) {
    console.error("Detail lokasi error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil detail ruangan." });
  }
};

// POST /api/lokasi (ADMIN)
const createLokasi = async (req, res) => {
  const data = validateBody(lokasiSchema, req, res);
  if (!data) return;
  try {
    const [result] = await db.execute(
      "INSERT INTO lokasi (nama, gedung, penanggung_jawab) VALUES (?, ?, ?)",
      [data.nama, data.gedung || "", data.penanggungJawab || ""]
    );
    await catatLog(req, "Tambah Ruangan", `Menambahkan ruangan "${data.nama}".`);
    return res.status(201).json({
      success: true,
      message: "Ruangan berhasil ditambahkan.",
      data: { id: result.insertId, ...data },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "Nama ruangan sudah dipakai." });
    }
    console.error("Create lokasi error:", error);
    return res.status(500).json({ success: false, message: "Gagal menambahkan ruangan." });
  }
};

// PUT /api/lokasi/:id (ADMIN)
const updateLokasi = async (req, res) => {
  const data = validateBody(lokasiSchema, req, res);
  if (!data) return;
  try {
    const [result] = await db.execute(
      "UPDATE lokasi SET nama = ?, gedung = ?, penanggung_jawab = ? WHERE id = ?",
      [data.nama, data.gedung || "", data.penanggungJawab || "", req.params.id]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Ruangan tidak ditemukan." });
    }
    await catatLog(req, "Ubah Ruangan", `Mengubah ruangan "${data.nama}".`);
    return res.status(200).json({
      success: true,
      message: "Ruangan berhasil diubah.",
      data: { id: Number(req.params.id), ...data },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "Nama ruangan sudah dipakai." });
    }
    console.error("Update lokasi error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengubah ruangan." });
  }
};

// DELETE /api/lokasi/:id (ADMIN)
const deleteLokasi = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT nama FROM lokasi WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Ruangan tidak ditemukan." });
    }
    await db.execute("DELETE FROM lokasi WHERE id = ?", [req.params.id]);
    await catatLog(req, "Hapus Ruangan", `Menghapus ruangan "${rows[0].nama}".`);
    return res.status(200).json({ success: true, message: "Ruangan berhasil dihapus." });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        success: false,
        message: "Ruangan masih dipakai oleh barang inventaris, tidak bisa dihapus.",
      });
    }
    console.error("Delete lokasi error:", error);
    return res.status(500).json({ success: false, message: "Gagal menghapus ruangan." });
  }
};

module.exports = { listLokasi, detailLokasi, createLokasi, updateLokasi, deleteLokasi };
