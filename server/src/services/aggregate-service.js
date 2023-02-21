const { poolPromise } = require("../data/events/dbIndexComponents");
const sql = require("mssql/msnodesqlv8");
const { trimTrailingWhitespace } = require("../data/utils");

const MAX_CHANGE_LENGTH = 512;

const GET_AGGREGATES = [
        `SELECT 
        M.no aNo,
        M.id aID,
        M.lastUpdate lastUpdate,
        M.quantity quantity,      
        C.id id,
        ISNULL(C.name,'') name             
        FROM [AT].[dbo].[AGGREGATES_ADS] M 
        LEFT OUTER join [AT].[dbo].[COMPONENT] C on C.no = M.idComponent`,
        `SELECT 
        M.no aNo,
        M.id aID,
        M.lastUpdate lastUpdate,
        M.quantity quantity,      
        C.id id,
        ISNULL(C.name,'') name             
        FROM [AT].[dbo].[AGGREGATES_Micro] M 
        LEFT OUTER join [AT].[dbo].[COMPONENT] C on C.no = M.idComponent`,
       `SELECT 
        M.no aNo,
        M.id aID,
        M.lastUpdate lastUpdate,
        M.quantity quantity,      
        C.id id,
        ISNULL(C.name,'') name             
        FROM [AT].[dbo].[AGGREGATES_BigBag] M 
        LEFT OUTER join [AT].[dbo].[COMPONENT] C on C.no = M.idComponent`,
        `SELECT 
        M.no aNo,
        M.id aID,
        M.lastUpdate lastUpdate,
        M.quantity quantity,      
        C.id id,
        ISNULL(C.name,'') name             
        FROM [AT].[dbo].[AGGREGATES_Liquid] M 
        LEFT OUTER join [AT].[dbo].[COMPONENT] C on C.no = M.idComponent`
];


const getAggregates = async (type) => {
  const pool = await poolPromise;

  const { recordset } = await pool.request().query(GET_AGGREGATES[type]);

  console.log(trimTrailingWhitespace(recordset));
  return trimTrailingWhitespace(recordset);
};

module.exports = {
  getAggregates,
};
