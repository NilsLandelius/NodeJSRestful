const user = require('../../models/user');
const jwt = require('jsonwebtoken');

describe('generateAuthToken',()=>{
    it('Should generate a jwt token with 2 parameters and a password',()=>{
        const generateAuthToken = function(id,isAdmin){
           const token = jwt.sign({_id: id, _isAdmin: isAdmin},"privateKey");
            return token;
        }
        
        expect(jwt.verify(generateAuthToken("Nils",true),"privateKey")).toMatchObject({_id:"Nils",_isAdmin:true});
    });
});