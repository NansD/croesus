const mongoose = require('mongoose');

const dbExecute = (db, performLogic, handleError) => {
  db.then(performLogic)
    .catch(handleError)
    .finally(() => db.close());
};

class Database {
  constructor() {
    this.connectionInfo = [process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true }];
  }

  dbConnectAndExecute(performLogic, handleError) {
    return dbExecute(mongoose.connect(...this.connectionInfo), performLogic, handleError);
  }

  async connectToDatabase() {
    try {
      return await mongoose.connect(...this.connectionInfo);
    } catch (error) {
      throw new Error(`Error while connecting to DB : ${error}`);
    }
  }

  /**
   *
   * connects to database, executes function and then
   * disconnects from database
   * @param {Function} fn
   * @returns
   */
  async performDatabaseAction(fn) {
    const db = await this.connectToDatabase();
    const result = await fn();
    db.connection.close();
    return result;
  }
}

module.exports = new Database();
