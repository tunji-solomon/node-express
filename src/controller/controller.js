const repo = require('../repository/userRepo')
const { authUserSchema } = require('../authenticate-user/authUser')
const mymodule = require('./function')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

//load .env files into process.env.
require('dotenv').config()



// create user
async function userCreator(req, res){
  //generate id using uuidv4
  const id = uuid.v4()
  //generate username, email and password by destructuring request.body
  let { username, email, password} = req.body;
  try {
    //validate request body using authUserSchema
    await authUserSchema.validateAsync(req.body);
    const user = await repo.getAllUser();    //getting all existing user in the database
    //if no existing user, then create
    if ( user.rows.length === 0){
      return mymodule.createfn(req, res, id, username, email, password);
    //if existing user, check...
    }else{
      for(let i = 0; i < user.rows.length; i++){
        if (user.rows[i].username === username){
          return res.json({
            message:'username already exist'
          })
        } else if (user.rows[i].email === email){
          return res.json({
            message:'email already exist'
          })
        }
      }
      //hashing password
      const saltRound = 10;
      //generate salt
      bcrypt.genSalt(saltRound, (err, salt)=>{
        if(err){
          console.log(err.message)
          return res.status(500).json({
            message: 'Failed'
          })
        }else{
          //generate hash for input password
          bcrypt.hash(password, salt, async (err, hash)=>{
            if (err){
              console.log(err.message)
              return res.status(500).json({
                statu: 'Failed',
              })
            }
            password = hash    //set password to hash generated for storage purposes
          })
        }
      })
      return mymodule.createfn(req, res, id, username, email, password)  // username and email validation passed, create user.
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: error.message,
    })
  } 
}



//get all user
async function getAll(req, res){
  try {
    const response = await repo.getAllUser();    //get all user from the databse
    //if no existing user
    if(response.rows < 1){
      return res.send({
        status: 'Success',
        message: 'Database is empty'
      })
    }
    //remove user password
    response.rows.forEach((data)=>{
      delete data.password
    })
    //return all user
    return res.status(200).json({
      status: 'Successful',
      data: response.rows
    })
    //catch error while querying the database 
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      status: 'Failed',
      message: `Error fetching data`
    })
  }
}



// login user
async function loginUser(req, res){
  const { username, password } = req.body //get value from the request body by destructuring
  try {
    const loginUser = await repo.getAllUser(); // get all existing user
    if(loginUser.rows.length === 0){
      return res.json({
        message: 'No record found'
      })
    }
    for(let i = 0; i < loginUser.rows.length; i++){
      // check if passed username matches any username in the database
      if(loginUser.rows[i].username === username){
        const hashedPassword = loginUser.rows[i].password // getting the hashed password from the table

        //compare the hashed password with the inputed password for match
        return bcrypt.compare(password, hashedPassword, (err, result) =>{
          if(result){
            const user = loginUser.rows[i] //get user

            delete user.password // remove password

            //sign in user, wityh the user as payload to jwt.sign method
            //passing the secret key
              jwt.sign({user:user}, process.env.jwt_secretKey, (err, token) =>{
                  res.status(200).json({
                  status: 'Success',
                  user,
                  token  // token generated for authorization
                })
            });
          // if input password does not match
          }else{
            return res.json({
              status: 'Password missmatch',
              message: 'Password is incorrect. try again'
            })
          }
        }) 
      }
    }
    // if input username does not match any
    return res.status(404).json({
      status: 'Failed',
      message: 'Username does not exist... try again'
    })
  } catch (error) {
    console.log(error.message)
    return res.json({
      message: 'Internal error'
    })   
  } 
}

async function dellAll(req, res){
  try {
    const response = await repo.delAllUser()
    return res.status(200).json({
      status: 'Success',
      message: 'All records deleted successfully'
    })
  } catch (error) {
    console.log(error)
    res.json({
      status: 'Failed',
      message: 'Error deleting records'
    })
    
  }
}
 


module.exports = {
  userCreator,
  getAll,
  loginUser,
  dellAll
}