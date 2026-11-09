// Validasi body request dengan zod.
// validateBody(schema, req, res) -> data yang sudah tervalidasi, atau null
// (dan sudah mengirim respons 400 bila tidak valid).
const validateBody = (schema, req, res) => {
  const result = schema.safeParse(req.body);
  if (result.success) return result.data;

  const issues = result.error?.issues || result.error?.errors || [];
  const pesan = issues.length
    ? issues.map((i) => i.message).join("; ")
    : "Data yang dikirim tidak valid.";
  res.status(400).json({ success: false, message: pesan });
  return null;
};

// Validasi query (untuk filter enum di query string).
const validateQuery = (schema, req, res) => {
  const result = schema.safeParse(req.query);
  if (result.success) return result.data;

  const issues = result.error?.issues || result.error?.errors || [];
  const pesan = issues.length
    ? issues.map((i) => i.message).join("; ")
    : "Parameter tidak valid.";
  res.status(400).json({ success: false, message: pesan });
  return null;
};

module.exports = { validateBody, validateQuery };
