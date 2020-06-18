const uuid = require('uuid');
const AWS = require('aws-sdk');
const bluebird = require('bluebird');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

AWS.config.setPromisesDependency(bluebird);
module.exports = class Expense {
  constructor(label, amount, payer) {
    this.id = uuid.v1();
    this.label = label;
    this.amount = parseInt(amount, 10);
    this.payer = payer;
    this.submittedAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
    this.validate();
  }

  // validation always add some complexity !
  // eslint-disable-next-line complexity
  validate() {
    if (
      !this.label ||
      !this.amount ||
      !this.payer ||
      typeof this.label !== 'string' ||
      typeof this.amount !== 'number' ||
      typeof this.payer !== 'string'
    ) {
      console.error('Validation Failed');
      throw new Error("Couldn't submit expense because of validation errors.");
    }
  }

  async save() {
    console.log('Submitting expense');
    console.log('process.env.EXPENSE_TABLE :', process.env.EXPENSE_TABLE);

    const expenseInfo = {
      TableName: process.env.EXPENSE_TABLE,
      Item: { ...this },
    };

    return dynamoDb
      .put(expenseInfo)
      .promise()

      .then((expense) => expense);
  }

  static async getAll() {
    console.log('Scanning Expense table.');
    const params = {
      TableName: process.env.EXPENSE_TABLE,
      ProjectionExpression: 'id, label, amount, payer, submittedAt',
    };
    const response = await dynamoDb.scan(params).promise();
    console.log('data :', response);
    return response;
  }

  static async delete(id) {
    console.log(`Deleting document with id ${id} in Expense table`);
    const params = {
      TableName: process.env.EXPENSE_TABLE,
      Key: {
        id,
      },
    };

    return dynamoDb.delete(params).promise();
  }
};
