const express = require('express')
const api = require('./api')
const app = express()
require('express-ws')(app)

app.use('/api', api)

app.use(express.static('dist'))

app.listen(80, () => console.log(`Ready to Feud!`))