class ExpenseService {
  constructor() {
    this.apiEndpoint = `${process.env.REACT_APP_API_BASE_URL}/expenses`;
  }

  async getAll() {
    const result = await fetch(`${this.apiEndpoint}`);
    return result.json(); // { expenses: [...]}
  }

  deleteExpense(id) {
    return fetch(`${this.apiEndpoint}/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ExpenseService();
