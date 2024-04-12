const { Client } = require('pg') // importing the Client class of the pg library
require('dotenv').config()  // using dotenv to load .env file into process.env.

// creating an instance of the Client class to make connection to the databse
const db = new Client({
  name : process.env.db_name,
  user : process.env.db_user,
  password : process.env.db_password,
  host : process.env.db_host,
  port : process.env.db_port

})
db.connect() // connect to the database
 .then(()=>{
  return console.log('database connected')
 })

.catch ((error)=>{
  return console.log('error creating connection to the databse', error)
})

module.exports = db;