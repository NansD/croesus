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
  usersFor: {
    type: [
      {
        name: String,
        checked: Boolean,
      },
    ],
    validate: (v) => Array.isArray(v) && v.length > 0,
  },
  generatedDebt: {
    type: [
      {
        name: String,
        amount: Number,
        to: String,
      },
    ],
  },
});
