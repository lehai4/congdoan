// database.js
const sql = require("mssql");
require("dotenv").config();
// Thông tin cấu hình kết nối
const config = {
  user: process.env.USER_SQL_SERVER,
  password: process.env.PASS_SQL_SERVER,
  server: process.env.HOST_SQL_SERVER,
  database: process.env.DATABASE_SQL_SERVER,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Kết nối tới SQL Server
async function connectToDatabase() {
  try {
    let pool = await sql.connect(config);
    console.log("Đã kết nối SQL Server thành công");
    return pool;
  } catch (err) {
    console.error("Kết nối SQL Server thất bại:", err);
  }
}

module.exports = {
  sql,
  connectToDatabase,
};
