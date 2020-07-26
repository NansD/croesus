const Controller = require('./../../common/controller');
const collections = require('./../../common/collections.json');

const model = require('./expense.model');

class ExpenseController extends Controller {
  constructor() {
    super(collections.EXPENSES, model);
  }
}

module.exports = new ExpenseController();
