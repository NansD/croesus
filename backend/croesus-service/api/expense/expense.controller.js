const collections = require('../../../common/collections.json');
const relationships = require('./../../../common/relationships.json');
const GroupController = require('../group/group.controller');
const NestedController = require('../../../common/nestedController');

function groupBy(arrayToGroup, key) {
  return arrayToGroup.reduce((accumulator, item) => {
    (accumulator[item[key]] = accumulator[item[key]] || []).push(item);
    return accumulator;
  }, {});
}

/**
 *
 * fetches all expenses in database, and returns an object
 * each key is someone that owes to the central pool
 * the value of the key is an object that has a key "totalDebt"
 * @returns {payer: {0: {...debt0}, n: {...debtN}, totalDebt: sum(nDebtsValues)}}
 * @memberof ExpenseController
 */
async function computeDebtToCentralPool(expenses) {
  const generatedDebts = expenses
    .map((e) => e.generatedDebt.length > 0 && [...e.generatedDebt])
    .filter(Boolean)
    .flat(Infinity);
  const grouped = groupBy(generatedDebts, 'name');
  const keys = Object.keys(grouped);
  for (const key of keys) {
    const debts = grouped[key];
    const totalDebt = debts.reduce((accumulator, debt) => {
      // eslint-disable-next-line
      return (accumulator += debt.amount);
    }, 0);
    grouped[key] = { ...grouped[key], totalDebt };
  }
  return grouped;
}

class ExpenseController extends NestedController {
  constructor() {
    super(collections.EXPENSES, GroupController.Model, relationships.ONE_TO_MANY, 'expenses');
  }

  async create(event, context, callback) {
    const requestBody = event.body;

    if (!requestBody.usersFor || !Array.isArray(requestBody.usersFor)) {
      this.respond.with.error.common.invalidData(event.body, callback);
    }
    const generatedDebt = requestBody.usersFor.map((user) => {
      // if I paid, I generated negative debt towards me
      // if someone else paid I owe them
      const amount =
        user.name === requestBody.payer.name
          ? -(requestBody.amount / requestBody.usersFor.length)
          : requestBody.amount / requestBody.usersFor.length;
      return {
        name: user.name,
        amount,
        to: requestBody.payer,
      };
    });
    const newRequest = { ...event, body: { ...requestBody, generatedDebt } };
    await super.create(newRequest, context, callback, GroupController.Model, event.group, 'expenses');
  }

  list(event, context, callback) {
    if (!event.group || !event.group.expenses) {
      return this.respond.with.error.common.notFound(event.pathParameters.groupId, callback);
    }
    return this.respond.with.success({ documents: event.group.expenses }, callback);
  }

  // eslint-disable-next-line class-methods-use-this
  async computeDebts(event, context, callback) {
    const grouped = await computeDebtToCentralPool(event.group.expenses);
    callback(null, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      statusCode: 200,

      body: JSON.stringify({
        debtsToPool: grouped,
        group: event.group,
      }),
    });
  }

  async delete(event, context, callback) {
    const parent = event.group;
    await super.delete(event, context, callback, parent);
  }

  async update(event, context, callback) {
    const parent = event.group;
    await super.update(event, context, callback, parent);
  }
}

module.exports = new ExpenseController();
