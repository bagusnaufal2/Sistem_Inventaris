const { z } = require("zod");
const { db } = require("../config/database");
const { parseListQuery, listResponse } = require("../utils/pagination");
const { validateBody } = require("../utils/validate");
const { catatLog } = require("../utils/logAktivitas");

const kategoriSchema = z.object({
  nama: z.string().trim().min(1, "Nama kategori wajib diisi.").max(100),
  deskripsi: z.string().trim().max(500).optional().nullable(),
});

// GET /api/kategori — list + jumlah barang per kategori
const listKategori = async (req, res) => {
  try {
    const { page, limit, offset, q } = parseListQuery(req.query);
    const where = q ? "WHERE k.nama LIKE ? OR k.deskripsi LIKE ?" : "";
    const params = q ? [`%${q}%`, `%${q}%`] : [];

    const [rows] = await db.execute(
      `SELECT k.id, k.nama, k.deskripsi, COUNT(i.id) AS jumlahBarang,
              k.created_at AS dibuatPada, k.updated_at AS diubahPada
       FROM kategori_barang k
       LEFT JOIN inventaris i ON i.kategori_id = k.id
       ${where}
       GROUP BY k.id, k.nama, k.deskripsi, k.created_at, k.updated_at
       ORDER BY k.nama ASC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [total] = await db.execute(
      `SELECT COUNT(*) AS n FROM kategori_barang k ${where}`,
      params
    );
    return listResponse(res, rows, total[0].n, { page, limit });
  } catch (error) {
    console.error("List kategori error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil data kategori." });
  }
};

// GET /api/kategori/:id
const detailKategori = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT k.id, k.nama, k.deskripsi, COUNT(i.id) AS jumlahBarang
       FROM kategori_barang k
       LEFT JOIN inventaris i ON i.kategori_id = k.id
       WHERE k.id = ? GROUP BY k.id`,
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan." });
    }
    return res.status(200).json({ success: true, message: "Kategori ditemukan.", data: rows[0] });
  } catch (error) {
    console.error("Detail kategori error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil detail kategori." });
  }
};

// POST /api/kategori (ADMIN)
const createKategori = async (req, res) => {
  const data = validateBody(kategoriSchema, req, res);
  if (!data) return;
  try {
    const [result] = await db.execute(
      "INSERT INTO kategori_barang (nama, deskripsi) VALUES (?, ?)",
      [data.nama, data.deskripsi || null]
    );
    await catatLog(req, "Tambah Kategori", `Menambahkan kategori "${data.nama}".`);
    return res.status(201).json({
      success: true,
      message: "Kategori berhasil ditambahkan.",
      data: { id: result.insertId, ...data },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "Nama kategori sudah dipakai." });
    }
    console.error("Create kategori error:", error);
    return res.status(500).json({ success: false, message: "Gagal menambahkan kategori." });
  }
};

// PUT /api/kategori/:id (ADMIN)
const updateKategori = async (req, res) => {
  const data = validateBody(kategoriSchema, req, res);
  if (!data) return;
  try {
    const [result] = await db.execute(
      "UPDATE kategori_barang SET nama = ?, deskripsi = ? WHERE id = ?",
      [data.nama, data.deskripsi || null, req.params.id]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan." });
    }
    await catatLog(req, "Ubah Kategori", `Mengubah kategori "${data.nama}".`);
    return res.status(200).json({
      success: true,
      message: "Kategori berhasil diubah.",
      data: { id: Number(req.params.id), ...data },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "Nama kategori sudah dipakai." });
    }
    console.error("Update kategori error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengubah kategori." });
  }
};

// DELETE /api/kategori/:id (ADMIN)
const deleteKategori = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT nama FROM kategori_barang WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan." });
    }
    await db.execute("DELETE FROM kategori_barang WHERE id = ?", [req.params.id]);
    await catatLog(req, "Hapus Kategori", `Menghapus kategori "${rows[0].nama}".`);
    return res.status(200).json({ success: true, message: "Kategori berhasil dihapus." });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        success: false,
        message: "Kategori masih dipakai oleh barang inventaris, tidak bisa dihapus.",
      });
    }
    console.error("Delete kategori error:", error);
    return res.status(500).json({ success: false, message: "Gagal menghapus kategori." });
  }
};

module.exports = { listKategori, detailKategori, createKategori, updateKategori, deleteKategori };
