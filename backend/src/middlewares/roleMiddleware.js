const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Pastikan pengguna sudah terautentikasi
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Anda belum melakukan autentikasi.",
      });
    }

    // Periksa apakah role pengguna diizinkan
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk mengakses fitur ini.",
      });
    }

    // Lanjutkan jika role sesuai
    next();
  };
};

module.exports = { authorizeRoles };
