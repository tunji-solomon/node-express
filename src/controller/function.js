const repo = require('../repository/userRepo')

// create user function
async function createfn(req, res, id, username, email, password){
  try {
    const create = await repo.createUser(id, username, email, password) //create user with passed arguments
    return res.status(201).json({
      status: 'Success',
      message: 'User created',
      data: {
        id,
        username,
        email,
      }
    })
    
  } catch (error) {
    console.log(error.message) // log error 
    res.status(500).json({ 
      status: 'Failed',
      message: 'Error creating user'
    })
  }
}

module.exports = {
  createfn
}