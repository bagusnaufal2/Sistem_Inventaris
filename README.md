# Sistem Inventaris — SMP IT At-Taufiq

Sistem inventaris dan pelaporan sarana untuk SMP IT At-Taufiq: pencatatan barang, lokasi/ruangan, laporan kerusakan, perbaikan, pengguna, dan log aktivitas — dalam satu aplikasi web.

Desain antarmuka mengikuti file Figma **Sistem Pelanggaran SDIT** (tema hijau, biru sebagai warna sekunder). File Figma hanya dipakai sebagai referensi warna; desain tidak diubah di Figma.

## Fitur

- **Dashboard admin** — statistik barang, kondisi, dan laporan terbaru
- **Inventaris** — CRUD barang, filter berdasarkan kategori, lokasi, kondisi, dan status, plus pencarian
- **Kategori Barang** — CRUD kategori
- **Lokasi** — CRUD lokasi/ruangan (nama, gedung, penanggung jawab)
- **Laporan Kerusakan** — CRUD laporan (kode otomatis `KR-xxx`), ubah status Menunggu / Diproses / Selesai
- **Perbaikan** — CRUD perbaikan, ubah status
- **Pengguna** — CRUD pengguna (khusus admin)
- **Laporan & Statistik** — ringkasan dan tren per bulan
- **Log Aktivitas** — riwayat aktivitas login dan perubahan data (khusus admin)
- **Pengaturan** — preferensi tampilan, tersimpan di browser (localStorage)

**Peran pengguna:** Admin, Petugas, Guru, Kepala Sekolah. Aksi tulis/hapus hanya untuk Admin; halaman Pengguna dan Log Aktivitas khusus Admin.

## Teknologi

| Lapisan  | Teknologi |
| --- | --- |
| Backend | Node.js + Express 5, mysql2, JWT, zod |
| Database | MySQL / MariaDB |
| Frontend | Vite + React 19 + Tailwind CSS v4, axios |

## Struktur folder

```
Sistem_Inventaris/
├── backend/
│   ├── migrations/            # File SQL migrasi (001_inventaris_modules.sql)
│   └── src/
│       ├── config/            # Koneksi database
│       ├── controllers/       # Logika tiap modul
│       ├── middlewares/       # Autentikasi (JWT) & otorisasi peran
│       ├── routes/            # Endpoint /api/...
│       ├── scripts/           # migrate.js, seed.js, createAdmin.js
│       └── server.js          # Entry point (port 5000)
└── frontend/
    └── src/
        ├── pages/admin/       # 9 halaman admin + Dashboard
        ├── services/api.js    # axios, baseURL http://localhost:5000/api
        └── utils/format.js    # Helper format tanggal/angka
```

## Cara menjalankan

### Prasyarat

- Node.js 18+
- MySQL atau MariaDB yang sedang berjalan

### 1. Clone dan install dependency

```bash
git clone https://github.com/bagusnaufal2/Sistem_Inventaris.git
cd Sistem_Inventaris

cd backend && npm install
cd ../frontend && npm install
```

### 2. Buat file `.env` di folder `backend/`

Salin `backend/.env.example` menjadi `backend/.env`, lalu isi sesuai database lokalmu:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=isi_password_mysql_mu
DB_NAME=sistem_inventaris

JWT_SECRET=isi_dengan_string_acak_yang_panjang

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@at-taufiq.sch.id
ADMIN_PASSWORD=isi_password_admin
```

> `.env` berisi password — jangan pernah di-commit atau dibagikan.

### 3. Buat database

```sql
CREATE DATABASE sistem_inventaris CHARACTER SET utf8mb4;
```

### 4. Jalankan migrasi (WAJIB — bikin semua tabel modul)

Dari folder `backend/`:

```bash
node src/scripts/migrate.js
```

> Kalau langkah ini dilewati, tambah data akan gagal dengan error `Table '...kategori_barang' doesn't exist` (ER_NO_SUCH_TABLE / errno 1146).

### 5. Isi data contoh (opsional) dan buat akun admin

```bash
node src/scripts/seed.js        # data contoh: 6 kategori, 10 lokasi, 10 inventaris, dst.
node src/scripts/createAdmin.js # akun admin dari ADMIN_EMAIL & ADMIN_PASSWORD di .env
```

### 6. Jalankan server

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend
npm start

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm run dev
```

Cek backend hidup: buka `http://localhost:5000/api/health` (harus `200`).

Login dengan email dan password admin yang diisi di `.env`.

## Endpoint API

Base URL: `http://localhost:5000/api` — semua endpoint butuh token JWT (header `Authorization: Bearer <token>`), kecuali login.

| Modul | Endpoint | Keterangan |
| --- | --- | --- |
| Auth | `POST /auth/login` | Login, mengembalikan token |
| Dashboard | `GET /dashboard/admin` | Statistik admin |
| Kategori | `GET/POST /kategori`, `GET/PUT/DELETE /kategori/:id` | CRUD kategori |
| Lokasi | `GET/POST /lokasi`, `GET/PUT/DELETE /lokasi/:id` | CRUD lokasi |
| Inventaris | `GET/POST /inventaris`, `GET/PUT/DELETE /inventaris/:id` | CRUD barang; filter `?q=&kategoriId=&lokasiId=&kondisi=&status=` |
| Kerusakan | `GET/POST /kerusakan`, `GET/PUT/DELETE /kerusakan/:id`, `PATCH /kerusakan/:id/status` | CRUD laporan kerusakan |
| Perbaikan | `GET/POST /perbaikan`, `GET/PUT/DELETE /perbaikan/:id`, `PATCH /perbaikan/:id/status` | CRUD perbaikan |
| Pengguna | `GET/POST /pengguna`, `GET/PUT/DELETE /pengguna/:id` | Khusus admin |
| Log Aktivitas | `GET /log-aktivitas` | Khusus admin |
| Laporan | `GET /laporan/statistik` | Ringkasan & tren |

List mendukung pagination (`?page=&limit=`) dan pencarian/filter di modul yang menyediakan.

## Troubleshooting

| Gejala | Penyebab & solusi |
| --- | --- |
| `Table '...kategori_barang' doesn't exist` (ER_NO_SUCH_TABLE, errno 1146) | Tabel modul belum dibuat — jalankan `node src/scripts/migrate.js` dari folder `backend/`, lalu restart backend |
| `401 Unauthorized` saat panggil API | Token belum dikirim / sudah kedaluwarsa — login ulang |
| `403 Forbidden` saat simpan/hapus | Peranmu bukan Admin — aksi tulis hanya untuk Admin |
| Frontend tidak bisa terhubung ke API | Pastikan backend jalan di port 5000 dan `baseURL` di `frontend/src/services/api.js` sesuai |
| `Cannot connect to MySQL` | Pastikan MySQL/MariaDB berjalan dan isi `DB_*` di `.env` sudah benar |

## Catatan

- Migrasi bersifat idempotent (`IF NOT EXISTS`) sehingga aman dijalankan ulang.
- Pengguna contoh dari seed tidak bisa login (password acak) — login hanya dengan akun admin dari `createAdmin.js`.
- Server yang dijalankan lewat terminal tidak otomatis hidup lagi setelah komputer/VM restart — jalankan ulang langkah 6 (dan pastikan database masih ada).
