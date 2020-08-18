import Service from './service';
import { customFetch } from './service-helpers';

class UserService extends Service {
  constructor() {
    super('users');
  }

  login = async ([email, password], { signal }) => customFetch(`${this.apiEndPoint}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    signal,
  }, false);

  getSelf = async (args, { signal }) => customFetch(`${this.apiEndPoint}/getSelf`, {
    method: 'GET',
    signal,
  }, true);
}

export default new UserService();
