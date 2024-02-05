const {sqlConfig, sqlConfigProductionSAP, sqlConfigTestSAP,sqlConfigDEV} = require("./dbConfig.js"); // DATA NA SPOJENIE S DATABAZOU
const sql = require('mssql/msnodesqlv8');
const utils = require('../utils');
const { DateTime } = require("mssql/msnodesqlv8");
const moment = require('moment');

const poolPromise = new sql.ConnectionPool(sqlConfig)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL AT');
        return pool;
    })
    .catch(err => {
        console.error('Database AT Connection Failed! Bad Config: ', err)
    });

    const poolPromisePRD = new sql.ConnectionPool(sqlConfigProductionSAP)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL ATtoSQL PRD');
        return pool;
    })
    .catch(err => {
        console.error('Database ATtoSQL PRD Connection Failed! Bad Config: ', err)
    });

    const poolPromiseTST = new sql.ConnectionPool(sqlConfigTestSAP)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL ATtoSQL TST');
        return pool;
    })
    .catch(err => {
        console.error('Database ATtoSQL TST Connection Failed! Bad Config: ', err)
    });

    const poolPromiseDEV = new sql.ConnectionPool(sqlConfigDEV)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL ATtoSQL DEV');
        return pool;
    })
    .catch(err => {
        console.error('Database ATtoSQL DEV Connection Failed! Bad Config: ', err)
    });

module.exports = {   
    poolPromise: poolPromise,
    poolPromisePRD: poolPromisePRD,
    poolPromiseTST: poolPromiseTST,
    poolPromiseDEV: poolPromiseDEV
};
