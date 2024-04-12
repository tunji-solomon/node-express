const { randomBytes } = require('crypto')

//generate secret key
randomBytes(32, (err, buf) => {
  if (err) throw err;
  console.log(`Secret key: ${buf.toString('hex')}`);
})

