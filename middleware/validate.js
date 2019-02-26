
/**
 * This middleware takes the validationfunction from the route, this way the route
 * can supply a validationfunction from any model Genre,Movie,Rental,User etc and then 
 * validate the request.body...By implementing this middleware in a route, you can
 * eliminate the need to call the validatefunction at the beginning. 
 * 
 */

module.exports = (validator) =>{
    return (req,res,next)=>{
        const { error } = validator(req.body)
        if(error) return res.status(400).send('Input validation error');
        next();
    }
}