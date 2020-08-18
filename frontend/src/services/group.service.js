import Service from './service';
import { customFetch } from './service-helpers';

class GroupService extends Service {
  constructor() {
    super('groups');
  }

  getComputedDebts = ({ _id }, { signal }) => customFetch(`${this.apiEndPoint}/${_id}/computeDebts/`, { signal })
}

export default new GroupService();
