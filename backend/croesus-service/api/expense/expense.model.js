const { Schema } = require('mongoose');
const ParticipantSchema = require('../../../common/models/participant.schema');

module.exports = new Schema({
  label: {
    type: String,
    required: true,
  },
  payer: ParticipantSchema,
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
