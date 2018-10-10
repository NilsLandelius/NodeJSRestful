const winston = require('winston');

/**
 * When the Async middleware catches a error by a router it will call next() which will go to this error
 * handling middleware. 
 */
module.exports = function(err,req,res,next){
    winston.error(err.message , err);

    res.status(500).send("Something failed");
}