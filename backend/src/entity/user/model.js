const mongoose = require('../../database')
const schema = require('./user.model')
const collectionNames = require('../collections.json')
module.exports = mongoose.model(collectionNames.USERS, schema)
