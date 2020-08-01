const Controller = require('./../../common/controller');
const collections = require('./../../common/collections.json');

const model = require('./expense.model');

function groupBy(arrayToGroup, key) {
  return arrayToGroup.reduce((accumulator, item) => {
    (accumulator[item[key]] = accumulator[item[key]] || []).push(item);
    return accumulator;
  }, {});
}

class ExpenseController extends Controller {
  constructor() {
    super(collections.EXPENSES, model);
  }

  create(event, context, callback) {
    const requestBody = JSON.parse(event.body);
    if (!requestBody.usersFor || !Array.isArray(requestBody.usersFor)) {
      return callback({
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        statusCode: 400,
        body: {
          message: 'Expense must include users for which it has been paid',
        },
      });
    }
    const generatedDebt = requestBody.usersFor.map((user) => {
      // if I paid, I generated negative debt towards me
      // if someone else paid I owe them
      const amount =
        user.name === requestBody.payer
          ? -(requestBody.amount / requestBody.usersFor.length)
          : requestBody.amount / requestBody.usersFor.length;
      return {
        name: user.name,
        amount,
        to: requestBody.payer,
      };
    });
    const newRequest = { body: { ...requestBody, generatedDebt } };
    return super.create(newRequest, context, callback);
  }

  async computeDebts(event, context, callback) {
    const grouped = await this.computeDebtToCentralPool();
    callback(null, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      statusCode: 200,

      body: JSON.stringify({
        debtsToPool: grouped,
      }),
    });
  }

  /**
   *
   * fetches all expenses in database, and returns an object
   * each key is someone that owes to the central pool
   * the value of the key is an object that has a key "totalDebt"
   * @returns {payer: {0: {...debt0}, n: {...debtN}, totalDebt: sum(nDebtsValues)}}
   * @memberof ExpenseController
   */
  async computeDebtToCentralPool() {
    let expenses = await this.Model.find();
    expenses = expenses.map((e) => e.toObject());
    const generatedDebts = expenses
      .map((e) => e.generatedDebt.length > 0 && [...e.generatedDebt])
      .filter(Boolean)
      .flat(Infinity);
    const grouped = groupBy(generatedDebts, 'name');
    const keys = Object.keys(grouped);
    for (const key of keys) {
      const debts = grouped[key];
      const totalDebt = debts.reduce((accumulator, debt) => {
        // eslint-disable-next-line no-return-assign
        return (accumulator += debt.amount);
      }, 0);
      grouped[key] = { ...grouped[key], totalDebt };
    }
    return grouped;
  }
}

module.exports = new ExpenseController();
