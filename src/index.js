const express = require('express')
const bodyParser = require('body-parser') 
const app = express()
const router = require('./route/router')
const port = 2000

app.use(bodyParser.json())  // parsing the request body

app.listen(port, () => {
  console.log(`app running on port ${port}`)
})

app.use('/', router)

