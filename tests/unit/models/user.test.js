const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('generateAuthToken',()=>{
    it('Should return a valid JWT',()=>{
        /**
         * Creating a payload that the new User needs, the mongoose id is converted to a HexString
         * Because jwt encodes the _id as 64-bit. If the ObjectId is left as is then the validation
         * by expect will fail because the ObjectId will come out from jwt.verify as the encoded string. 
         * 
         * When running Jest the Node.env is running test so config.get("jwtPrivateKey") is looking in the test.json
         * file under the config folder.
         */
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(), 
            isAdmin:true
        };
        const user = new User(payload);
        const token = user.generateAuthToken();

        const decoded = jwt.verify(token,config.get("jwtPrivateKey"));

        expect(decoded).toMatchObject(payload);
    });
});