const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function(){
    // Will catch any exception in the node process that was not caught by express or a catchblock
winston.handleExceptions(
    new winston.transports.Console({colorize:true,prettyPrint:true}),
    new winston.transports.File({filename:'uncaughtExceptions.log'})
  );
  
  // Will catch any unhandled promise in the node process that was not caught by express or a catchblock
  // Then throw that exception to turn it into a unhandledException instead thus makeing winston handle it.
  process.on('unhandledRejection', (ex) =>{
    throw ex;
  })
  
  //Logger for logfile.log
  winston.add(winston.transports.File,{filename: 'logfile.log'});
  //logger that logs in MongoDB, set to errors only.
  winston.add(winston.transports.MongoDB,{
    db:'mongodb://localhost/vidly',
    level: "error"
  });
};