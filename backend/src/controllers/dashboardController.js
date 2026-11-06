const getAdminDashboard = async (req, res) => {
  try {
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
          totalInventaris: 0,
          inventarisBaik: 0,
          inventarisRusak: 0,
          laporanKerusakan: 0,
          perbaikanBerlangsung: 0,
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
