const collections = require('../collections.json')
const relationships = require('../abstract-entity/relationships.json')
const GroupController = require('../group/controller')
const NestedController = require('../abstract-entity/nested-controller')
const { StatusCodes } = require('http-status-codes')

function groupBy(arrayToGroup, key) {
  return arrayToGroup.reduce((accumulator, item) => {
    ;(accumulator[item[key]] = accumulator[item[key]] || []).push(item)
    return accumulator
  }, {})
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
    .map(e => e.generatedDebt.length > 0 && [...e.generatedDebt])
    .filter(Boolean)
    .flat(Infinity)
  const grouped = groupBy(generatedDebts, 'name')
  const keys = Object.keys(grouped)
  for (const key of keys) {
    const debts = grouped[key]
    const totalDebt = debts.reduce((accumulator, debt) => {
      // eslint-disable-next-line
      return (accumulator += debt.amount);
    }, 0)
    grouped[key] = { ...grouped[key], totalDebt }
  }
  return grouped
}

function getUserRates(participants, usersFor) {
  const userRates = new Map(
    usersFor.map(u => {
      const participant = participants.find(p => p.name === u.name && u.checked === true)
      const userRate = participant && participant.customRate
      return [u.name, Number(userRate) || 0]
    })
  )
  let totalRate = 0
  for (const rate of userRates.values()) {
    totalRate += rate
  }
  return { userRates, totalRate }
}

function computeGeneratedDebts(users, payer, amount, userRates, totalRate) {
  // first, calculate what others owe to the payer
  const generatedDebt = users.map(user => {
    const userAmount = (amount * userRates.get(user.name)) / totalRate
    return {
      name: user.name,
      amount: user.name === payer.name ? 'TO_COMPUTE' : userAmount,
      to: payer
    }
  })

  // Second, set the payer's negative debt accordingly to the sum of amount that is owed to him
  // find the debt related to the payer
  const payerDebt = generatedDebt.find(debt => {
    return debt.amount === 'TO_COMPUTE'
  })
  payerDebt.amount = generatedDebt.reduce((payerDebtAmount, debt) => {
    if (debt.name !== payer.name) {
      return payerDebtAmount - Number(debt.amount)
    }
    return payerDebtAmount
  }, 0)
  return generatedDebt
}

class ExpenseController extends NestedController {
  constructor() {
    super(collections.EXPENSES, GroupController.Model, relationships.ONE_TO_MANY, 'expenses')
  }

  async create(req, res) {
    this.group = req.context.group
    const requestBody = req.body

    if (!requestBody.usersFor || !Array.isArray(requestBody.usersFor)) {
      return res.status(StatusCodes.BAD_REQUEST)
    }
    const { userRates, totalRate } = getUserRates(this.group.participants, requestBody.usersFor)
    const generatedDebt = computeGeneratedDebts(
      requestBody.usersFor,
      requestBody.payer,
      requestBody.amount,
      userRates,
      totalRate
    )
    req.body = { ...requestBody, generatedDebt }
    return await super.create(req, res, GroupController.Model, this.group, 'expenses')
  }

  getAll(req, res) {
    if (!req.context.group || !req.context.group.expenses) {
      return res.statusCode(StatusCodes.BAD_REQUEST)
    }
    return res.status(StatusCodes.OK).json({ documents: req.context.group.expenses })
  }

  // eslint-disable-next-line class-methods-use-this
  async computeDebts(req, res) {
    const grouped = await computeDebtToCentralPool(req.context.group.expenses)
    return res.status(StatusCodes.OK).json({
      debtsToPool: grouped,
      group: req.context.group
    })
  }

  delete(req, res) {
    const parent = req.context.group
    return super.delete(req, res, parent)
  }

  async update(req, res) {
    const parent = req.context.group
    return await super.update(req, res, parent)
  }
}

module.exports = new ExpenseController()
