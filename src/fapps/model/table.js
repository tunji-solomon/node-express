const pool = require('../../datasource/db')


// creating the table
  function createTable(){
    pool.query(`CREATE TABLE IF NOT EXISTS workers(
    id varchar PRIMARY KEY,
    name varchar(250),
    email varchar,
    username varchar,
    password varchar
  );`,(err)=>{
    if(err){
      console.log('error creating table', err)
    }else{
      console.log('workers table exists or created')
    }
  })} 

  
module.exports = {
  createTable
}



