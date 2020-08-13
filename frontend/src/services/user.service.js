import Service from './service';
import { customFetch } from './service-helpers';

class UserService extends Service {
  constructor() {
    super('users');
  }
  login = async ([email, password], { signal }) => customFetch(`${this.apiEndPoint}/login`, {
    method: 'POST',
    body: JSON.stringify({email, password}),
    signal,
  }, false)
}

export default new UserService();
