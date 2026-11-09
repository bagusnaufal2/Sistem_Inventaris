const { db } = require("../config/database");

// GET /api/laporan/statistik — agregasi untuk halaman Laporan & Statistik.
const getStatistik = async (req, res) => {
  try {
    const [[ringkasan]] = await db.execute(`
      SELECT
        (SELECT COUNT(*) FROM inventaris) AS totalInventaris,
        (SELECT COUNT(*) FROM inventaris WHERE kondisi = 'Baik') AS inventarisBaik,
        (SELECT COUNT(*) FROM inventaris WHERE kondisi IN ('Rusak Ringan', 'Rusak')) AS inventarisRusak,
        (SELECT COUNT(*) FROM inventaris WHERE status = 'Dalam Perbaikan') AS dalamPerbaikan,
        (SELECT COUNT(*) FROM laporan_kerusakan WHERE status = 'Menunggu') AS laporanMenunggu,
        (SELECT COUNT(*) FROM perbaikan WHERE status = 'Berlangsung') AS perbaikanBerlangsung,
        (SELECT COALESCE(SUM(biaya), 0) FROM perbaikan) AS totalBiayaPerbaikan
    `);

    const [perKategori] = await db.execute(`
      SELECT k.nama AS kategori, COUNT(i.id) AS jumlah
      FROM kategori_barang k
      LEFT JOIN inventaris i ON i.kategori_id = k.id
      GROUP BY k.id, k.nama
      ORDER BY jumlah DESC
    `);

    // Tren laporan kerusakan 6 bulan terakhir (termasuk bulan berjalan).
    const [trenRows] = await db.execute(`
      SELECT DATE_FORMAT(tanggal_laporan, '%Y-%m') AS bulanKey,
             DATE_FORMAT(tanggal_laporan, '%b') AS bulan,
             COUNT(*) AS laporan
      FROM laporan_kerusakan
      WHERE tanggal_laporan >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)
      GROUP BY bulanKey, bulan
      ORDER BY bulanKey ASC
    `);

    // Lengkapi bulan yang tidak ada laporannya dengan 0.
    const tren = [];
    const now = new Date();
    const namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const found = trenRows.find((r) => r.bulanKey === key);
      tren.push({ bulan: namaBulan[d.getMonth()], laporan: found ? Number(found.laporan) : 0 });
    }

    return res.status(200).json({
      success: true,
      message: "Statistik berhasil diambil.",
      data: {
        ringkasan: {
          totalInventaris: Number(ringkasan.totalInventaris),
          inventarisBaik: Number(ringkasan.inventarisBaik),
          inventarisRusak: Number(ringkasan.inventarisRusak),
          dalamPerbaikan: Number(ringkasan.dalamPerbaikan),
          laporanMenunggu: Number(ringkasan.laporanMenunggu),
          perbaikanBerlangsung: Number(ringkasan.perbaikanBerlangsung),
          totalBiayaPerbaikan: Number(ringkasan.totalBiayaPerbaikan),
        },
        perKategori: perKategori.map((r) => ({ kategori: r.kategori, jumlah: Number(r.jumlah) })),
        tren,
      },
    });
  } catch (error) {
    console.error("Statistik error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil statistik." });
  }
};

module.exports = { getStatistik };
