require('./config/config');
require('./globals');

const express      = require('express');
const logger       = require('morgan');
const bodyParser   = require('body-parser');
const passport     = require('passport');
const v1 = require('./routes/v1');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Passport
app.use(passport.initialize());

// connect to database and load models
const models = require("./models");
models.sequelize.authenticate().then((res) => {
    console.log("DATABASE RESULT", res);
    console.log('Connected to SQL database');
})
.catch(err => {
    console.error('Unable to connect to SQL database:', err);
});
if(CONFIG.app==='development'){
    models.sequelize.sync();//creates tables from models
    // models.sequelize.sync({ force: true });//good for testing
}


// CORS
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Content-Type');
    // Pass to next layer of middleware
    next();
});

// set up routes and handle errors

app.use('/v1', v1);

app.use('/', function(req, res){
   res.statusCode = 200;//send the appropriate status code
   res.json({status:"success", message:"Parcel Pending API", data:{}})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;

