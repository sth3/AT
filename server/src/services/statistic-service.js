const { poolPromise } = require('../data/events/dbIndexComponents');
const sql = require('mssql/msnodesqlv8');
const { trimTrailingWhitespace } = require('../data/utils');

const GET_ALL_STATISTICS = 
`SELECT S.[no]
,[datetime]
,[componentSP]
,[componentPV]
,[noContainer]
,[noOrder]
,[noComponent]
,C.name
FROM [AT].[dbo].[STATISTICS] S
INNER JOIN [AT].[dbo].[COMPONENT] C on C.no = S.noComponent`



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