const { poolPromiseTST } = require("../data/events/dbIndexComponents");
const sql = require("mssql/msnodesqlv8");
const { trimTrailingWhitespace } = require("../data/utils");

const GET_ORDERS = `SELECT DISTINCT 
                    o.rowID recipeRowID,                    
                    O.orderID ,
                    O.segmentRequirementID,
                    O.productID,
                    O.productName,
                    O.customerName,                    
                    O.dueDate,
                    O.quantity,
                    O.unitOfMeasure,
                    O.timeStampWrite,
                    O.timeStampRead,
                    O.status,
                    (SELECT 
                    R.rowID componentRowID,
                    R.recipeRowID,
                    R.componentID,
                    R.componentName nameC,
                    R.quantity sp,
                    R.specificBulkWeight,
                    R.unitOfMeasure,
                    R.packingWeight,
                    R.packingType
                    FROM [ATtoSAP_TST].[dbo].[RECIPE_COMPONENT_SAP] R 
                    FOR JSON PATH) components 
                    FROM [ATtoSAP_TST].[dbo].[RECIPE_SAP] O  `;

const GET_ORDER_BY_NO = `SELECT DISTINCT 
                    o.rowID recipeRowID,                    
                    O.orderID ,
                    O.segmentRequirementID,
                    O.productID,
                    O.productName,
                    O.customerName,                    
                    O.dueDate,
                    O.quantity,
                    O.unitOfMeasure,
                    O.timeStampWrite,
                    O.timeStampRead,
                    O.status,
                    (SELECT 
                    R.rowID componentRowID,
                    R.recipeRowID,
                    R.componentID,
                    R.componentName nameC,
                    R.quantity sp,
                    R.specificBulkWeight,
                    R.unitOfMeasure,
                    R.packingWeight,
                    R.packingType
                    FROM [ATtoSAP_TST].[dbo].[RECIPE_COMPONENT_SAP] R 
                    FOR JSON PATH) components 
                    FROM [ATtoSAP_TST].[dbo].[RECIPE_SAP] O WHERE O.rowID = @recipeRowID `;

const getOrdersSap = async () => {
  const pool = await poolPromiseTST;
  const { recordset } = await pool.request().query(GET_ORDERS);
  const recipes = trimTrailingWhitespace(recordset);
  recipes.map((recipe) => parseComponentsAndCheckValidity(recipe));
  console.log(
    "🚀 ~ file: orderSap-service.js:32 ~ getOrdersSap ~ recipes:",
    recipes
  );

  return recipes;
};

const getOrderSapByNo = async (recipeRowID) => {
  
  const pool = await poolPromiseTST;
  const { recordset } = await pool.request()
      .input('recipeRowID', sql.Int, recipeRowID)
      .query(GET_ORDER_BY_NO);

  if (recordset.length < 0) {
      return null;
  }  
  const order = await trimTrailingWhitespace(recordset); 
  order[0].components = await  trimTrailingWhitespace(JSON.parse(recordset[0].components)); 
   
  return order[0];
}


















const parseComponentsAndCheckValidity = (recipe) => {
  if (recipe.components) {
    recipe.components = trimTrailingWhitespace(JSON.parse(recipe.components));
  }
  recipe.isValid = true;

  return recipe;
};

module.exports = {
  getOrdersSap,
  getOrderSapByNo
};
