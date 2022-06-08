var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var dealsRouter = require('./routes/deals');
var componentsRouters = require('./routes/components');
var recipesRouters = require('./routes/recipes');

var cors = require('cors');
const sql = require('./src/data/events/dbIndexComponents');
const config = require('./config');

var Conection

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
//app.use('/recipes', recipesRouters);

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


sql.getdata().then((result)=>{         // Conection Status 
  Conection = result; 
  });    



module.exports = app;
