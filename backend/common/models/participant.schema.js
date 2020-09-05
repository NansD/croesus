const { Schema } = require('mongoose');

module.exports = new Schema({
  name: {
    type: String,
    required: true,
  },
  customRate: {
    type: Number,
    default: 1,
  },
});
