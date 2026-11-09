const { db } = require("../config/database");

// GET /api/dashboard/admin — angka dihitung dari tabel inventaris (bukan lagi 0).
const getAdminDashboard = async (req, res) => {
  try {
    const [[counts]] = await db.execute(`
      SELECT
        (SELECT COUNT(*) FROM inventaris) AS totalInventaris,
        (SELECT COUNT(*) FROM inventaris WHERE kondisi = 'Baik') AS inventarisBaik,
        (SELECT COUNT(*) FROM inventaris WHERE kondisi IN ('Rusak Ringan', 'Rusak')) AS inventarisRusak,
        (SELECT COUNT(*) FROM laporan_kerusakan WHERE status = 'Menunggu') AS laporanKerusakan,
        (SELECT COUNT(*) FROM perbaikan WHERE status = 'Berlangsung') AS perbaikanBerlangsung
    `);

    return res.status(200).json({
      success: true,
      message: "Dashboard Admin berhasil diakses.",
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
        },
        dashboard: {
          totalInventaris: Number(counts.totalInventaris),
          inventarisBaik: Number(counts.inventarisBaik),
          inventarisRusak: Number(counts.inventarisRusak),
          laporanKerusakan: Number(counts.laporanKerusakan),
          perbaikanBerlangsung: Number(counts.perbaikanBerlangsung),
        },
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data dashboard.",
    });
  }
};

module.exports = { getAdminDashboard };
