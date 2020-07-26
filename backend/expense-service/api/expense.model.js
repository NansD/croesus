const { Schema } = require('mongoose');

module.exports = new Schema({
  label: {
    type: String,
    required: true,
  },
  payer: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: () => Date.now(),
  },
});
