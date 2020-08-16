import createPersistedState from 'use-persisted-state';
import LOCAL_STORAGE_KEYS from '../localStorageKeys.json';

export default createPersistedState(LOCAL_STORAGE_KEYS.user);
