const dotenv = require('dotenv');
dotenv.config();

const sqlConfig = {
    user: process.env.SQL_USER,
    port: 1433,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    server: process.env.SQL_SERVER,
    
    driver: "undefined",
    pool: { 
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000 
    },
    options: {
      encrypt: false, // for azure
      enableArithAbort: true,
      trustedConnection: true,
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  };

  const sqlConfigProductionSAP = {
    user: process.env.SQL_USER,
    port: 1433,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE_SAP_PRD,
    server: process.env.SQL_SERVER,
    
    driver: "undefined",
    pool: { 
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000 
    },
    options: {
      encrypt: false, // for azure
      enableArithAbort: true,
      trustedConnection: true,
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  };

  const sqlConfigTestSAP = {
    user: process.env.SQL_USER,
    port: 1433,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE_SAP_TST,
    server: process.env.SQL_SERVER,
    
    driver: "undefined",
    pool: { 
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000 
    },
    options: {
      encrypt: false, // for azure
      enableArithAbort: true,
      trustedConnection: true,
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  };
  const sqlConfigDEV = {
    user: process.env.SQL_USER,
    port: 1433,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE_SAP_DEV,
    server: process.env.SQL_SERVER,
    
    driver: "undefined",
    pool: { 
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000 
    },
    options: {
      encrypt: false, // for azure
      enableArithAbort: true,
      trustedConnection: true,
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  };
  module.exports = {
    sqlConfig,
    sqlConfigProductionSAP,
    sqlConfigTestSAP,
    sqlConfigDEV
  };



