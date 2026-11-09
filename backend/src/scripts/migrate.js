// Runner migrasi: menjalankan semua file .sql di backend/migrations/ secara berurutan.
// Cara pakai: node src/scripts/migrate.js   (dari folder backend/)
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { db } = require("../config/database");

const run = async () => {
  const dir = path.join(__dirname, "..", "..", "migrations");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("Tidak ada file migrasi.");
    return;
  }

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    // Buang baris komentar (--) dulu, lalu pecah per statement.
    // (Jangan buang chunk yang diawali komentar — di situlah statement pertamanya.)
    const sql = raw
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n");
    // mysql2 tidak menerima beberapa statement sekaligus lewat query(),
    // jadi jalankan per statement.
    const statements = sql
      .split(/;\s*\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      await db.query(stmt);
    }
    console.log(`Migrasi OK: ${file}`);
  }

  console.log("Semua migrasi selesai.");
};

run()
  .catch((err) => {
    console.error("Migrasi gagal:", err.message);
    process.exit(1);
  })
  .finally(() => db.end());
