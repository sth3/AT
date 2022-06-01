const sqlConfig = {
    user: "AT",
    port: 1433,
    password: "123456789",  
    database: "AT",
    server: "DESKTOP-EPDLM7F\\WINCCUNIFIED",
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