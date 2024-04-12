const joi = require('joi')
// const secret = require('./keys')


//creating user schema
const authUserSchema = joi.object({

  email : joi.string().email().lowercase().required(),   //email: must be strings, a valid email format, and its required

  username : joi.string().min(5).max(12).required(),   //username: must be strings, minimum: 5, max: 12 and is required

  password : joi.string().pattern(new RegExp('^([a-zA-Z]+)([0-9]+)([@#$&*])$')).min(6).max(12).required()
            .messages({

              "string.pattern.base": `Password must contain alphanumeric characters, starting with an alphabet and ends with not more than one special character. should be between 6 to 12 characters.`,
              "string.empty": `Password cannot be empty`,
              "any.required": `Password is required`,

            })   //password: must be strings, starts with letters, contains atleast 1 number and not more than 1 special character and its required.



})

module.exports = {
  authUserSchema
}