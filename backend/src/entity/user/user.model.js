const bcrypt = require('bcryptjs')

const { Schema } = require('../../database')
const collections = require('../collections.json')

const BCRYPT_ROUNDS = 12

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: collections.GROUPS
      }
    ],
    favoriteGroup: {
      type: Schema.Types.ObjectId,
      ref: collections.GROUPS
    }
  },
  { timestamps: true }
)

/*
 * Keep track of updates before each save.
 * Only hash the password if it has been modified (or is new).
 */
UserSchema.pre('save', async function encryptPassword(done) {
  if (this.isModified('password')) {
    if (this.password) {
      const hash = await bcrypt.hash(this.password, BCRYPT_ROUNDS)
      this.password = hash
    }
  }
  done()
})

module.exports = UserSchema
