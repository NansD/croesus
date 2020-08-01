class ExpenseService {
  constructor() {
    this.apiEndpoint = `${process.env.REACT_APP_API_BASE_URL}/expenses`;
  }

  async getAll() {
    const data = await fetch(`${this.apiEndpoint}`);
    return data.json();
  }

  async getComputedDebts() {
    const data = await fetch(`${this.apiEndpoint}/computeDebts`);
    return data.json();
  }

  deleteExpense(id) {
    return fetch(`${this.apiEndpoint}/${id}`, {
      method: 'DELETE',
    });
  }

  async createExpense(expense) {
    const data = await fetch(this.apiEndpoint, {
      method: 'POST',
      body: JSON.stringify(expense),
    });
    return data.json();
  }
}

export default new ExpenseService();
