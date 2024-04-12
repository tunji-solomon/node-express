const pool = require('../../datasource/db')
const uuid = require('uuid')
let id = uuid

// call the table function

// callback functions

// view all employees
  async function viewAllEmployee(){
    return await pool.query('SELECT * FROM workers')
}

  // create new employee
  async function createEmployee(name,email,username,password){
    return await pool.query(`INSERT INTO workers(id,name,email,username,password) values ('${id.v4()}', '${name}', '${email}', '${username}', '${password}')`)
}

  // update employee info using id
  async function updateEmployee(name, email, username, password,id){
    return await pool.query(`UPDATE workers SET name = '${name}', email = '${email}', username = '${username}', password = '${password}' WHERE id = '${id}'`)
}

  // delete employee with passed id
  async function deleteEmployee(id){
    return await pool.query(`DELETE FROM workers WHERE id = '${id}'`)
}

  // view employee with passed id
  async function viewEmployeeById (id){
    return await pool.query(`SELECT id, name, email, username FROM workers WHERE ID = $1`,[id])
}

  // delete all employee
  async function deleteAll(){
    return await pool.query(`DELETE FROM workers`)
}


module.exports = {
  viewAllEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  viewEmployeeById,
  deleteAll
}