const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fungsi untuk menguji koneksi database
const testConnection = async () => {
  try {
    const connection = await db.getConnection();

    console.log("MySQL berhasil terhubung!");

    connection.release();
  } catch (error) {
    console.error("Koneksi MySQL gagal:", error.message);
    throw error;
  }
};

module.exports = {
  db,
  testConnection,
};
