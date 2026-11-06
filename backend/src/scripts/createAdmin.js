require("dotenv").config();

const bcrypt = require("bcrypt");
const { db } = require("../config/database");

const createAdmin = async () => {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL, dan ADMIN_PASSWORD harus diisi di .env"
      );
    }

    if (password.length < 8) {
      throw new Error("Password Admin minimal 8 karakter.");
    }

    // Periksa apakah email sudah terdaftar
    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.log("Akun dengan email tersebut sudah terdaftar.");
      return;
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Simpan akun Admin
    await db.execute(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, "ADMIN"]
    );

    console.log("Akun Admin berhasil dibuat!");
    console.log("Nama:", name);
    console.log("Email:", email);
    console.log("Role: ADMIN");
  } catch (error) {
    console.error("Gagal membuat akun Admin:", error.message);
  } finally {
    await db.end();
  }
};

createAdmin();
