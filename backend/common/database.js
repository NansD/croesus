const mongoose = require('mongoose');

const connection = {};

const connectionInfo = [
  process.env.MONGODB_CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true },
];

module.exports.connectToDatabase = async () => {
  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(...connectionInfo);
  connection.isConnected = db.connections[0].readyState;
};
