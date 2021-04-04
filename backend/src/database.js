const mongoose = require('mongoose')
const winston = require('winston')
mongoose.init = async () => {
  mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .catch(error => winston.error(error))
}
mongoose.connection.on('open', () => winston.info('MongoDB connected'))
module.exports = mongoose
