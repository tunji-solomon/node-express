const db = require('../datasource/db')
const uuid = require('uuid')
const table = require('../model/user')

table.createUserTable() // create table if not exist


async function createUser(id,username, email, password){
  return await db.query(`INSERT INTO staff(id,username,email,password) VALUES('${id}','${username}','${email}',
  '${password}')`)
}

async function getAllUser(){
  return await db.query(`SELECT * FROM staff`)
}

async function getOneUser(id){
  return await db.query(`SELECT id, username, email FROM staff WHERE id = ${id} `)
}

async function delAllUser(){
  return await db.query(`DELETE FROM staff`)
}


module.exports = {
  createUser,
  getAllUser,
  getOneUser,
  delAllUser
}