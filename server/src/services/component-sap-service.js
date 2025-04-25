const { poolPromiseDEV } = require("../data/events/dbIndexComponents");
const sql = require("mssql/msnodesqlv8");
const { trimTrailingWhitespace } = require("../data/utils");

const GET_SAP_COMPONENTS = 
    `
    SELECT 
        rowID, 
        materialID, 
        materialName, 
        netWeightKG, 
        netWeightKG / NULLIF(netWeightL, 0) AS netWeightL, 
        netWeightL AS specificBulkWeight,
        packWeight,
        packWeightUnit,
        packType
        FROM [ATtoSAP_TST].[dbo].[MATERIAL]
    WHERE LOWER(materialName) NOT LIKE '%zmes%';
    `
;


const getSapComponents = async (type) => {
const poolDEV = await poolPromiseDEV;

const { recordset } = await poolDEV.request().query(GET_SAP_COMPONENTS);
console.log("🚀 ~ getSapComponents ~ recordset:", recordset)

console.log(trimTrailingWhitespace(recordset));
return trimTrailingWhitespace(recordset);
};

module.exports = {
    getSapComponents,
};
