const { poolPromise } = require("../data/events/dbIndexComponents");
const sql = require("mssql/msnodesqlv8");
const { trimTrailingWhitespace } = require("../data/utils");

const GET_ORDERS = `SELECT DISTINCT 
                    O.recipeNo recipeNo, 
                    O.orderID orderID,
                    O.segmentRequirementID segmentRequirementID,
                    O.name nameO,
                    O.customerName,
                    O.recipeID,
                    O.recipeName,
                    O.dueDate,
                    O.quantity,
                    O.timeStampWrite,
                    (SELECT 
                    R.id,
                    R.name nameC,
                    R.sp,
                    R.specificBulkWeight,
                    R.unitOfMeasure,
                    R.packingWeight,
                    R.packingType
                    FROM [AT].[dbo].[RECIPE_SAP] R 
                    FOR JSON PATH) components 
                    FROM [AT].[dbo].[ORDERS_SAP] O  `;

const getOrdersSap = async () => {
  const pool = await poolPromise;
  const { recordset } = await pool.request().query(GET_ORDERS);
  const recipes = trimTrailingWhitespace(recordset);
  recipes.map((recipe) => parseComponentsAndCheckValidity(recipe));
  console.log(
    "🚀 ~ file: orderSap-service.js:32 ~ getOrdersSap ~ recipes:",
    recipes
  );

  return recipes;
};

const parseComponentsAndCheckValidity = (recipe) => {
  if (recipe.components) {
    recipe.components = trimTrailingWhitespace(JSON.parse(recipe.components));
  }
  recipe.isValid = true;

  return recipe;
};

module.exports = {
  getOrdersSap,
};
