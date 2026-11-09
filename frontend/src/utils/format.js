// Helper format tampilan (tanggal, rupiah, label role).

// "2026-11-03" -> "03 Nov 2026"
export const formatTanggal = (value) => {
  if (!value) return "-";
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

// "2026-11-09T08:15:00.000Z" / "2026-11-09 08:15:00" -> "09 Nov 2026, 08:15"
// (diformat dengan zona waktu lokal browser pengguna)
export const formatTanggalWaktu = (value) => {
  if (!value) return "-";
  const d = new Date(typeof value === "string" ? value.replace(" ", "T") : value);
  if (Number.isNaN(d.getTime())) return value;
  const tanggal = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  const jam = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return `${tanggal}, ${jam}`;
};

// 150000 -> "Rp150.000"
export const formatRupiah = (value) => {
  const n = Number(value) || 0;
  return `Rp${n.toLocaleString("id-ID")}`;
};

// "Rp150.000" / "150000" -> 150000
export const parseRupiah = (value) => {
  if (typeof value === "number") return value;
  const n = parseInt(String(value || "").replace(/[^0-9]/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
};

// Role backend -> label tampilan
export const labelRole = (role) => {
  if (role === "ADMIN") return "Admin";
  if (role === "PETUGAS") return "Petugas";
  if (role === "GURU") return "Guru";
  if (role === "KEPALA_SEKOLAH") return "Kepala Sekolah";
  return role || "-";
};

// Pesan error API yang ramah (bahasa Indonesia).
export const pesanError = (err, pesanUmum = "Terjadi kesalahan. Silakan coba lagi.") => {
  return err?.response?.data?.message || pesanUmum;
};
