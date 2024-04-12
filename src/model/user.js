const db = require('../datasource/db')


async function createUserTable(){

  await db.query(`CREATE TABLE IF NOT EXISTS Staff(
    id varchar PRIMARY KEY,
    username varchar,
    email varchar,
    password varchar
  );`, (err) => {

    if (err) {
      console.log('error creating table')

    }else{
      console.log('table created');
    }
  }
 )
}


module.exports = {
  createUserTable
}