const app = require('../repo/dbQuery')
const validator = require('email-validator')

async function Valid(req, res, username, email,id){
  const isValid = validator.validate(email)
  if(isValid){
    const allEmployee = await app.viewAllEmployee()
    for(let i = 0; i < allEmployee.rows.length; i++){
      if(allEmployee.rows[i].id === id){
        if(allEmployee.rows[i].username === username || allEmployee.rows[i].email === email){
        }
      }else{
        if(allEmployee.rows[i].username === username){
          return res.send({
            status: 'failed',
            message: `worker with username: ${username} already exists`
          })
        }else if(allEmployee.rows[i].email === email){
          return res.send({
            status: 'failed',
            message: `worker with email: ${email} already exists`
          })
        }

      }

    }
    return true;
  }else{
      res.send({
      status: 'failed',
      message: 'invalid email'
    })
    return false;
  }
}


async function createFn(req, res, name, email,username, password, authData){
  try {
    const response = await app.createEmployee(name, email, username, password)
    return res.status(201).json({
      status: 'success',
      authuser: authData,
      message: 'worker created succesfully',
      data:{
        name,
        email,
        username,

      }
    }) 
  } catch (error) {
    console.log(error)
   return res.send({
      status: 'failed',
      message: 'Error creating new employee'
    })
    
  }

}

module.exports = {
  Valid,
  createFn
}

