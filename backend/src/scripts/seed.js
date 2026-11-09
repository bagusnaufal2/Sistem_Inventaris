// Seed data contoh modul inventaris (dipindah dari data contoh di halaman frontend).
// Cara pakai: node src/scripts/seed.js   (dari folder backend/)
// Idempotent: tiap tabel hanya diisi bila masih kosong.
// CATATAN: password akun contoh dibuat acak (tidak bisa dipakai login);
// pakai akun admin seed untuk masuk, dan atur password pengguna lewat menu Ubah Pengguna.
require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { db } = require("../config/database");

const randomHash = async () =>
  bcrypt.hash(crypto.randomBytes(24).toString("hex"), 12);

const seed = async () => {
  // ---- Pengguna contoh (selain akun admin seed) ----
  const [userCount] = await db.execute(
    "SELECT COUNT(*) AS n FROM users WHERE email <> 'admin@at-taufiq.sch.id'"
  );
  if (userCount[0].n === 0) {
    const pengguna = [
      ["Ahmad Fauzi", "ahmad.fauzi@at-taufiq.sch.id", "ADMIN", 1],
      ["Siti Aminah", "siti.aminah@at-taufiq.sch.id", "GURU", 1],
      ["Budi Santoso", "budi.santoso@at-taufiq.sch.id", "GURU", 1],
      ["Rina Wulandari", "rina.wulandari@at-taufiq.sch.id", "PETUGAS", 1],
      ["Dedi Kurniawan", "dedi.kurniawan@at-taufiq.sch.id", "PETUGAS", 1],
      ["Ratna Dewi", "ratna.dewi@at-taufiq.sch.id", "GURU", 0],
      ["Rizky Pratama", "rizky.pratama@at-taufiq.sch.id", "PETUGAS", 1],
      ["Maya Lestari", "maya.lestari@at-taufiq.sch.id", "GURU", 1],
    ];
    for (const [name, email, role, aktif] of pengguna) {
      await db.execute(
        "INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)",
        [name, email, await randomHash(), role, aktif]
      );
    }
    console.log("Seed OK: users contoh (8 akun)");
  }

  // ---- Kategori ----
  const [katCount] = await db.execute("SELECT COUNT(*) AS n FROM kategori_barang");
  if (katCount[0].n === 0) {
    const kategori = [
      ["Elektronik", "Perangkat elektronik seperti laptop, proyektor, printer, dan AC."],
      ["Furnitur", "Perabot sekolah seperti meja, kursi, lemari, dan rak."],
      ["Buku", "Buku paket, buku referensi, dan koleksi perpustakaan."],
      ["Alat Tulis", "Papan tulis, spidol, dan perlengkapan tulis kelas."],
      ["Olahraga", "Peralatan olahraga seperti bola, raket, dan matras."],
      ["Laboratorium", "Alat praktikum IPA seperti mikroskop dan tabung reaksi."],
    ];
    for (const [nama, deskripsi] of kategori) {
      await db.execute("INSERT INTO kategori_barang (nama, deskripsi) VALUES (?, ?)", [nama, deskripsi]);
    }
    console.log("Seed OK: kategori_barang (6)");
  }

  // ---- Lokasi ----
  const [lokCount] = await db.execute("SELECT COUNT(*) AS n FROM lokasi");
  if (lokCount[0].n === 0) {
    const lokasi = [
      ["Ruang Kelas 7A", "Gedung A — Lantai 1", "Bu Siti Aminah"],
      ["Ruang Kelas 7B", "Gedung A — Lantai 1", "Pak Budi Santoso"],
      ["Ruang Kelas 8A", "Gedung A — Lantai 2", "Bu Ratna Dewi"],
      ["Ruang Kelas 8B", "Gedung A — Lantai 2", "Pak Andi Wijaya"],
      ["Ruang Kelas 9A", "Gedung B — Lantai 1", "Bu Maya Lestari"],
      ["Lab Komputer", "Gedung B — Lantai 2", "Pak Dedi Kurniawan"],
      ["Perpustakaan", "Gedung B — Lantai 1", "Bu Lina Marlina"],
      ["Ruang Guru", "Gedung A — Lantai 1", "Pak Ahmad Fauzi"],
      ["Ruang TU", "Gedung A — Lantai 1", "Bu Rina Wulandari"],
      ["Aula", "Gedung C — Lantai 1", "Pak Rizky Pratama"],
    ];
    for (const [nama, gedung, pj] of lokasi) {
      await db.execute("INSERT INTO lokasi (nama, gedung, penanggung_jawab) VALUES (?, ?, ?)", [nama, gedung, pj]);
    }
    console.log("Seed OK: lokasi (10)");
  }

  // Helper: id kategori / lokasi berdasarkan nama
  const idOf = async (table, nama) => {
    const [rows] = await db.execute(`SELECT id FROM ${table} WHERE nama = ? LIMIT 1`, [nama]);
    return rows.length ? rows[0].id : null;
  };

  // ---- Inventaris ----
  const [invCount] = await db.execute("SELECT COUNT(*) AS n FROM inventaris");
  if (invCount[0].n === 0) {
    const barang = [
      ["Laptop ASUS VivoBook 14", "Elektronik", "Lab Komputer", "Baik", "Tersedia"],
      ["Proyektor Epson EB-X05", "Elektronik", "Ruang Kelas 7A", "Baik", "Dipinjam"],
      ["Meja Guru Kayu Jati", "Furnitur", "Ruang Kelas 8B", "Baik", "Tersedia"],
      ["Kursi Siswa Plastik", "Furnitur", "Ruang Kelas 9C", "Baik", "Dalam Perbaikan"],
      ["Printer Canon PIXMA G2010", "Elektronik", "Ruang TU", "Rusak", "Dalam Perbaikan"],
      ["Papan Tulis Whiteboard 240cm", "Alat Tulis", "Ruang Kelas 7B", "Baik", "Tersedia"],
      ["AC Daikin 1 PK", "Elektronik", "Ruang Guru", "Baik", "Tersedia"],
      ["Lemari Arsip Besi 4 Pintu", "Furnitur", "Ruang TU", "Baik", "Tersedia"],
      ["Speaker Portable JBL", "Elektronik", "Aula", "Rusak Ringan", "Tersedia"],
      ["Buku Paket Matematika Kelas 8", "Buku", "Perpustakaan", "Baik", "Tersedia"],
    ];
    // "Ruang Kelas 9C" belum ada di tabel lokasi — tambahkan dulu.
    const [ada9C] = await db.execute("SELECT id FROM lokasi WHERE nama = 'Ruang Kelas 9C' LIMIT 1");
    if (!ada9C.length) {
      await db.execute("INSERT INTO lokasi (nama, gedung, penanggung_jawab) VALUES ('Ruang Kelas 9C', 'Gedung B — Lantai 2', 'Bu Ratna Dewi')");
    }
    for (const [nama, kat, lok, kondisi, status] of barang) {
      await db.execute(
        "INSERT INTO inventaris (nama, kategori_id, lokasi_id, kondisi, status) VALUES (?, ?, ?, ?, ?)",
        [nama, await idOf("kategori_barang", kat), await idOf("lokasi", lok), kondisi, status]
      );
    }
    console.log("Seed OK: inventaris (10)");
  }

  const invIdOf = async (nama) => {
    const [rows] = await db.execute("SELECT id FROM inventaris WHERE nama = ? LIMIT 1", [nama]);
    return rows.length ? rows[0].id : null;
  };

  // ---- Laporan kerusakan ----
  const [lapCount] = await db.execute("SELECT COUNT(*) AS n FROM laporan_kerusakan");
  if (lapCount[0].n === 0) {
    const laporan = [
      ["KR-001", "Printer Canon PIXMA G2010", "Bu Rina Wulandari", "Printer tidak bisa menarik kertas, lampu indikator berkedip.", "Menunggu", "2026-11-03"],
      ["KR-002", "Kursi Siswa Plastik", "Pak Andi Wijaya", "Kaki kursi patah, tidak bisa dipakai duduk.", "Diproses", "2026-11-04"],
      ["KR-003", "AC Daikin 1 PK", "Pak Ahmad Fauzi", "AC tidak dingin, hanya keluar angin biasa.", "Diproses", "2026-11-05"],
      ["KR-004", "Proyektor Epson EB-X05", "Bu Siti Aminah", "Gambar proyektor buram dan sering mati sendiri.", "Menunggu", "2026-11-06"],
      ["KR-005", "Speaker Portable JBL", "Pak Rizky Pratama", "Suara speaker kresek-kresek saat volume besar.", "Selesai", "2026-11-06"],
      ["KR-006", "Laptop ASUS VivoBook 14", "Pak Dedi Kurniawan", "Baterai laptop cepat habis, hanya bertahan 20 menit.", "Menunggu", "2026-11-07"],
      ["KR-007", "Papan Tulis Whiteboard 240cm", "Bu Ratna Dewi", "Permukaan whiteboard sulit dihapus, bekas spidol menempel.", "Selesai", "2026-11-08"],
      ["KR-008", "Kipas Angin Standing", "Bu Maya Lestari", "Kipas berbunyi keras dan putaran tidak stabil.", "Diproses", "2026-11-09"],
    ];
    for (const [kode, barang, pelapor, deskripsi, status, tanggal] of laporan) {
      await db.execute(
        "INSERT INTO laporan_kerusakan (kode, inventaris_id, barang, pelapor, deskripsi, status, tanggal_laporan) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [kode, await invIdOf(barang), barang, pelapor, deskripsi, status, tanggal]
      );
    }
    console.log("Seed OK: laporan_kerusakan (8)");
  }

  const lapIdOf = async (kode) => {
    const [rows] = await db.execute("SELECT id FROM laporan_kerusakan WHERE kode = ? LIMIT 1", [kode]);
    return rows.length ? rows[0].id : null;
  };

  // ---- Perbaikan ----
  const [perCount] = await db.execute("SELECT COUNT(*) AS n FROM perbaikan");
  if (perCount[0].n === 0) {
    const perbaikan = [
      ["KR-001", "Printer Canon PIXMA G2010", "Pak Dedi Kurniawan", "2026-11-04", "2026-11-06", "Berlangsung", 150000],
      ["KR-002", "Kursi Siswa Plastik", "Pak Rizky Pratama", "2026-11-05", "2026-11-07", "Berlangsung", 75000],
      ["KR-003", "AC Daikin 1 PK", "Teknisi AC — CV Sejuk Mandiri", "2026-11-06", "2026-11-08", "Berlangsung", 350000],
      ["KR-005", "Speaker Portable JBL", "Pak Dedi Kurniawan", "2026-11-06", "2026-11-07", "Selesai", 120000],
      ["KR-007", "Papan Tulis Whiteboard 240cm", "Pak Rizky Pratama", "2026-11-08", "2026-11-09", "Selesai", 50000],
      ["KR-008", "Kipas Angin Standing", "Pak Dedi Kurniawan", "2026-11-09", "2026-11-11", "Menunggu Suku Cadang", 100000],
      ["KR-004", "Proyektor Epson EB-X05", "Teknisi Epson — PT Citra Prima", "2026-11-07", "2026-11-12", "Berlangsung", 450000],
      [null, "Meja Guru Kayu Jati", "Pak Rizky Pratama", "2026-11-02", "2026-11-04", "Selesai", 200000],
    ];
    for (const [kodeLap, barang, teknisi, mulai, estimasi, status, biaya] of perbaikan) {
      await db.execute(
        "INSERT INTO perbaikan (laporan_id, inventaris_id, barang, teknisi, tanggal_mulai, estimasi_selesai, status, biaya) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [kodeLap ? await lapIdOf(kodeLap) : null, await invIdOf(barang), barang, teknisi, mulai, estimasi, status, biaya]
      );
    }
    console.log("Seed OK: perbaikan (8)");
  }

  // ---- Log aktivitas ----
  const [logCount] = await db.execute("SELECT COUNT(*) AS n FROM log_aktivitas");
  if (logCount[0].n === 0) {
    const userIdOf = async (nama) => {
      const [rows] = await db.execute("SELECT id FROM users WHERE name = ? LIMIT 1", [nama]);
      return rows.length ? rows[0].id : null;
    };
    const log = [
      ["Ahmad Fauzi", "Login", "Admin masuk ke sistem dari perangkat kantor.", "2026-11-09 08:15:00"],
      ["Rina Wulandari", "Lapor Kerusakan", "Melaporkan kerusakan Kipas Angin Standing (KR-008).", "2026-11-09 08:32:00"],
      ["Dedi Kurniawan", "Mulai Perbaikan", "Memulai perbaikan Kipas Angin Standing.", "2026-11-09 09:05:00"],
      ["Ahmad Fauzi", "Tambah Barang", "Menambahkan 10 unit Buku Paket Matematika Kelas 8.", "2026-11-08 13:40:00"],
      ["Rizky Pratama", "Selesaikan Perbaikan", "Perbaikan Papan Tulis Whiteboard selesai.", "2026-11-08 15:12:00"],
      ["Siti Aminah", "Lapor Kerusakan", "Melaporkan kerusakan Proyektor Epson EB-X05 (KR-004).", "2026-11-07 10:20:00"],
      ["Ahmad Fauzi", "Ubah Pengguna", "Mengubah role Ratna Dewi menjadi Nonaktif.", "2026-11-07 11:00:00"],
      ["Maya Lestari", "Lapor Kerusakan", "Melaporkan kerusakan Speaker Portable JBL (KR-005).", "2026-11-06 14:25:00"],
      ["Dedi Kurniawan", "Selesaikan Perbaikan", "Perbaikan Speaker Portable JBL selesai.", "2026-11-06 16:45:00"],
      ["Ahmad Fauzi", "Logout", "Admin keluar dari sistem.", "2026-11-05 09:30:00"],
    ];
    for (const [pengguna, aksi, detail, waktu] of log) {
      await db.execute(
        "INSERT INTO log_aktivitas (user_id, pengguna, aksi, detail, created_at) VALUES (?, ?, ?, ?, ?)",
        [await userIdOf(pengguna), pengguna, aksi, detail, waktu]
      );
    }
    console.log("Seed OK: log_aktivitas (10)");
  }

  console.log("Seed selesai.");
};

seed()
  .catch((err) => {
    console.error("Seed gagal:", err.message);
    process.exit(1);
  })
  .finally(() => db.end());
