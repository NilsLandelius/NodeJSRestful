/**
 * 
 * This middleware functions as a centrelized error handler. All routes will call this function and pass it's
 * incoming request and responses. This middleware simply returns whatever the routers response was back to index.js and express
 * but its adds a try,cath-block to it allowing us to catch any exceptions in one place and handle errors
 * from one file.
 * 
 * NOT USED, replaced by npm package express-async-errors
 * 
 * To implement you need to alter routers from:
 * router.get('/', async(req, res) => {
 *  const genres = await Genre.find().sort('name');
 *  res.send(genres);
 *  });
 * 
 * TO: 
 * router.get('/', asyncMiddleware((req, res) => {
 *   const genres = await Genre.find().sort('name');
 *   res.send(genres);
 *   })); 
 * 
 * You wrap the req,res inside the function async, in the example I've assigned the async middleware to a constant at the beginning as
 * const asyncMiddleware = require('../middleware/async');
 */

module.exports = function middleware(handler){
   return async (req,res,next) =>{
       try{
           await handler(req,res)
       }catch(ex){
           next(ex);
       }
    }
};