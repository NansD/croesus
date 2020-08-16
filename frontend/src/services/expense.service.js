import LOCAL_STORAGE_KEYS from '../localStorageKeys.json';
import Service from './service';

class ExpenseService extends Service {
  constructor() {
    super('expenses');
    this.setGroup();
  }

  setGroup(groupId) {
    const id = groupId
      || (JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.user))
      && JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.user)).favoriteGroup);
    this.apiEndPoint = `${this.baseUrl}/groups/${id}/expenses`;
  }
}

export default new ExpenseService();
