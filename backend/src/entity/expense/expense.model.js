const { Schema } = require('../../database')
const ParticipantSchema = require('../participant/participant.schema')

function validateUsersFor(usersFor) {
  const baseChecks = Array.isArray(usersFor) && usersFor.length > 0
  if (!baseChecks) {
    return false
  }
  const usersNames = usersFor.map(u => u.name)
  const hasDuplicates = Array.from(new Set(usersNames)).length < usersFor.length
  if (hasDuplicates) {
    return false
  }
  return true
}

module.exports = new Schema({
  label: {
    type: String,
    required: true
  },
  payer: ParticipantSchema,
  amount: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: () => Date.now()
  },
  usersFor: {
    type: [
      {
        name: String,
        checked: Boolean
      }
    ],
    validate: validateUsersFor
  },
  generatedDebt: {
    type: [
      {
        name: String,
        amount: Number,
        to: String
      }
    ]
  }
})
