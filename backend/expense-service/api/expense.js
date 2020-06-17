const Expense = require('./expense.model');

module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const { label, amount, payer } = requestBody;
  let expenseToSave;
  try {
    expenseToSave = new Expense(label, amount, payer);
  } catch (error) {
    callback(error);
  }
  expenseToSave
    .save()
    .then((res) => {
      callback(null, {
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        statusCode: 200,

        body: JSON.stringify({
          message: `Successfully submitted expense with amount ${amount} from ${payer}`,
          expenseId: res.id,
        }),
      });
    })
    .catch((err) => {
      console.error(err);
      callback(null, {
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit expense ${JSON.stringify(expenseToSave)}`,
        }),
      });
    });
};

module.exports.list = async (event, context, callback) => {
  try {
    const expenses = await Expense.getAll();
    return callback(null, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      statusCode: 200,
      body: JSON.stringify({
        expenses: expenses.Items,
      }),
    });
  } catch (err) {
    console.error('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
    return callback(err);
  }
};

module.exports.delete = (event, context, callback) => {
  Expense.delete(event.pathParameters.id).then(() => {
    return callback(null, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      statusCode: 204,
    });
  });
};
