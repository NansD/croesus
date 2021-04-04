const { Schema } = require('../../database')

module.exports = new Schema({
  name: {
    type: String,
    required: true
  },
  customRate: {
    type: Number,
    default: 1
  }
})
