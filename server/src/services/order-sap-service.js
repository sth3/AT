const { poolPromiseTST, poolPromise } = require("../data/events/dbIndexComponents");
const sql = require("mssql/msnodesqlv8");
const { trimTrailingWhitespace } = require("../data/utils");
const { getUserById } = require('./user-service');
const GET_ORDERS = `SELECT DISTINCT 
    o.rowID AS recipeRowID,                    
    o.orderID,
    o.segmentRequirementID,
    o.productID,
    o.productName,                                        
    o.startTime AS dueDate,
    o.quantity,
    o.lot,
    o.mixerID,
    o.mixerName,
    o.unitOfMeasure,
    o.timeStampWrite,
    o.timeStampRead,					
    o.status,
    (
        SELECT 
            ISNULL(R.rowID, 0) AS componentRowID,
            ISNULL(R.recipeRowID, 0) AS recipeRowID,
            ISNULL(R.componentID, '') AS componentID,
            ISNULL(R.componentName, '') AS nameC,
            ISNULL(R.quantity, 0) AS sp,
            ISNULL(R.netWeightL, 0) AS specificBulkWeight,
            ISNULL(R.unitOfMeasure, '') AS unitOfMeasure,
            ISNULL(R.packWeight, 0) AS packingWeight,
            ISNULL(R.packWeightUnit, '') AS packWeightUnit,
            ISNULL(TRY_CAST(R.packType AS INT), 0) AS packingType
        FROM [ATtoSAP_TST].[dbo].[RECIPE_COMPONENT_SAP] R 
        WHERE R.recipeRowID = o.rowID
        FOR JSON PATH
    ) AS components
FROM [ATtoSAP_TST].[dbo].[RECIPE_SAP] O 
WHERE 
    o.timeStampRead IS NULL
    AND JSON_QUERY((
        SELECT 
            ISNULL(R.rowID, 0) AS componentRowID,
            ISNULL(R.recipeRowID, 0) AS recipeRowID,
            ISNULL(R.componentID, '') AS componentID,
            ISNULL(R.componentName, '') AS nameC,
            ISNULL(R.quantity, 0) AS sp,
            ISNULL(R.netWeightL, 0) AS specificBulkWeight,
            ISNULL(R.unitOfMeasure, '') AS unitOfMeasure,
            ISNULL(R.packWeight, 0) AS packingWeight,
            ISNULL(R.packWeightUnit, '') AS packWeightUnit,
            ISNULL(TRY_CAST(R.packType AS INT), 0) AS packingType
        FROM [ATtoSAP_TST].[dbo].[RECIPE_COMPONENT_SAP] R 
        WHERE R.recipeRowID = o.rowID
        FOR JSON PATH
    )) IS NOT NULL 
    AND JSON_QUERY((
        SELECT 
            ISNULL(R.rowID, 0) AS componentRowID,
            ISNULL(R.recipeRowID, 0) AS recipeRowID,
            ISNULL(R.componentID, '') AS componentID,
            ISNULL(R.componentName, '') AS nameC,
            ISNULL(R.quantity, 0) AS sp,
            ISNULL(R.netWeightL, 0) AS specificBulkWeight,
            ISNULL(R.unitOfMeasure, '') AS unitOfMeasure,
            ISNULL(R.packWeight, 0) AS packingWeight,
            ISNULL(R.packWeightUnit, '') AS packWeightUnit,
            ISNULL(TRY_CAST(R.packType AS INT), 0) AS packingType
        FROM [ATtoSAP_TST].[dbo].[RECIPE_COMPONENT_SAP] R 
        WHERE R.recipeRowID = o.rowID
        FOR JSON PATH
    )) <> '[]'; `;

const GET_ORDER_BY_NO = `SELECT DISTINCT 
                        o.rowID recipeRowID,                    
                        O.orderID ,
                        O.segmentRequirementID,
                        O.productID,
                        O.productName,                                        
                        O.startTime dueDate,
                        O.quantity,
                        O.lot,
                        O.mixerID,
                        O.mixerName,
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
                        R.netWeightL specificBulkWeight,
                        R.unitOfMeasure,
                        R.packWeight as packingWeight,
                        R.packWeightUnit,
                        COALESCE(TRY_CAST([packType] AS INT), 0) AS packingType 
                        FROM [ATtoSAP_TST].[dbo].[RECIPE_COMPONENT_SAP] R 
                        where R.recipeRowID = o.rowID
                        FOR JSON PATH) components 
                        FROM [ATtoSAP_TST].[dbo].[RECIPE_SAP] O WHERE O.rowID = @recipeRowID `;
const GET_ALL_ORDER_BY_NO = 
                  `SELECT DISTINCT  S.orderRowID
                  ,S.recipeRowID
                  ,S.idMixer mixerID
                  ,S.mixerName
                  ,S.package
                  ,S.mixingTime
                  
                  ,S.completedAt
                  ,S.idEmptyingStationBag
                  ,S.volumePerDose
                  ,S.done
                  ,S.BigBagDone
                  ,S.ADSDone
                  ,S.LiquidDone
                  ,S.MicroDone
                  ,S.createdAt
                  ,S.operatorId
                  ,O.rowID                     
                  ,O.orderID
                  ,O.segmentRequirementID
                  ,O.productID
                  ,O.productName                                     
                  ,O.startTime dueDate
                  ,O.lot
                  ,O.quantity
                  ,O.unitOfMeasure
                  ,O.timeStampWrite
                  ,O.timeStampRead
                  ,O.status,
                        (SELECT 
                        R.rowID componentRowID,
                        Q.componentRowID QcomponentRowID,
                        R.recipeRowID,
                        R.componentID,
                        R.componentName nameC,
                        R.quantity sp,
                        R.netWeightL specificBulkWeight,
                        R.unitOfMeasure,
                        Q.packingWeight,
                        ISNULL(TRY_CAST(Q.packingType AS INT), 0) as packingType
                        FROM [ATtoSAP_TST].[dbo].[RECIPE_COMPONENT_SAP] R 
                        JOIN [AT].[dbo].[QUANTITY_PER_DOSE_SAP] Q ON R.rowID = Q.componentRowID
						WHERE R.recipeRowID = O.rowID 
                        FOR JSON PATH) components 
                FROM [AT].[dbo].[ORDERS_SAP] S
                JOIN [ATtoSAP_TST].[dbo].[RECIPE_SAP] O ON S.recipeRowID = O.rowID
                WHERE S.orderRowID = @recipeRowID `;

                const GET_ORDERS_ALL_ACTIVE = 
                  `SELECT DISTINCT  R.orderRowID
                  ,R.recipeRowID
                  ,R.idMixer
                  ,R.mixerName
                  ,R.package
                  ,R.mixingTime
                  
                  ,R.completedAt
                  ,R.idEmptyingStationBag
                  ,R.volumePerDose
                  ,R.done
                  ,R.BigBagDone
                  ,R.ADSDone
                  ,R.LiquidDone
                  ,R.MicroDone
                  ,R.createdAt
                  ,R.operatorId
                  ,O.rowID                     
                  ,O.orderID
                  ,O.segmentRequirementID
                  ,O.productID
                  ,O.productName  
                  ,O.lot                                  
                  ,O.startTime dueDate
                  ,O.quantity
                  ,O.unitOfMeasure
                  ,O.timeStampWrite
                  ,O.timeStampRead
                  ,O.status,
                        (SELECT 
                        R.rowID componentRowID,
                        Q.componentRowID QcomponentRowID,
                        R.recipeRowID,
                        R.componentID,
                        R.componentName nameC,
                        R.quantity sp,
                        R.netWeightL specificBulkWeight,
                        R.unitOfMeasure,
                        Q.packingWeight,
                        ISNULL(TRY_CAST(Q.packingType AS INT), 0) as packingType
                        FROM [ATtoSAP_TST].[dbo].[RECIPE_COMPONENT_SAP] R 
                        JOIN [AT].[dbo].[QUANTITY_PER_DOSE_SAP] Q ON R.rowID = Q.componentRowID
						            WHERE R.recipeRowID = O.rowID   
                        FOR JSON PATH) components 
                FROM [AT].[dbo].[ORDERS_SAP] R
                JOIN [ATtoSAP_TST].[dbo].[RECIPE_SAP] O ON R.recipeRowID = O.rowID
                WHERE R.done = 0 AND (BigBagDone = 0 OR ADSDone = 0 OR LiquidDone = 0 OR  MicroDone = 0 )
                 `;
                const GET_ORDERS_ALL_DONE = 
                  `SELECT DISTINCT  R.orderRowID
                  ,R.recipeRowID
                  ,R.idMixer
                  ,R.mixerName
                  ,R.package
                  ,R.mixingTime
                  
                  ,R.completedAt
                  ,R.idEmptyingStationBag
                  ,R.volumePerDose
                  ,R.done
                  ,R.BigBagDone
                  ,R.ADSDone
                  ,R.LiquidDone
                  ,R.MicroDone
                  ,R.createdAt
                  ,R.operatorId
                  ,O.rowID                     
                  ,O.orderID
                  ,O.segmentRequirementID
                  ,O.productID
                  ,O.productName   
                  ,O.lot                                
                  ,O.startTime dueDate
                  ,O.quantity
                  ,O.unitOfMeasure
                  ,O.timeStampWrite
                  ,O.timeStampRead
                  ,O.status,
                        (SELECT 
                        R.rowID componentRowID,
                        O.componentRowID QcomponentRowID,
                        R.recipeRowID,
                        R.componentID,
                        R.componentName nameC,
                        R.quantity sp,
                        R.netWeightL specificBulkWeight,
                        R.unitOfMeasure,
                        O.packingWeight,
                        ISNULL(TRY_CAST(O.packingType AS INT), 0) as packingType
                        FROM [ATtoSAP_TST].[dbo].[RECIPE_COMPONENT_SAP] R 
                        JOIN [AT].[dbo].[QUANTITY_PER_DOSE_SAP] O ON R.rowID = O.componentRowID
                        FOR JSON PATH) components 
                FROM [AT].[dbo].[ORDERS_SAP] R
                JOIN [ATtoSAP_TST].[dbo].[RECIPE_SAP] O ON R.recipeRowID = O.rowID
                WHERE R.done > 0
                 `;

const ADD_ORDER = `INSERT INTO [AT].[dbo].[ORDERS_SAP]
                    (
                      recipeRowID,                                      
                      idMixer, 
                      mixerName,

                      package, 
                      mixingTime, 
                      
                      idEmptyingStationBag, 
                      volumePerDose, 
                      done, 
                      BigBagDone, 
                      LiquidDone, 
                      ADSDone, 
                      MicroDone, 
                      operatorId, 
                      createdAt) 
                    VALUES (
                      @recipeRowID,                      
                      @idMixer,
                      @mixerName,
                      @package, 
                      @mixingTime,
                      
                      @idEmptyingStationBag, 
                      @volumePerDose, 
                      @done, 
                      @BigBagDone, 
                      @LiquidDone, 
                      @ADSDone, 
                      @MicroDone, 
                      @operatorId,
                      GETDATE()
                    ) 
                    SELECT SCOPE_IDENTITY() as no`;

const ADD_DOSE = `INSERT INTO [AT].[dbo].[QUANTITY_PER_DOSE_SAP] 
                  (
                    orderNo,
                    orderRowID, 
                    segmentRequirementID, 
                    componentRowID,  
                    packingType,  
                    packingWeight,  
                    quantityDose, 
                    quantityBag, 
                    quantityBigBag, 
                    quantityADS, 
                    quantityLiquid, 
                    quantityMicro
                  ) 
                  VALUES `;

 const UPDATE_ORDER = ` UPDATE [ATtoSAP_TST].[dbo].[RECIPE_SAP] SET timeStampRead = GETDATE() where rowID = @rowID  `                 

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

const getOrdersSapAll = async () => {
  const pool = await poolPromiseTST;
  const { recordset } = await pool.request().query(GET_ORDERS_ALL_ACTIVE);
  console.log("🚀 ~ getOrdersSapAll ~ recipes:", recordset)
  const recipes = trimTrailingWhitespace(recordset);
  recipes.map((recipe) => parseComponentsAndCheckValidity(recipe));
  console.log(
    "🚀 ~ file: orderSap-service.js:32 ~ getOrdersSap ~ recipes:",
    recipes
  );

  for (let order of recordset) {
    order = trimTrailingWhitespace(order);
    
    if (order.operatorId) {
        order.operator = await getUserById(order.operatorId);
    }
}
  return recipes;
};

const getOrdersSapAllDone = async () => {
  const pool = await poolPromiseTST;
  const { recordset } = await pool.request().query(GET_ORDERS_ALL_DONE);
  const recipes = trimTrailingWhitespace(recordset);
  recipes.map((recipe) => parseComponentsAndCheckValidity(recipe));
  console.log(
    "🚀 ~ file: orderSap-service.js:32 ~ getOrdersSap ~ recipes:",
    recipes
  );

  for (let order of recordset) {
    order = trimTrailingWhitespace(order);
    
    if (order.operatorId) {
        order.operator = await getUserById(order.operatorId);
    }
}
  return recipes;
};

const getAllOrderSapByNo = async (recipeRowID) => {
 console.log("🚀 ~ file: order-sap-service.js:169 ~ getAllOrderSapByNo ~ recipeRowID:", recipeRowID)
 
    const pool = await poolPromise;
    const { recordset } = await pool
      .request()
      .input("recipeRowID", sql.Int, recipeRowID)
      .query(GET_ALL_ORDER_BY_NO);
  
    if (recordset.length < 0) {
      return null;
    }
    console.log("🚀 ~ file: order-sap-service.js:180 ~ getAllOrderSapByNo ~ recordset:", recordset)
    const order = await trimTrailingWhitespace(recordset);
    order[0].components = await trimTrailingWhitespace(
      JSON.parse(recordset[0].components)
    );

    
      
      if (order[0].operatorId) {
          order[0].operator = await getUserById(order[0].operatorId);
      }
    
    return order[0];
  
};
const getOrderSapByNo = async (recipeRowID) => {
  const pool = await poolPromiseTST;
  const { recordset } = await pool
    .request()
    .input("recipeRowID", sql.Int, recipeRowID)
    .query(GET_ORDER_BY_NO);

  if (recordset.length < 0) {
    return null;
  }
  const order = await trimTrailingWhitespace(recordset);
  order[0].components = await trimTrailingWhitespace(
    JSON.parse(recordset[0].components)
  );

  return order[0];
};

const addOrderSap = async (order) => {
  console.log("order", order);
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .input("recipeRowID",sql.Int, order.recipeRowID)

    //.input('dueDate', order.dueDate)
    .input('operatorId', sql.Int, order.operatorId)

    .input("idMixer",  order.mixerID)
    .input("mixerName",  order.mixerName)
    .input("package", sql.Int, order.package)
    .input("mixingTime", sql.Int, order.mixingTime)
    
    .input("idEmptyingStationBag", sql.Int, order.idEmptyingStationBag)
    .input("volumePerDose", sql.Int, order.volumePerDose)
    .input("done", sql.Int, 0)
    .input("BigBagDone", sql.Int, order.BigBagDone)
    .input("LiquidDone", sql.Int, order.LiquidDone)
    .input("ADSDone", sql.Int, order.ADSDone)
    .input("MicroDone", sql.Int, order.MicroDone)
    .query(ADD_ORDER);
  const orderNo = recordset[0].no;
  
  await updateOrder(order.recipeRowID);
  await addOrderDose(orderNo, order.rec);
  return recordset[0];
};

const addOrderDose = async (orderNo, doses) => {
  let query = ADD_DOSE;
  doses.forEach((value, index) => {
    query += `(${orderNo},
        ${value.orderRowID}, 
        '${value.segmentRequirementID}', 
        ${value.componentRowID}, 
        ${value.packingType}, 
        ${value.packingWeight}, 
        ${value.quantityDose},
        ${value.quantityBag},
        ${value.quantityBigBag.toFixed(3)},
        ${value.quantityADS.toFixed(3)},
        ${value.quantityLiquid.toFixed(3)},
        ${value.quantityMicro.toFixed(3)})`;
        console.log("🚀 ~ file: order-sap-service.js:182 ~ doses.forEach ~ value.segmentRequirementID:", typeof value.segmentRequirementID)
    if (index < doses.length - 1) {
      query += ", ";
    }
    
  });
  console.log("query", query);
  const pool = await poolPromise;
  return pool.request().query(query);
};

const updateOrder = async (orderNo) => {
  const pool = await poolPromiseTST;
    await pool.request()        
        .input('rowID', sql.Int, orderNo)
        .query(UPDATE_ORDER)
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
  getOrderSapByNo,
  addOrderSap,
  getAllOrderSapByNo,
  getOrdersSapAll,
  getOrdersSapAllDone
};
