import Service from './service';
import { customFetch } from './service-helpers';

class GroupService extends Service {
  constructor() {
    super('groups');
  }

  getComputedDebts = (firstArg, { signal }) => {
    const { _id } = this.chooseArgument(firstArg);
    return customFetch(`${this.apiEndPoint}/${_id}/computeDebts/`, { signal });
  }
}

export default new GroupService();
