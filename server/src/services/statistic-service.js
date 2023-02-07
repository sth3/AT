const { poolPromise } = require('../data/events/dbIndexComponents');
const sql = require('mssql/msnodesqlv8');
const { trimTrailingWhitespace } = require('../data/utils');

const GET_ALL_STATISTICS = 'SELECT * FROM [AT].[dbo].[statDoses]';



const getStat = async () => {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
        .query(GET_ALL_STATISTICS);
        console.log(trimTrailingWhitespace(recordset));
    return trimTrailingWhitespace(recordset);
}

module.exports = {
    getStat
}