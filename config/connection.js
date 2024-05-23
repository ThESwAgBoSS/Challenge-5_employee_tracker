const mysql = require("mysql2");
// Used to secure my password
require('dotenv').config()

const connection = mysql.createConnection({
  host: "localhost",
  // Username using .env
  user: process.env.DB_USER,
  // Password using .env
  password: process.env.DB_PASSWORD,
//   Database name using .env
  database: process.env.DB_NAME
});

module.exports = connection;