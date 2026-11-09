const { z } = require("zod");
const { db } = require("../config/database");
const { parseListQuery, listResponse } = require("../utils/pagination");
const { validateBody } = require("../utils/validate");
const { catatLog } = require("../utils/logAktivitas");

const KONDISI = ["Baik", "Rusak Ringan", "Rusak"];
const STATUS = ["Tersedia", "Dipinjam", "Dalam Perbaikan"];

const inventarisSchema = z.object({
  nama: z.string().trim().min(1, "Nama barang wajib diisi.").max(150),
  kategoriId: z.coerce.number().int("Kategori tidak valid.").positive("Kategori wajib dipilih."),
  lokasiId: z.coerce.number().int("Lokasi tidak valid.").positive("Lokasi wajib dipilih."),
  kondisi: z.enum(KONDISI, { message: "Kondisi tidak valid." }),
  status: z.enum(STATUS, { message: "Status tidak valid." }),
  deskripsi: z.string().trim().max(500).optional().nullable(),
});

const SELECT_LIST = `
  SELECT i.id, i.nama,
         i.kategori_id AS kategoriId, k.nama AS kategori,
         i.lokasi_id AS lokasiId, l.nama AS lokasi,
         i.kondisi, i.status, i.deskripsi,
         i.created_at AS dibuatPada, i.updated_at AS diubahPada
  FROM inventaris i
  JOIN kategori_barang k ON k.id = i.kategori_id
  JOIN lokasi l ON l.id = i.lokasi_id
`;

// GET /api/inventaris — list + filter + search
const listInventaris = async (req, res) => {
  try {
    const { page, limit, offset, q } = parseListQuery(req.query);
    const kondisi = KONDISI.includes(req.query.kondisi) ? req.query.kondisi : "";
    const status = STATUS.includes(req.query.status) ? req.query.status : "";
    const kategoriId = /^\d+$/.test(req.query.kategoriId || "") ? req.query.kategoriId : "";
    const lokasiId = /^\d+$/.test(req.query.lokasiId || "") ? req.query.lokasiId : "";

    const clauses = [];
    const params = [];
    if (q) { clauses.push("i.nama LIKE ?"); params.push(`%${q}%`); }
    if (kondisi) { clauses.push("i.kondisi = ?"); params.push(kondisi); }
    if (status) { clauses.push("i.status = ?"); params.push(status); }
    if (kategoriId) { clauses.push("i.kategori_id = ?"); params.push(kategoriId); }
    if (lokasiId) { clauses.push("i.lokasi_id = ?"); params.push(lokasiId); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

    const [rows] = await db.execute(
      `${SELECT_LIST} ${where} ORDER BY i.nama ASC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [total] = await db.execute(
      `SELECT COUNT(*) AS n FROM inventaris i ${where}`,
      params
    );
    return listResponse(res, rows, total[0].n, { page, limit });
  } catch (error) {
    console.error("List inventaris error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil data inventaris." });
  }
};

// GET /api/inventaris/:id
const detailInventaris = async (req, res) => {
  try {
    const [rows] = await db.execute(`${SELECT_LIST} WHERE i.id = ? LIMIT 1`, [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Barang tidak ditemukan." });
    }
    return res.status(200).json({ success: true, message: "Barang ditemukan.", data: rows[0] });
  } catch (error) {
    console.error("Detail inventaris error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil detail barang." });
  }
};

// POST /api/inventaris (ADMIN)
const createInventaris = async (req, res) => {
  const data = validateBody(inventarisSchema, req, res);
  if (!data) return;
  try {
    const [result] = await db.execute(
      "INSERT INTO inventaris (nama, kategori_id, lokasi_id, kondisi, status, deskripsi) VALUES (?, ?, ?, ?, ?, ?)",
      [data.nama, data.kategoriId, data.lokasiId, data.kondisi, data.status, data.deskripsi || null]
    );
    await catatLog(req, "Tambah Barang", `Menambahkan barang "${data.nama}".`);
    return res.status(201).json({
      success: true,
      message: "Barang berhasil ditambahkan.",
      data: { id: result.insertId, ...data },
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ success: false, message: "Kategori atau lokasi tidak ditemukan." });
    }
    console.error("Create inventaris error:", error);
    return res.status(500).json({ success: false, message: "Gagal menambahkan barang." });
  }
};

// PUT /api/inventaris/:id (ADMIN)
const updateInventaris = async (req, res) => {
  const data = validateBody(inventarisSchema, req, res);
  if (!data) return;
  try {
    const [result] = await db.execute(
      "UPDATE inventaris SET nama = ?, kategori_id = ?, lokasi_id = ?, kondisi = ?, status = ?, deskripsi = ? WHERE id = ?",
      [data.nama, data.kategoriId, data.lokasiId, data.kondisi, data.status, data.deskripsi || null, req.params.id]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Barang tidak ditemukan." });
    }
    await catatLog(req, "Ubah Barang", `Mengubah barang "${data.nama}".`);
    return res.status(200).json({
      success: true,
      message: "Barang berhasil diubah.",
      data: { id: Number(req.params.id), ...data },
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ success: false, message: "Kategori atau lokasi tidak ditemukan." });
    }
    console.error("Update inventaris error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengubah barang." });
  }
};

// DELETE /api/inventaris/:id (ADMIN)
const deleteInventaris = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT nama FROM inventaris WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Barang tidak ditemukan." });
    }
    await db.execute("DELETE FROM inventaris WHERE id = ?", [req.params.id]);
    await catatLog(req, "Hapus Barang", `Menghapus barang "${rows[0].nama}".`);
    return res.status(200).json({ success: true, message: "Barang berhasil dihapus." });
  } catch (error) {
    console.error("Delete inventaris error:", error);
    return res.status(500).json({ success: false, message: "Gagal menghapus barang." });
  }
};

module.exports = { listInventaris, detailInventaris, createInventaris, updateInventaris, deleteInventaris };
