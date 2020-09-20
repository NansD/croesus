import LOCAL_STORAGE_KEYS from '../localStorageKeys.json';
import Service from './service';

function getValueFromLocalStorage(key) {
  const localStorageString = localStorage.getItem(key);
  const value = localStorageString && localStorageString !== 'undefined' ? JSON.parse(localStorageString) : '';
  return value;
}

class ExpenseService extends Service {
  constructor() {
    super('expenses');
    this.setGroup();
  }

  setGroup(groupId) {
    const value = getValueFromLocalStorage(LOCAL_STORAGE_KEYS.user);
    const id = groupId
      || (value && value.favoriteGroup);
    this.groupId = id;
    this.apiEndPoint = `${this.baseUrl}/groups/${id}/expenses`;
  }
}

export default new ExpenseService();
