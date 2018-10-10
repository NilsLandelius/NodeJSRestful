const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

    /**
     * for passwords it's better to use "npm i joi-password-complexity" where you can set things like
     *  {
            min: 8,
            max: 26,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 1,
            requirementCount: 3,
        }
        to validate for more complex passwords.
     */

const userSchema = new mongoose.Schema({
    username:{
        type: String,
         required: true,
        minlength: 5,
        maxlength: 50
    },
    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    email:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    isAdmin: Boolean
});
  
   userSchema.methods.generateAuthToken = function() {
     const token = jwt.sign({_id : this._id,isAdmin: this.isAdmin},config.get('jwtPrivateKey'));
     return token;
   };
  
  const User = mongoose.model('User',userSchema);

function validateUser(user) {
  const schema = {
    username: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
    email:  Joi.string().min(5).max(255).required().email()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;