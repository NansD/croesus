const winston = require('winston')

const {
  format: { combine, timestamp, json }
} = winston

const logger = winston.configure({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
  transports: [new winston.transports.File({ filename: process.env.API_LOG_FILENAME })]
})

module.exports = logger
