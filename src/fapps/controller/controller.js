const app = require('../repo/dbQuery')
const validator = require('email-validator')
const mymodule = require('./functions')
const jwt = require('jsonwebtoken')
const table = require('../../fapps/model/table')

const { jwtVerify } = require('../../middleware/jwtVerify') // importing function for jwt verification

//function to view all records
async function viewAll(req, res){
  const verify = await jwtVerify(req, res)  // check if token and secret key is valid
  if (verify){
    const response = await app.viewAllEmployee(); // get all employee from the database

    if (response.rows.length === 0){
      return res.status(200).json({
        authuser: verify,
        message: 'No record found'
      })
    }
    // remove password from return
    response.rows.forEach((data)=>{
      delete data.password
    })
    
    return res.send({
      status : 'Success',
      authuser : verify,
      message : 'Record fetch succesfully',
      count: response.rowCount,
      data: response.rows
    })
  }
}

//function to create new record 
async function createEmp(req, res){
  const verify = await jwtVerify(req, res)
  if(verify){
    //create workers table if not exist
    table.createTable()
    const {name, email, username, password} = req.body
    const isValid = validator.validate(email)   // validate email using email-validator

    // all fields required validation
    if(!name || !email || !username || !password){
        return res.send({
        status: 'Failed',
        message: 'All field required.. name, email, username and password field'
      })
    }else{
      if(isValid){
          const allEmployee = await app.viewAllEmployee() // get all existing employee
          
          // checking if table is empty
          if(allEmployee.rows.length < 1){
            return await mymodule.createFn(req, res, name, email, username, password, verify);  // create new employee

          // if table not empty
          }else{
            for(let i = 0; i < allEmployee.rows.length; i++){
              if(allEmployee.rows[i].username === username){ 
                //if username already exists
                return res.send({
                  status: 'Failed',
                  message: `Employee with username: ${username} already exists`
                })
              }else if(allEmployee.rows[i].email === email){

                //if email already exists
                return res.send({
                  status: 'Failed',
                  message: `Employee with email: ${email} already exists.. try something different.`
                })
              }
            }
            // email and username check passed
            return mymodule.createFn(req, res, name, email, username, password, verify); // create new employee
          }
      }
      //  if invalid email is passed
      return res.status(500).json({
        status: 'Failed',
        message: 'Invalid email address passed.. check and try again'
      })
    }
  }
}

// view record by id 
async function viewById(req,res){
  const verify = await jwtVerify(req, res);
  if (verify) {
    const { id } = req.params;  // fetch id from the request parameter
    const allEmployee = await app.viewAllEmployee(); // get all employee
    for(let i = 0; i < allEmployee.rows.length; i ++){
      if(id === allEmployee.rows[i].id){
        const response = await app.viewEmployeeById(id); // get employee by id
        return res.status(200).json({
          status: 'Success',
          authuser: verify,
          message: 'Employee info retrieved succesfully',
          data: response.rows[0]
        })
      }
    }
    return res.status(404).json({
        status: 'Failed',
        message: `Employee with id:${id} does not exist, try a different id..`
    })
  }
}

// update records
async function updateEmp(req, res){
  const verify = await jwtVerify(req, res)
  if (verify){
    const { id } = req.params;   // get id from the request parameter by destructuring
    const allEmployee = await app.viewAllEmployee();  // get all employee from the database
    for(let i = 0; i < allEmployee.rows.length; i ++){

      // checking if id paased exist in the table
      if(id === allEmployee.rows[i].id){
        const response = await app.viewEmployeeById(id); // get employee records with id
        const {name, email, username, password} = req.body; 
        const oldName = response.rows[0].name;
        const oldUsername = response.rows[0].username;
        const OldEmail = response.rows[0].email;
        const oldPassword = response.rows[0].password;
        const newName = name || oldName;
        const newUsername = username || oldUsername;
        const newEmail = email || OldEmail;
        const newPassword = password || oldPassword;

        // using a try-catch to update or log error as applicable
        try {
          await app.updateEmployee(newName, newEmail, newUsername, newPassword, id) //update employee
          // update succesful
          return res.status(200).json({
              status: 'Success',
              authuser: verify,
              message: `Employee's record updated succesfully`,
              data:{
                name: newName,
                email: newEmail,
                username: newUsername,
              }
            })
        } catch (error) {
          // error updating records
          console.log(error)
          return res.status(500).json({
            status: 'Failed',
            message: 'Error updating records'
          })
        }
      }
    }
    // id does not exist
    return res.status(404).json({
      status: 'Failed',
      message: `Employee with id:${id} does not exist, try a different id..`
    })
  }
}

// delete record by id passed
async function deleteOne(req, res){
  const verify = await jwtVerify(req, res);
  if (verify){
    const { id } = req.params //get id passed
    try {
      const response = await app.viewEmployeeById(id); // get employee from the database by id.
      if (response.rows.length === 1){
        await app.deleteEmployee(id) ;  // delete employee with passed id
        return res.status(200).json({
          status: 'sucess',
          authuser: verify,
          message: `Employee with id: ${id} deleted.`
        })
        // if id does not exist 
      } else{
        return res.status(404).json({
          status: 'Not found',
          message: `Employee with id: ${id} does not exist, try a different id..`
        })
      } 
      // if error 
    } catch (error) {;
      console.log(error);
      return res.status(500).json({
        status:'Failed', 
        message: 'Error deleting employee from the database'
      })
    }
  }
}

  // delete all records
async function delAll(req, res){
  const verify = await jwtVerify(req, res);
  if(verify){
    try {
      const response = await app.deleteAll()
      return res.status(200).json({
        status: 'success',
        authuser: verify,
        message: 'all records deleted',
      })
    } catch (error) {
      console.log(error);
      return res.send({
        message: 'Delete error: Failed to delete data'
      })
    }
  }
}


module.exports = {
  viewAll,
  createEmp,
  viewById,
  updateEmp,
  delAll,
  deleteOne
}