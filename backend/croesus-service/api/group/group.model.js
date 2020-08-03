const { Schema } = require('mongoose');
const ExpenseModel = require('../expense/expense.model');

module.exports = new Schema({
  name: {
    type: String,
    required: true,
  },
  expenses: {
    type: [ExpenseModel],
  },
  submittedAt: {
    type: Date,
    default: () => Date.now(),
  },
});
