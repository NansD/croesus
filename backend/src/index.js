const express = require('express')
const cors = require('cors')
const { StatusCodes } = require('http-status-codes')
const morgan = require('morgan')

require('dotenv').config()

require('./service/logger')
const mongoose = require('./database')
try {
  mongoose.init()
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('error while initializing db', error)
}

const authentication = require('./middleware/authentication')
const routes = require('./route')

const app = express()

app.use(
  express.json(),
  morgan('tiny'),
  cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: StatusCodes.OK
  }),
  authentication
)

app.use(routes)

app.use('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).send('404 Not Found')
})

console.log('listening on port', process.env.APP_PORT)
app.listen(process.env.APP_PORT)
