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

function getUserRates(participants, usersFor) {
  const userRates = new Map(
    usersFor.map((u) => {
      const participant = participants.find((p) => p.name === u.name);
      const userRate = participant && participant.customRate;
      return [u.name, Number(userRate) || 1];
    })
  );
  let totalRate = 0;
  for (const rate of userRates.values()) {
    totalRate += rate;
  }
  return { userRates, totalRate };
}

// eslint-disable-next-line max-params
function computeGeneratedDebts(users, payer, amount, userRates, totalRate) {
  // first, calculate what others owe to the payer
  const generatedDebt = users.map((user) => {
    const userAmount = (amount * userRates.get(user.name)) / totalRate;
    return {
      name: user.name,
      amount: user.name === payer.name ? 'TO_COMPUTE' : userAmount,
      to: payer,
    };
  });

  // Second, set the payer's negative debt accordingly to the sum of amount that is owed to him
  // find the debt related to the payer
  const payerDebt = generatedDebt.find((debt) => {
    return debt.amount === 'TO_COMPUTE';
  });
  payerDebt.amount = generatedDebt.reduce((payerDebtAmount, debt) => {
    if (debt.name !== payer.name) {
      return payerDebtAmount - Number(debt.amount);
    }
    return payerDebtAmount;
  }, 0);
  return generatedDebt;
}

class ExpenseController extends NestedController {
  constructor() {
    super(collections.EXPENSES, GroupController.Model, relationships.ONE_TO_MANY, 'expenses');
  }

  async create(event, context, callback) {
    this.group = event.group;
    const requestBody = event.body;

    if (!requestBody.usersFor || !Array.isArray(requestBody.usersFor)) {
      this.respond.with.error.common.invalidData(event.body, callback);
    }
    const { userRates, totalRate } = getUserRates(event.group.participants, requestBody.usersFor);
    const generatedDebt = computeGeneratedDebts(
      requestBody.usersFor,
      requestBody.payer,
      requestBody.amount,
      userRates,
      totalRate
    );
    const newRequest = { ...event, body: { ...requestBody, generatedDebt } };
    await super.create(newRequest, context, callback, GroupController.Model, event.group, 'expenses');
  }

  async validate(group, callback, expense) {
    const userNames = expense.usersFor.map((u) => u.name);
    const areUsersForParticipants = userNames.every((name) => group.participants.map((p) => p.name).includes(name));
    if (!areUsersForParticipants) {
      this.respond.with.error.expenses.invalidUsersFor(expense, callback);
    }
    super.validate(group, callback);
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
