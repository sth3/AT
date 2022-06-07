var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var dealsRouter = require('./routes/deals');
var componentsRouters = require('./routes/components');

var cors = require('cors');
const sql = require('./src/data/events/dbIndexComponents');
const config = require('./config');

var Conection

var allDataFromSelectRecipe , lengthOfSelectRecipe , numberOfSelectRowsRecipe ;

const IDRecipe = [];
const NAMERecipe = [];
const NoRecipe = [];
const RecipeName1 = []; const RecipeSP1 = [];
const RecipeName2 = []; const RecipeSP2 = [];
const RecipeName3 = []; const RecipeSP3 = [];
const RecipeName4 = []; const RecipeSP4 = [];
const RecipeName5 = []; const RecipeSP5 = [];
const RecipeName6 = []; const RecipeSP6 = [];
const RecipeName7 = []; const RecipeSP7 = [];
const RecipeName8 = []; const RecipeSP8 = [];
const RecipeName9 = []; const RecipeSP9 = [];
const RecipeName10 = []; const RecipeSP10 = [];
const RecipeName11 = []; const RecipeSP11 = [];
const RecipeName12 = []; const RecipeSP12 = [];
const RecipeName13 = []; const RecipeSP13 = [];
const RecipeName14 = []; const RecipeSP14 = [];
const RecipeName15 = []; const RecipeSP15 = [];
const RecipeName16 = []; const RecipeSP16 = [];
const RecipeName17 = []; const RecipeSP17 = [];
const RecipeName18 = []; const RecipeSP18 = [];
const RecipeName19 = []; const RecipeSP19 = [];
const RecipeName20 = []; const RecipeSP20 = [];
const RecipeName21 = []; const RecipeSP21 = [];
const RecipeName22 = []; const RecipeSP22 = [];
const RecipeName23 = []; const RecipeSP23 = [];
const RecipeName24 = []; const RecipeSP24 = [];
const RecipeName25 = []; const RecipeSP25 = [];
const RecipeName26 = []; const RecipeSP26 = [];
const RecipeName27 = []; const RecipeSP27 = [];
const RecipeName28 = []; const RecipeSP28 = [];
const RecipeName29 = []; const RecipeSP29 = [];
const RecipeName30 = []; const RecipeSP30 = [];


const recipeArray = [];

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(cors());
app.use('/', indexRouter);
app.use('/deals', dealsRouter);
app.use('/components', componentsRouters);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




sql.getdataRecipe().then((result)=>{       // Select all from table Recipe  

  allDataFromSelectRecipe = result[0];
  lengthOfSelectRecipe= result[1];     
  numberOfSelectRowsRecipe = result[2]; 
  
  for ( let i = 0; i < lengthOfSelectRecipe; i++){
     
      NoRecipe[i] = allDataFromSelectRecipe[0][i].No; //    
      IDRecipe[i] = allDataFromSelectRecipe[0][i].ID; // 
      NAMERecipe[i] = allDataFromSelectRecipe[0][i].NAME; // 
      RecipeName1[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_1; RecipeSP1[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_1; //  
      RecipeName2[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_2; RecipeSP2[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_2; //  
      RecipeName3[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_3; RecipeSP3[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_3; //  
      RecipeName4[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_4; RecipeSP4[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_4; //  
      RecipeName5[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_5; RecipeSP5[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_5; //  
      RecipeName6[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_6; RecipeSP6[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_6; //  
      RecipeName7[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_7; RecipeSP7[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_7; //  
      RecipeName8[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_8; RecipeSP8[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_8; //  
      RecipeName9[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_9; RecipeSP9[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_9; //  
      RecipeName10[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_10; RecipeSP10[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_10; //  
      RecipeName11[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_11; RecipeSP11[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_11; //  
      RecipeName12[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_12; RecipeSP12[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_12; //  
      RecipeName13[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_13; RecipeSP13[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_13; //  
      RecipeName14[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_14; RecipeSP14[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_14; //  
      RecipeName15[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_15; RecipeSP15[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_15; //  
      RecipeName16[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_16; RecipeSP16[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_16; //  
      RecipeName17[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_17; RecipeSP17[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_17; //  
      RecipeName18[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_18; RecipeSP18[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_18; //  
      RecipeName19[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_19; RecipeSP19[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_19; //  
      RecipeName20[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_20; RecipeSP20[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_20; //  
      RecipeName21[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_21; RecipeSP21[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_21; //  
      RecipeName22[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_22; RecipeSP22[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_22; //  
      RecipeName23[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_23; RecipeSP23[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_23; //  
      RecipeName24[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_24; RecipeSP24[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_24; //  
      RecipeName25[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_25; RecipeSP25[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_25; //  
      RecipeName26[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_26; RecipeSP26[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_26; //  
      RecipeName27[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_27; RecipeSP27[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_27; //  
      RecipeName28[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_28; RecipeSP28[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_28; //  
      RecipeName29[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_29; RecipeSP29[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_29; //  
      RecipeName30[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_30; RecipeSP30[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_30; //  
      
      recipeArray.push({id: i, title: NAMERecipe[i]  + i, value: '' + IDRecipe[i]} )
      //console.log(recipeArray[i]);
  } 
  });  


sql.getdata().then((result)=>{         // Conection Status 
  Conection = result; 
  });    



module.exports = app;
