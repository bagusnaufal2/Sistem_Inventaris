// Helper pagination & pencarian untuk endpoint list.
// Pakai: const { page, limit, offset, q } = parseListQuery(req.query);
const parseListQuery = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const offset = (page - 1) * limit;
  const q = typeof query.q === "string" ? query.q.trim() : "";
  return { page, limit, offset, q };
};

// Bentuk respons list yang konsisten: { success, message, data, pagination }
const listResponse = (res, rows, total, { page, limit }, message = "Data berhasil diambil.") => {
  return res.status(200).json({
    success: true,
    message,
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
};

module.exports = { parseListQuery, listResponse };
