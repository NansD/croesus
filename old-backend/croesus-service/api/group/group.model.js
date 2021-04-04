const { Schema } = require('mongoose');
const ExpenseModel = require('../expense/expense.model');
const ParticipantSchema = require('../../../common/models/participant.schema');

function validateParticipants(participants) {
  if (!Array.isArray(participants)) {
    return false;
  }
  const participantsNames = participants.map((p) => p.name);
  const noDuplicateNames = Array.from(new Set(participantsNames)).length === participants.length;
  return noDuplicateNames;
}

module.exports = new Schema({
  name: {
    type: String,
    required: true,
  },
  participants: {
    type: [ParticipantSchema],
    default: [],
    validate: validateParticipants,
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
