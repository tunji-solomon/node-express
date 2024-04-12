const jwt = require('jsonwebtoken');

require('dotenv').config()  //help load .env files into process.env.

async function jwtVerify(req, res){

  //verify token and secret key is valid
  return jwt.verify(req.token, process.env.jwt_secretKey, async (err, authData) => {

    // if error 
    if(err){
        res.status(404).json({
        status: 'Failed',
        message : 'Error verifying user credentials'
      })

    }else{
      return authData
    }
  })
}

// export module
module.exports = {
  jwtVerify
}