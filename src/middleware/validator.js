
async function tokenValidator(req, res, next){

  const bearerHeader = req.headers['authorization'];  

  if(typeof bearerHeader !== 'undefined'){  //check if bearer is undefined

    const bearer = bearerHeader.split(' ');    //split bearerHeader at space to get token

    const bearerToken = bearer[1];      // get the token from bearer list

    req.token = bearerToken;    //set token

    next()    // call next middleware

  }else{
    // If no authorization token
    return res.status(403).json({
      status: 'Failed',
      message:'You are not authorised to carry out this action'})
  }
}


module.exports = {
  tokenValidator
}