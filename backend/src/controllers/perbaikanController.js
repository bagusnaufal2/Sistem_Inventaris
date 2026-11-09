const { z } = require("zod");
const { db } = require("../config/database");
const { parseListQuery, listResponse } = require("../utils/pagination");
const { validateBody } = require("../utils/validate");
const { catatLog } = require("../utils/logAktivitas");

const STATUS = ["Berlangsung", "Selesai", "Menunggu Suku Cadang"];

const tanggal = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal harus berformat YYYY-MM-DD.");

const perbaikanSchema = z.object({
  laporanId: z.coerce.number().int().positive().optional().nullable(),
  inventarisId: z.coerce.number().int().positive().optional().nullable(),
  barang: z.string().trim().min(1, "Nama barang wajib diisi.").max(150),
  teknisi: z.string().trim().min(1, "Nama teknisi wajib diisi.").max(150),
  tanggalMulai: tanggal,
  estimasiSelesai: tanggal.optional().nullable(),
  status: z.enum(STATUS, { message: "Status tidak valid." }),
  biaya: z.coerce.number().int("Biaya harus berupa angka.").min(0, "Biaya tidak boleh negatif."),
});

const statusSchema = z.object({
  status: z.enum(STATUS, { message: "Status tidak valid." }),
});

const SELECT_LIST = `
  SELECT p.id, p.laporan_id AS laporanId, l.kode AS kodeLaporan,
         p.inventaris_id AS inventarisId, p.barang, p.teknisi,
         DATE_FORMAT(p.tanggal_mulai, '%Y-%m-%d') AS tanggalMulai,
         DATE_FORMAT(p.estimasi_selesai, '%Y-%m-%d') AS estimasiSelesai,
         p.status, p.biaya,
         p.created_at AS dibuatPada, p.updated_at AS diubahPada
  FROM perbaikan p
  LEFT JOIN laporan_kerusakan l ON l.id = p.laporan_id
`;

// GET /api/perbaikan — list + filter status + search
const listPerbaikan = async (req, res) => {
  try {
    const { page, limit, offset, q } = parseListQuery(req.query);
    const status = STATUS.includes(req.query.status) ? req.query.status : "";

    const clauses = [];
    const params = [];
    if (q) {
      clauses.push("(p.barang LIKE ? OR p.teknisi LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (status) { clauses.push("p.status = ?"); params.push(status); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

    const [rows] = await db.execute(
      `${SELECT_LIST} ${where} ORDER BY p.tanggal_mulai DESC, p.id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [total] = await db.execute(
      `SELECT COUNT(*) AS n FROM perbaikan p ${where}`,
      params
    );
    return listResponse(res, rows, total[0].n, { page, limit });
  } catch (error) {
    console.error("List perbaikan error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil data perbaikan." });
  }
};

// GET /api/perbaikan/:id
const detailPerbaikan = async (req, res) => {
  try {
    const [rows] = await db.execute(`${SELECT_LIST} WHERE p.id = ? LIMIT 1`, [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Data perbaikan tidak ditemukan." });
    }
    return res.status(200).json({ success: true, message: "Data perbaikan ditemukan.", data: rows[0] });
  } catch (error) {
    console.error("Detail perbaikan error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil detail perbaikan." });
  }
};

// POST /api/perbaikan (ADMIN)
const createPerbaikan = async (req, res) => {
  const data = validateBody(perbaikanSchema, req, res);
  if (!data) return;
  try {
    const [result] = await db.execute(
      `INSERT INTO perbaikan (laporan_id, inventaris_id, barang, teknisi, tanggal_mulai, estimasi_selesai, status, biaya)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.laporanId || null, data.inventarisId || null, data.barang, data.teknisi,
       data.tanggalMulai, data.estimasiSelesai || null, data.status, data.biaya]
    );
    await catatLog(req, "Mulai Perbaikan", `Memulai perbaikan ${data.barang} oleh ${data.teknisi}.`);
    return res.status(201).json({
      success: true,
      message: "Data perbaikan berhasil ditambahkan.",
      data: { id: result.insertId, ...data },
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ success: false, message: "Laporan atau barang tidak ditemukan." });
    }
    console.error("Create perbaikan error:", error);
    return res.status(500).json({ success: false, message: "Gagal menambahkan data perbaikan." });
  }
};

// PUT /api/perbaikan/:id (ADMIN)
const updatePerbaikan = async (req, res) => {
  const data = validateBody(perbaikanSchema, req, res);
  if (!data) return;
  try {
    const [result] = await db.execute(
      `UPDATE perbaikan SET laporan_id = ?, inventaris_id = ?, barang = ?, teknisi = ?,
       tanggal_mulai = ?, estimasi_selesai = ?, status = ?, biaya = ? WHERE id = ?`,
      [data.laporanId || null, data.inventarisId || null, data.barang, data.teknisi,
       data.tanggalMulai, data.estimasiSelesai || null, data.status, data.biaya, req.params.id]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Data perbaikan tidak ditemukan." });
    }
    const aksi = data.status === "Selesai" ? "Selesaikan Perbaikan" : "Ubah Perbaikan";
    await catatLog(req, aksi, `Memperbarui perbaikan ${data.barang} (status: ${data.status}).`);
    return res.status(200).json({
      success: true,
      message: "Data perbaikan berhasil diubah.",
      data: { id: Number(req.params.id), ...data },
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ success: false, message: "Laporan atau barang tidak ditemukan." });
    }
    console.error("Update perbaikan error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengubah data perbaikan." });
  }
};

// PATCH /api/perbaikan/:id/status (ADMIN)
const updateStatusPerbaikan = async (req, res) => {
  const data = validateBody(statusSchema, req, res);
  if (!data) return;
  try {
    const [rows] = await db.execute("SELECT barang FROM perbaikan WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Data perbaikan tidak ditemukan." });
    }
    await db.execute("UPDATE perbaikan SET status = ? WHERE id = ?", [data.status, req.params.id]);
    const aksi = data.status === "Selesai" ? "Selesaikan Perbaikan" : "Ubah Status Perbaikan";
    await catatLog(req, aksi, `Status perbaikan ${rows[0].barang} diubah menjadi ${data.status}.`);
    return res.status(200).json({
      success: true,
      message: "Status perbaikan berhasil diubah.",
      data: { id: Number(req.params.id), status: data.status },
    });
  } catch (error) {
    console.error("Update status perbaikan error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengubah status perbaikan." });
  }
};

// DELETE /api/perbaikan/:id (ADMIN)
const deletePerbaikan = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT barang FROM perbaikan WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Data perbaikan tidak ditemukan." });
    }
    await db.execute("DELETE FROM perbaikan WHERE id = ?", [req.params.id]);
    await catatLog(req, "Hapus Perbaikan", `Menghapus data perbaikan ${rows[0].barang}.`);
    return res.status(200).json({ success: true, message: "Data perbaikan berhasil dihapus." });
  } catch (error) {
    console.error("Delete perbaikan error:", error);
    return res.status(500).json({ success: false, message: "Gagal menghapus data perbaikan." });
  }
};

module.exports = {
  listPerbaikan, detailPerbaikan, createPerbaikan,
  updatePerbaikan, updateStatusPerbaikan, deletePerbaikan,
};
