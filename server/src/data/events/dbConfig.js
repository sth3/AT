const dotenv = require('dotenv');
dotenv.config();

const sqlConfig = {
    user: process.env.SQL_USER,
    port: 1433,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    server: process.env.SQL_SERVER,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      //encrypt: true, // for azure
      enableArithAbort: true,
      //trustServerCertificate: false // change to true for local dev / self-signed certs
    }
  };
  module.exports = sqlConfig;



