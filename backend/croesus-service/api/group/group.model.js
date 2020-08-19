const { Schema } = require('mongoose');
const ExpenseModel = require('../expense/expense.model');
const ParticipantSchema = require('../../../common/models/participant.schema');

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
    default: [],
  },
  submittedAt: {
    type: Date,
    default: () => Date.now(),
  },
});
