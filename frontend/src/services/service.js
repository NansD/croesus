import { customFetch } from './service-helpers';

export default class Service {
  constructor(endpoint) {
    this.baseUrl = `${process.env.REACT_APP_API_BASE_URL}`;
    this.apiEndPoint = `${this.baseUrl}/${endpoint}`;
  }

  create = async ([document], { signal }) => customFetch(this.apiEndPoint, {
    method: 'POST',
    body: JSON.stringify(document),
    signal,
  });

  getAll = async (args, { signal }) => {
    const data = await customFetch(`${this.apiEndPoint}`, { signal });
    return data.documents;
  }

  getOne = (firstArg, { signal }) => {
    const entity = this.chooseArgument(firstArg);
    return customFetch(`${this.apiEndPoint}/${entity._id}`,
      {
        method: 'GET',
        signal,
      });
  }

  delete = ([id], { signal }) => customFetch(`${this.apiEndPoint}/${id}`,
    {
      method: 'DELETE',
      signal,
    });

  update = ([document], { signal }) => customFetch(`${this.apiEndPoint}/${document._id}`, {
    method: 'PUT',
    body: JSON.stringify(document),
    signal,
  });

  chooseArgument = (firstArg) => {
    let entity = firstArg;
    // when using react-async, when calling "run" on a deferFn
    // the first argument is an array
    if (Array.isArray(firstArg)) {
      [entity] = firstArg;
    }
    return entity;
  }
}
