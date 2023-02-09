const { poolPromise } = require("../data/events/dbIndexComponents");
const sql = require("mssql/msnodesqlv8");
const { trimTrailingWhitespace } = require("../data/utils");

const MAX_CHANGE_LENGTH = 512;

const GET_AGGREGATE = `SELECT 
        M.id aID,
        M.lastUpdate aLastUpdate,
        C.no no,
        C.id id,
        C.name name,           
        C.packing packing,
        C.specificBulkWeight specificBulkWeight
        FROM [AT].[dbo].[AGGREGATE] M 
        INNER JOIN [AT].[dbo].[COMPONENT] C on C.no = M.idComponent`;

const getAggregate = async () => {
  const pool = await poolPromise;
  const { recordset } = await pool.request().query(GET_AGGREGATE);
  console.log(trimTrailingWhitespace(recordset));
  return trimTrailingWhitespace(recordset);
};

module.exports = {
    getAggregate
};
