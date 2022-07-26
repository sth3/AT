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
async function getDataComponent() {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .query(sqlQueries.getComponents);

    let no = [], id = [], name = [], lastUpdate = [], dataArray = [], missingNo;
    console.log('result get component', result.recordsets[0].length);

    if (result.recordsets[0].length > 0) {

      for (let i = 0; i < result.recordsets[0].length; i++) {
        no[i] = result.recordsets[0][i].no; //    
        id[i] = result.recordsets[0][i].id;
        name[i] = result.recordsets[0][i].name.trim(); // 
        lastUpdate[i] = result.recordsets[0][i].lastUpdate; // 


        dataArray.push({ no: no[i], id: id[i], name: name[i], lastUpdate: lastUpdate[i] })
      }
      for (let k = 1; k <= 2147483647; k++) {
        if (no[k - 1] != k) {
          missingNo = k;
          //console.log('missing component ' + missingNo);
          break;
        }
      };
      //console.log(dataArray[result.recordsets[0].length - 1]);


      return [dataArray, result.recordsets[0].length, Object.keys(result.recordsets[0][0]).length, missingNo];
    }
    return [dataArray, 0, 0, 1];
    //console.log(obj[0][0].SP9);
    //console.log(JSON.stringify(result.recordsets[0], null, 2)); --- objekt do string 
  } catch (error) {
    console.log(error.message);

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


  } catch (error) {
    console.log(error.message);

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


  } catch (error) {
    console.log(error.message);

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
    //console.log(sqlQueries.updateComponents);
    //console.log(componentsID + ' ' + componentsName + ' ' + componentsNo);


  } catch (error) {
    console.log(error.message);

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

    let no = [], id = [], name = [], lastUpdate = [], dataArray = [], missingNo;
    if (result.recordsets[0].length > 0) {
      for (let i = 0; i < result.recordsets[0].length; i++) {
        no[i] = result.recordsets[0][i].no; //    
        id[i] = result.recordsets[0][i].id;
        name[i] = result.recordsets[0][i].name.trim(); // 
        lastUpdate[i] = result.recordsets[0][i].lastUpdate; // 


        dataArray.push({ no: no[i], id: id[i], name: name[i], lastUpdate: lastUpdate[i] })
      }

      for (let k = 1; k <= 2147483647; k++) {
        if (no[k - 1] != k) {
          missingNo = k;
          //console.log('missing Recipe ' + missingNo);
          break;
        }
      };
      //console.log(dataArray[result.recordsets[0].length - 1]);


      return [dataArray, result.recordsets[0].length, Object.keys(result.recordsets[0][0]).length, missingNo];
    }
    return [dataArray, 0, 0, 1];

  } catch (error) {

    console.log(error.message);


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

    let recipeNo = [], componentNo = [], componentSP = [], dataArray = [];
    if (result.recordsets[0].length > 0) {
      for (let i = 0; i < result.recordsets[0].length; i++) {
        recipeNo[i] = result.recordsets[0][i].recipeNo; //    
        componentNo[i] = result.recordsets[0][i].componentNo;
        componentSP[i] = Number(result.recordsets[0][i].componentSP); // 


        dataArray.push({ recipeNo: recipeNo[i], componentNo: componentNo[i], componentSP: componentSP[i] })

      }



      return [dataArray, result.recordsets[0].length, Object.keys(result.recordsets[0][0]).length];    // VRATENIE DAT S FUNKCIE     
    }
    return [dataArray, 0, 0];
  } catch (error) {

    console.log(error.message);


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



  } catch (error) {
    console.log(error.message);

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
    // console.log(noRecipe, noComponent, componentSP);


  } catch (error) {
    console.log(error.message);

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


  } catch (error) {
    console.log(error.message);

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


  } catch (error) {
    console.log(error.message);

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


  } catch (error) {
    console.log(error.message);

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


  } catch (error) {
    console.log(error.message);

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

    let no = [], id = [], name = [], customerName = [], dueDate = [], recipeNo = [],
      operatorId = [], operatorName = [], quantity = [], idMixer = [], mixingTime = [],
      idPackingMachine = [], createdAt = [], lastUpdate = [], completedAt = [], dataArray = [];
    if (result.recordsets[0].length > 0) {
      for (let i = 0; i < result.recordsets[0].length; i++) {
        no[i] = result.recordsets[0][i].no; //    
        id[i] = result.recordsets[0][i].id; // 
        name[i] = result.recordsets[0][i].name.trim(); //             
        customerName[i] = result.recordsets[0][i].customerName.trim(); //             
        dueDate[i] = result.recordsets[0][i].dueDate; //             
        recipeNo[i] = result.recordsets[0][i].recipeNo; //             
        operatorId[i] = result.recordsets[0][i].operatorId.trim(); //             
        operatorName[i] = result.recordsets[0][i].operatorName.trim(); //             
        quantity[i] = Number(result.recordsets[0][i].quantity.toFixed(3)); //             
        idMixer[i] = result.recordsets[0][i].idMixer; //             
        mixingTime[i] = result.recordsets[0][i].mixingTime; //             
        idPackingMachine[i] = result.recordsets[0][i].idPackingMachine; //             
        createdAt[i] = result.recordsets[0][i].createdAt; //             
        lastUpdate[i] = result.recordsets[0][i].lastUpdate; //             
        completedAt[i] = result.recordsets[0][i].completedAt; //   


        dataArray.push({
          no: no[i], id: id[i], name: name[i], customerName: customerName[i], dueDate: dueDate[i],
          recipeNo: recipeNo[i], operatorId: operatorId[i], operatorName: operatorName[i], quantity: quantity[i],
          idMixer: idMixer[i], mixingTime: mixingTime[i], idPackingMachine: idPackingMachine[i], createdAt: createdAt[i], lastUpdate: lastUpdate[i], completedAt: completedAt[i]
        });

      }


      for (let k = 1; k <= 2147483647; k++) {
        if (no[k - 1] != k) {
          missingNo = k;
          //console.log('missing component ' + missingNo);
          break;
        }
      };
      //console.log(dataArray[result.recordsets[0].length - 1]);


      return [dataArray, result.recordsets[0].length, Object.keys(result.recordsets[0][0]).length, missingNo];

    }
    return [dataArray, 0, 0, 1];

  } catch (error) {
    console.log(error.message);

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


  } catch (error) {
    console.log(error.message);

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



  } catch (error) {
    console.log(error.message);

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


  } catch (error) {
    console.log(error.message);

  }
}

// ====================================== SELECT DATABASE getStatDose
async function getStatDose() {
  try {
    let pool = await sql.connect(sqlConfig);
    const sqlQueries = await utils.loadSqlQueries('events');
    let result = await pool
      .request()
      .query(sqlQueries.getStatDose);


    let no = [], datetime = [], name = [], componentSP = [], componentPV = [], dataArray = [], idContainer = [], idOrder = [];
    if (result.recordsets[0].length > 0) {
      for (let i = 0; i < result.recordsets[0].length; i++) {
        no[i] = result.recordsets[0][i].no; //    
        datetime[i] = result.recordsets[0][i].datetime;
        name[i] = result.recordsets[0][i].name.trim(); // 
        componentSP[i] = Number(result.recordsets[0][i].componentSP.toFixed(3)); // 
        componentPV[i] = Number(result.recordsets[0][i].componentPV.toFixed(3)); // 
        idContainer[i] = result.recordsets[0][i].idContainer.trim();
        idOrder[i] = result.recordsets[0][i].idOrder.trim();

        dataArray.push({ no: no[i], datetime: datetime[i], name: name[i], componentSP: componentSP[i], componentPV: componentPV[i], idContainer: idContainer[i], idOrder: idOrder[i] })

      }
      //console.log(dataArray[result.recordsets[0].length - 1]);


      return [dataArray, result.recordsets[0].length, Object.keys(result.recordsets[0][0]).length];
    }
    return [dataArray, 0, 0, 1];
  } catch (error) {
    console.log(error.message);

  }
}

module.exports = {
  getdata: getdata,
  getDataComponent: getDataComponent,
  getdataRecipeHead: getdataRecipeHead,
  getdataRecipeBody: getdataRecipeBody,
  getdataOrder: getdataOrder,
  getStatDose: getStatDose,
  addComponent: addComponent,
  addRecipeH: addRecipeH,
  addRecipeB: addRecipeB,
  addOrders: addOrders,
  deleteComponent: deleteComponent,
  deleteOrders: deleteOrders,
  deleteRecipeH: deleteRecipeH,
  deleteRecipeB: deleteRecipeB,
  updateComponent: updateComponent,
  updateRecipeH: updateRecipeH,
  updateRecipeB: updateRecipeB,
  updateOrders: updateOrders
};