var sqlConfig = require("./dbConfig.js");// DATA NA SPOJENIE S DATABAZOV
const sql = require('mssql/msnodesqlv8');
const utils = require('../utils');

var dataFromSelectKomponent, lengthSelectKomponent, numberOfRowsSelectKomponent;
var dataFromSelectRecipeHead, lengthSelectRecipeHead, numberOfRowsSelectRecipeHead, dataFromSelectRecipeBody, lengthSelectRecipeBody, numberOfRowsSelectRecipeBody;
var dataFromSelectOrder, lengthSelectOrder, numberOfRowsSelectOrder;

//console.log(sqlConfig); // OVERENIE SPRAVNOSTI DAT NA SPOJENIE S MSSQL
// ====================================== VYPIS SPOJENIA
async function getdata() {
  try {
    let pool = await sql.connect(sqlConfig);
    console.log("sql server connected");
    var connection = "sql server connected"
    return connection;
  } catch (error) {
    console.log(error.message);
  }
}

// ====================================== SELECT DATABASE
async function getdataKomponent() {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .query(sqlQueries.getComponents);      // where LINE = @ID'     
    //.query('select * from [AT].[dbo].[COMPONENTS]');            
    dataFromSelectKomponent = JSON.parse(JSON.stringify(result.recordsets));
    lengthSelectKomponent = dataFromSelectKomponent[0].length;
    numberOfRowsSelectKomponent = Object.keys(dataFromSelectKomponent[0][0]).length;

    //  console.log(dataFromSelectKomponent);
    //  console.log("numberOfRowsSelectKomponent = " + Object.keys(dataFromSelectKomponent[0][0]).length);
    //  console.log("lengthSelect = " +dataFromSelectKomponent[0].length);

    sql.close();

    return [dataFromSelectKomponent, lengthSelectKomponent, numberOfRowsSelectKomponent];
    //console.log(obj[0][0].SP9);
    //console.log(JSON.stringify(result.recordsets[0], null, 2)); --- objekt do string 
  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}
// ====================================== ADD - NEW COMPONENT - DATABASE    
async function addComponent(componentsNo, componentsID, componentsName) {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .input("No", sql.Int, componentsNo)
      .input("ID", sql.NVarChar(10), componentsID)
      .input("NAME", sql.NVarChar(25), componentsName)
      .query(sqlQueries.addComponents)
    //.query('INSERT INTO [dbo].[COMPONENTS]([No],[ID],[NAME])VALUES(@No, @ID, @Name)');      // where LINE = @ID'     
    //console.log(sqlQueries.addComponents);
    sql.close();

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}

// ====================================== REMOVE - COMPONENT - DATABASE    
async function deleteComponent(componentsNo) {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .input("No", sql.Int, componentsNo)
      .query(sqlQueries.deleteComponents)
    sql.close();

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}
// ====================================== UPDATE - COMPONENT - DATABASE     
async function updateComponent(componentsID, componentsName, componentsNo) {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .input("No", sql.Int, componentsNo)
      .input("ID", sql.NVarChar(10), componentsID)
      .input("Name", sql.NVarChar(25), componentsName)
      .query(sqlQueries.updateComponents)
    console.log(sqlQueries.updateComponents);
    console.log(componentsID + ' ' + componentsName + ' ' + componentsNo);
    sql.close();

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}

// ====================================== SELECT DATABASE RECIPE HEAD
async function getdataRecipeHead() {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .query(sqlQueries.getRecipesHead);

    dataFromSelectRecipeHead = JSON.parse(JSON.stringify(result.recordsets));   // OBEJKT DO POLA       
    lengthSelectRecipeHead = dataFromSelectRecipeHead[0].length; // POCET ZAZNAMOV
    numberOfRowsSelectRecipeHead = Object.keys(dataFromSelectRecipeHead[0][0]).length; // POCET STLPCOV V TABULKE

    //  console.log(dataFromSelectRecipeHead); // VYPIS DAT
    //  console.log("numberOfRowsSelectRecipeHead = " + Object.keys(dataFromSelectRecipeHead[0][0]).length); //VYPOS POCET STLPCOV
    //  console.log("lengthSelectRecipeHead = " +dataFromSelectRecipeHead[0].length); // VYPIS POCET ZAZNAMOV
    sql.close();  // KONIEC SPOJENIA S DATABAZOV

    return [dataFromSelectRecipeHead, lengthSelectRecipeHead, numberOfRowsSelectRecipeHead];    // VRATENIE DAT S FUNKCIE     

  } catch (error) {

    console.log(error.message);
    sql.close();

  }
}
// ====================================== SELECT DATABASE RECIPE BODY
async function getdataRecipeBody() {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .query(sqlQueries.getRecipesBody);


    dataFromSelectRecipeBody = JSON.parse(JSON.stringify(result.recordsets));   // OBEJKT DO POLA       
    lengthSelectRecipeBody = dataFromSelectRecipeBody[0].length; // POCET ZAZNAMOV
    numberOfRowsSelectRecipeBody = Object.keys(dataFromSelectRecipeBody[0][0]).length; // POCET STLPCOV V TABULKE

    //  console.log(dataFromSelectRecipeBody); // VYPIS DAT
    //  console.log("numberOfRowsSelectRecipeHead = " + Object.keys(dataFromSelectRecipeBody[0][0]).length); //VYPOS POCET STLPCOV
    //  console.log("lengthSelectRecipeHead = " +dataFromSelectRecipeBody[0].length); // VYPIS POCET ZAZNAMOV



    sql.close();  // KONIEC SPOJENIA S DATABAZOV

    return [dataFromSelectRecipeBody, lengthSelectRecipeBody, numberOfRowsSelectRecipeBody];    // VRATENIE DAT S FUNKCIE     

  } catch (error) {

    console.log(error.message);
    sql.close();

  }
}
// ====================================== ADD - NEW RECIPE HEAD - DATABASE    
async function addRecipeH(No, ID, Name) {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .input("No", sql.Int, No)
      .input("ID", sql.NVarChar(10), ID)
      .input("NAME", sql.NVarChar(25), Name)
      .query(sqlQueries.addRecipeH)
    
    sql.close();

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}
// ====================================== ADD - NEW RECIPE BODY - DATABASE    
async function addRecipeB(noRecipe, noComponent, componentSP) {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .input("noRecipe", sql.Int, noRecipe)
      .input("componentNo", sql.Int, noComponent)
      .input("componentSP", sql.Real, componentSP)
      .query(sqlQueries.addRecipeBody)
    
    sql.close();

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}
// ====================================== REMOVE - COMPONENT - DATABASE  - RECIPE HEAD  
async function deleteRecipeH(No) {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .input("No", sql.Int, No)
      .query(sqlQueries.deleteRecipeH)
    sql.close();

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}
// ====================================== REMOVE - COMPONENT - DATABASE  - RECIPE BODY  
async function deleteRecipeB(No) {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .input("noRecipe", sql.Int, No)
      .query(sqlQueries.deleteRecipeB)
    sql.close();

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}
// ====================================== UPDATE - updateRecipeH - DATABASE  
async function updateRecipeH(ID, Name, No) {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .input("No", sql.Int, No)
      .input("ID", sql.NVarChar(10), ID)
      .input("Name", sql.NVarChar(25), Name)
      .query(sqlQueries.updateRecipeH)
    //console.log(sqlQueries.updateComponents);
    //console.log(componentsID + ' ' + componentsName + ' ' + componentsNo);
    sql.close();

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}
// ====================================== UPDATE - updateRecipeB - DATABASE  
async function updateRecipeB(recipeNo, componentNo, componentSP) {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .input("recipeNo", sql.Int, recipeNo)
      .input("componentNo", sql.Int, componentNo)
      .input("componentSP", sql.Real, componentSP)
      .query(sqlQueries.updateRecipeB)
    //console.log(sqlQueries.updateComponents);
    //console.log(componentsID + ' ' + componentsName + ' ' + componentsNo);
    sql.close();

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}

// ====================================== SELECT DATABASE getdataOrder
async function getdataOrder() {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .input("ID", sql.Int, 1)
      .query(sqlQueries.getOrders);

    dataFromSelectOrder = JSON.parse(JSON.stringify(result.recordsets));
    lengthSelectOrder = dataFromSelectOrder[0].length;
    numberOfRowsSelectOrder = Object.keys(dataFromSelectOrder[0][0]).length;

    // console.log(dataFromSelectOrder);
    // console.log("numberOfRowsSelectOrder = " + Object.keys(dataFromSelectOrder[0][0]).length);
    // console.log("lengthSelectOrder = " +dataFromSelectOrder[0].length);

    sql.close();

    return [dataFromSelectOrder, lengthSelectOrder, numberOfRowsSelectOrder];

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}
// ====================================== REMOVE - COMPONENT - DATABASE  - RECIPE HEAD  
async function deleteOrders(no) {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .input("no", sql.Int, no)
      .query(sqlQueries.deleteOrders)
    sql.close();

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}
// ====================================== ADD - NEW ORDERS - DATABASE    
async function addOrders(no, id, name, customerName, dueDate, recipeNo, operatorId, operatorName, quantity, idMixer, mixingTime, idPackingMachine) {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()

      .input("no", sql.Int, no)
      .input("id", sql.NVarChar(10), id)
      .input("name", sql.NVarChar(25), name)
      .input("customerName", sql.NVarChar(25), customerName)
      .input("dueDate", sql.Date, dueDate)
      .input("recipeNo", sql.Int, recipeNo)
      .input("operatorId", sql.Int, operatorId)
      .input("operatorName", sql.NVarChar(25), operatorName)
      .input("quantity", sql.Real, quantity)
      .input("idMixer", sql.Int, idMixer)
      .input("mixingTime", sql.Int, mixingTime)
      .input("idPackingMachine", sql.Int, idPackingMachine)
      
      .query(sqlQueries.addOrders)
    
    sql.close();

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}

// ====================================== UPDATE - ORDERS - DATABASE    
async function updateOrders(no, id, name, customerName, dueDate, recipeNo, operatorId, operatorName, quantity, idMixer, mixingTime, idPackingMachine) {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()

      .input("no", sql.Int, no)
      .input("id", sql.NVarChar(10), id)
      .input("name", sql.NVarChar(25), name)
      .input("customerName", sql.NVarChar(25), customerName)
      .input("dueDate", sql.Date, dueDate)
      .input("recipeNo", sql.Int, recipeNo)
      .input("operatorId", sql.Int, operatorId)
      .input("operatorName", sql.NVarChar(25), operatorName)
      .input("quantity", sql.Real, quantity)
      .input("idMixer", sql.Int, idMixer)
      .input("mixingTime", sql.Int, mixingTime)
      .input("idPackingMachine", sql.Int, idPackingMachine)
      
      .query(sqlQueries.updateOrders)
    
    sql.close();

  } catch (error) {
    console.log(error.message);
    sql.close();
  }
}


module.exports = {
  getdata: getdata,
  getdataKomponent: getdataKomponent,
  getdataRecipeHead: getdataRecipeHead,
  getdataRecipeBody: getdataRecipeBody,
  getdataOrder: getdataOrder,
  addComponent: addComponent,
  addRecipeH:addRecipeH,
  addRecipeB:addRecipeB,
  addOrders:addOrders,
  deleteComponent: deleteComponent,
  deleteOrders:deleteOrders,
  deleteRecipeH:deleteRecipeH,
  deleteRecipeB:deleteRecipeB,
  updateComponent: updateComponent,   
  updateRecipeH:updateRecipeH,
  updateRecipeB:updateRecipeB,
  updateOrders:updateOrders
};