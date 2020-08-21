import { createLocalStorageStateHook } from 'use-local-storage-state';
import LOCAL_STORAGE_KEYS from '../localStorageKeys.json';

export default createLocalStorageStateHook(LOCAL_STORAGE_KEYS.token);
