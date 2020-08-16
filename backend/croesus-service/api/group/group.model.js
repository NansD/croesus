const { Schema } = require('mongoose');
const ExpenseModel = require('../expense/expense.model');

const ParticipantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  customRate: {
    type: Number,
  },
});

module.exports = new Schema({
  name: {
    type: String,
    required: true,
  },
  participants: {
    type: [ParticipantSchema],
    default: [],
  },
  expenses: {
    type: [ExpenseModel],
  },
  submittedAt: {
    type: Date,
    default: () => Date.now(),
  },
});
