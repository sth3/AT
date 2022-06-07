const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {PORT, 
       HOST,
       HOST_URL, 
       SQL_USER, 
       SQL_PASSWORD, 
       SQL_DATABASE, 
       SQL_SERVER} = process.env;

const sqlEncrypt = process.env.ENCRYPT === "false";

assert(PORT, 'PORT is require');
assert(HOST, 'HOST is required');

module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    sql: {
        server: SQL_SERVER,
        database: SQL_DATABASE,
        user: SQL_USER,
        password: SQL_PASSWORD,
        port: "1433",
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
          },
        options: {
            encrypt: false,
            enableArithAbort: true
        },
    },
};

