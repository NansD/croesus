"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk");

AWS.config.setPromisesDependency(require("bluebird"));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const { label, amount, payer } = requestBody;

  if ( 
    !label || !amount || !payer 
    || typeof label !== "string" || typeof amount !== "number" || typeof payer !== "string"
    ) {
    console.error("Validation Failed");
    callback(
      new Error("Couldn't submit expense because of validation errors.")
    );
    return;
  }

  submitExpenseP(new Expense(label, amount, payer))
    .then((res) => {
      callback(null, {
        headers : {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        },
        statusCode: 200,

        body: JSON.stringify({
          message: `Successfully submitted expense with amount ${amount} from ${payer}`,
          expenseId: res.id,
        }),
      });
    })

    .catch((err) => {
      console.log(err);

      callback(null, {
        headers : {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        },
        statusCode: 500,

        body: JSON.stringify({
          message: `Unable to submit expense with email ${email}`,
        }),
      });
    });
};

const submitExpenseP = (expense) => {
  console.log("Submitting expense");
  console.log("process.env.EXPENSE_TABLE :", process.env.EXPENSE_TABLE);

  const expenseInfo = {
    TableName: process.env.EXPENSE_TABLE,
    Item: expense,
  };

  return dynamoDb
    .put(expenseInfo)
    .promise()

    .then((res) => expense);
};

class Expense {
  constructor(label, amount, payer) {
    this.id = uuid.v1();
    this.label = label;
    this.amount = amount;
    this.payer = payer;
    this.submittedAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
}

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.EXPENSE_TABLE,
    ProjectionExpression: "id, label, amount, payer, submittedAt",
  };

  console.log("Scanning Expense table.");

  const onScan = (err, data) => {
    if (err) {
      console.log(
        "Scan failed to load data. Error JSON:",
        JSON.stringify(err, null, 2)
      );

      callback(err);
    } else {
      console.log("Scan succeeded.");

      return callback(null, {
        headers : {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        },
        statusCode: 200,

        body: JSON.stringify({
          expenses: data.Items,
        }),
      });
    }
  };

  dynamoDb.scan(params, onScan);
};

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.EXPENSE_TABLE,
    Key: {
        id: event.pathParameters.id,
    },
  };

  dynamoDb.delete(params)
    .promise()
    .then(() => {
      return callback(null, {
        headers : {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        },
        statusCode: 204,
      });
    })
};

