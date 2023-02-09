const { poolPromise } = require("../data/events/dbIndexComponents");
const sql = require("mssql/msnodesqlv8");
const { trimTrailingWhitespace } = require("../data/utils");

const MAX_CHANGE_LENGTH = 512;

const GET_AGGREGATE = `SELECT 
        M.no aNo,
        M.id aID,
        M.lastUpdate lastUpdate,        
        C.id id,
        ISNULL(C.name,'') name             
        FROM [AT].[dbo].[AGGREGATE] M 
        LEFT OUTER join [AT].[dbo].[COMPONENT] C on C.no = M.idComponent`;

const getAggregate = async () => {
  const pool = await poolPromise;
  const { recordset } = await pool.request().query(GET_AGGREGATE);
  console.log(trimTrailingWhitespace(recordset));
  return trimTrailingWhitespace(recordset);
};

module.exports = {
  getAggregate,
};
