-- Migrasi 001 — Modul Sistem Inventaris SMPIT At-Taufiq
-- Dibuat 2026-11-09. Dijalankan dengan: node src/scripts/migrate.js
-- Idempotent (IF NOT EXISTS) sehingga aman dijalankan ulang.
-- Tabel users sudah ada sebelumnya (dibuat saat setup awal) dan tidak disentuh di sini.

CREATE TABLE IF NOT EXISTS kategori_barang (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL UNIQUE,
  deskripsi TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS lokasi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL UNIQUE,
  gedung VARCHAR(100) NOT NULL DEFAULT '',
  penanggung_jawab VARCHAR(100) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventaris (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  kategori_id INT NOT NULL,
  lokasi_id INT NOT NULL,
  kondisi ENUM('Baik', 'Rusak Ringan', 'Rusak') NOT NULL DEFAULT 'Baik',
  status ENUM('Tersedia', 'Dipinjam', 'Dalam Perbaikan') NOT NULL DEFAULT 'Tersedia',
  deskripsi TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventaris_kategori FOREIGN KEY (kategori_id)
    REFERENCES kategori_barang (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_inventaris_lokasi FOREIGN KEY (lokasi_id)
    REFERENCES lokasi (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_inventaris_kategori (kategori_id),
  INDEX idx_inventaris_lokasi (lokasi_id),
  INDEX idx_inventaris_nama (nama)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS laporan_kerusakan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode VARCHAR(20) NOT NULL UNIQUE,
  inventaris_id INT NULL,
  barang VARCHAR(150) NOT NULL,
  pelapor VARCHAR(100) NOT NULL,
  deskripsi TEXT NOT NULL,
  status ENUM('Menunggu', 'Diproses', 'Selesai') NOT NULL DEFAULT 'Menunggu',
  tanggal_laporan DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_laporan_inventaris FOREIGN KEY (inventaris_id)
    REFERENCES inventaris (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_laporan_status (status),
  INDEX idx_laporan_tanggal (tanggal_laporan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS perbaikan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  laporan_id INT NULL,
  inventaris_id INT NULL,
  barang VARCHAR(150) NOT NULL,
  teknisi VARCHAR(150) NOT NULL,
  tanggal_mulai DATE NOT NULL,
  estimasi_selesai DATE NULL,
  status ENUM('Berlangsung', 'Selesai', 'Menunggu Suku Cadang') NOT NULL DEFAULT 'Berlangsung',
  biaya INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_perbaikan_laporan FOREIGN KEY (laporan_id)
    REFERENCES laporan_kerusakan (id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_perbaikan_inventaris FOREIGN KEY (inventaris_id)
    REFERENCES inventaris (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_perbaikan_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS log_aktivitas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  pengguna VARCHAR(100) NOT NULL,
  aksi VARCHAR(100) NOT NULL,
  detail TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_log_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_log_created (created_at),
  INDEX idx_log_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
