var sqlConfig = require("./dbConfig.js");// DATA NA SPOJENIE S DATABAZOV
const sql = require('mssql/msnodesqlv8');
const utils = require('../utils');

var dataFromSelectKomponent, lengthSelectKomponent, numberOfRowsSelectKomponent;
var dataFromSelectRecipe, lengthSelectRecipe, numberOfRowsSelectRecipe;
var dataFromSelectOrder, lengthSelectOrder, numberOfRowsSelectOrder;

//console.log(sqlConfig); // OVERENIE SPRAVNOSTI DAT NA SPOJENIE S MSSQL
// ====================================== VYPIS SPOJENIA
  async function getdata() {    
    try {  
        let pool = await sql.connect(sqlConfig);
        console.log("sql server connected");
        var connection = "sql server connected"
        return connection;
      } catch(error){
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
        } catch(error){
        console.log(error.message); 
        sql.close();    
        }
      }
  // ====================================== ADD - NEW COMPONENT - DATABASE    
  async function addComponent(componentsNo, componentsID, componentsName ) {    
    try {  
        let pool = await sql.connect(sqlConfig);
        const sqlQueries = await utils.loadSqlQueries('events');	
        let result = await pool
          .request()
          .input( "No", sql.Int, componentsNo )
          .input( "ID", sql.NVarChar( 10 ), componentsID )
          .input( "NAME", sql.NVarChar( 25 ), componentsName )	
          .query(sqlQueries.addComponents)
          //.query('INSERT INTO [dbo].[COMPONENTS]([No],[ID],[NAME])VALUES(@No, @ID, @Name)');      // where LINE = @ID'     
          //console.log(sqlQueries.addComponents);
          sql.close();  

        } catch(error){
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
          .input( "No", sql.Int, componentsNo )          
          .query(sqlQueries.deleteComponents)          
          sql.close();  

        } catch(error){
        console.log(error.message); 
        sql.close();    
        }
      }
  // ====================================== UPDATE - COMPONENT - DATABASE     
  async function updateComponent(componentsID, componentsName , componentsNo ) {    
    try {  
        let pool = await sql.connect(sqlConfig);
        const sqlQueries = await utils.loadSqlQueries('events');	
        let result = await pool
          .request()
          .input( "No", sql.Int, componentsNo )          
          .input( "ID", sql.NVarChar( 10 ), componentsID )
          .input( "Name", sql.NVarChar( 25 ), componentsName )	          
          .query(sqlQueries.updateComponents) 
          console.log(sqlQueries.updateComponents);  
          console.log(componentsID +' '+ componentsName +' '+ componentsNo  );       
          sql.close();  

        } catch(error){
        console.log(error.message); 
        sql.close();    
        }
      }



















  async function getdataRecipe() {    
    try {  
        let pool = await sql.connect(sqlConfig);
        let result = await pool
          .request()
          .input("ID",sql.Int, 1)
          .query('select * from [AT].[dbo].[RECIPE]');          
                      
          dataFromSelectRecipe = JSON.parse(JSON.stringify(result.recordsets));   // OBEJKT DO POLA       
          lengthSelectRecipe = dataFromSelectRecipe[0].length; // POCET ZAZNAMOV
          numberOfRowsSelectRecipe = Object.keys(dataFromSelectRecipe[0][0]).length; // POCET STLPCOV V TABULKE

         // console.log(dataFromSelectRecipe); // VYPIS DAT
         // console.log("numberOfRowsSelectRecipe = " + Object.keys(dataFromSelectRecipe[0][0]).length); //VYPOS POCET STLPCOV
         // console.log("lengthSelectRecipe = " +dataFromSelectRecipe[0].length); // VYPIS POCET ZAZNAMOV

          sql.close();  // KONIEC SPOJENIA S DATABAZOV

          return [dataFromSelectRecipe, lengthSelectRecipe, numberOfRowsSelectRecipe];    // VRATENIE DAT S FUNKCIE     
          
        } catch(error){

        console.log(error.message); 
        sql.close();    

        }
      }

  async function getdataOrder() {    
    try {  
        let pool = await sql.connect(sqlConfig);
        let result = await pool
          .request()
          .input("ID",sql.Int, 1)
          .query('select * from [AT].[dbo].[ORDER]');          
                      
          dataFromSelectOrder = JSON.parse(JSON.stringify(result.recordsets));          
          lengthSelectOrder = dataFromSelectOrder[0].length;
          numberOfRowsSelectOrder = Object.keys(dataFromSelectOrder[0][0]).length;

         // console.log(dataFromSelectOrder);
         // console.log("numberOfRowsSelectOrder = " + Object.keys(dataFromSelectOrder[0][0]).length);
         // console.log("lengthSelectOrder = " +dataFromSelectOrder[0].length);

          sql.close();  

          return [dataFromSelectOrder, lengthSelectOrder, numberOfRowsSelectOrder];         
          
        } catch(error){
        console.log(error.message); 
        sql.close();    
        }
      } 
                 

  module.exports = { 
      getdata: getdata,
      getdataKomponent: getdataKomponent,
      getdataRecipe: getdataRecipe,
      getdataOrder: getdataOrder,
      addComponent:addComponent,
      deleteComponent:deleteComponent,
      updateComponent:updateComponent
    };