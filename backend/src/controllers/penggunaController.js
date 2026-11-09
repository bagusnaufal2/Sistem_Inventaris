const bcrypt = require("bcrypt");
const { z } = require("zod");
const { db } = require("../config/database");
const { parseListQuery, listResponse } = require("../utils/pagination");
const { validateBody } = require("../utils/validate");
const { catatLog } = require("../utils/logAktivitas");

const ROLES = ["ADMIN", "PETUGAS", "GURU", "KEPALA_SEKOLAH"];

const createSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi.").max(100),
  email: z.string().trim().email("Format email tidak valid.").max(100),
  password: z.string().min(8, "Password minimal 8 karakter.").max(100),
  role: z.enum(ROLES, { message: "Role tidak valid." }),
  isActive: z.boolean().optional().default(true),
});

const updateSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi.").max(100),
  email: z.string().trim().email("Format email tidak valid.").max(100),
  password: z.string().min(8, "Password minimal 8 karakter.").max(100).optional(),
  role: z.enum(ROLES, { message: "Role tidak valid." }),
  isActive: z.boolean(),
});

const SELECT_LIST = `
  SELECT id, name, email, role, is_active AS isActive,
         created_at AS dibuatPada, updated_at AS diubahPada
  FROM users
`;

// GET /api/pengguna (ADMIN)
const listPengguna = async (req, res) => {
  try {
    const { page, limit, offset, q } = parseListQuery(req.query);
    const role = ROLES.includes(req.query.role) ? req.query.role : "";

    const clauses = [];
    const params = [];
    if (q) {
      clauses.push("(name LIKE ? OR email LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (role) { clauses.push("role = ?"); params.push(role); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

    const [rows] = await db.execute(
      `${SELECT_LIST} ${where} ORDER BY name ASC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [total] = await db.execute(`SELECT COUNT(*) AS n FROM users ${where}`, params);
    return listResponse(res, rows, total[0].n, { page, limit });
  } catch (error) {
    console.error("List pengguna error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil data pengguna." });
  }
};

// GET /api/pengguna/:id (ADMIN)
const detailPengguna = async (req, res) => {
  try {
    const [rows] = await db.execute(`${SELECT_LIST} WHERE id = ? LIMIT 1`, [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
    }
    return res.status(200).json({ success: true, message: "Pengguna ditemukan.", data: rows[0] });
  } catch (error) {
    console.error("Detail pengguna error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil detail pengguna." });
  }
};

// POST /api/pengguna (ADMIN)
const createPengguna = async (req, res) => {
  const data = validateBody(createSchema, req, res);
  if (!data) return;
  try {
    const hashed = await bcrypt.hash(data.password, 12);
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)",
      [data.name, data.email, hashed, data.role, data.isActive ? 1 : 0]
    );
    await catatLog(req, "Tambah Pengguna", `Menambahkan pengguna "${data.name}" (${data.email}).`);
    return res.status(201).json({
      success: true,
      message: "Pengguna berhasil ditambahkan.",
      data: { id: result.insertId, name: data.name, email: data.email, role: data.role, isActive: data.isActive },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "Email sudah terdaftar." });
    }
    console.error("Create pengguna error:", error);
    return res.status(500).json({ success: false, message: "Gagal menambahkan pengguna." });
  }
};

// PUT /api/pengguna/:id (ADMIN) — password opsional: bila diisi, password direset.
const updatePengguna = async (req, res) => {
  const data = validateBody(updateSchema, req, res);
  if (!data) return;
  try {
    const targetId = Number(req.params.id);
    // Admin tidak boleh menonaktifkan akunnya sendiri.
    if (targetId === req.user.id && data.isActive === false) {
      return res.status(400).json({ success: false, message: "Anda tidak bisa menonaktifkan akun sendiri." });
    }

    let result;
    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 12);
      [result] = await db.execute(
        "UPDATE users SET name = ?, email = ?, password = ?, role = ?, is_active = ? WHERE id = ?",
        [data.name, data.email, hashed, data.role, data.isActive ? 1 : 0, targetId]
      );
    } else {
      [result] = await db.execute(
        "UPDATE users SET name = ?, email = ?, role = ?, is_active = ? WHERE id = ?",
        [data.name, data.email, data.role, data.isActive ? 1 : 0, targetId]
      );
    }
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
    }
    await catatLog(req, "Ubah Pengguna", `Mengubah pengguna "${data.name}" (${data.email}).`);
    return res.status(200).json({
      success: true,
      message: "Pengguna berhasil diubah.",
      data: { id: targetId, name: data.name, email: data.email, role: data.role, isActive: data.isActive },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "Email sudah terdaftar." });
    }
    console.error("Update pengguna error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengubah pengguna." });
  }
};

// DELETE /api/pengguna/:id (ADMIN)
const deletePengguna = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    if (targetId === req.user.id) {
      return res.status(400).json({ success: false, message: "Anda tidak bisa menghapus akun sendiri." });
    }
    const [rows] = await db.execute("SELECT name, email FROM users WHERE id = ? LIMIT 1", [targetId]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
    }
    await db.execute("DELETE FROM users WHERE id = ?", [targetId]);
    await catatLog(req, "Hapus Pengguna", `Menghapus pengguna "${rows[0].name}" (${rows[0].email}).`);
    return res.status(200).json({ success: true, message: "Pengguna berhasil dihapus." });
  } catch (error) {
    console.error("Delete pengguna error:", error);
    return res.status(500).json({ success: false, message: "Gagal menghapus pengguna." });
  }
};

module.exports = { listPengguna, detailPengguna, createPengguna, updatePengguna, deletePengguna };
