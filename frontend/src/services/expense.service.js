import Service from './service';
import { customFetch } from './service-helpers';

class ExpenseService extends Service {
  constructor() {
    super('expenses');
  }

  getComputedDebts = (args, { signal }) => {
    return customFetch(`${this.apiEndPoint}/computeDebts`, {}, signal);
  }
}

export default new ExpenseService();
