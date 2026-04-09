const { Pool } = require("pg");

// Pool = quản lý nhiều kết nối cùng lúc (hiệu quả hơn tạo kết nối mới mỗi request)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;