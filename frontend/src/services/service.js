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
  })

  getAll = async (args, { signal }) => {
    const data = await customFetch(`${this.apiEndPoint}`, { signal });
    return data.documents;
  }

  delete = ([id], { signal }) => customFetch(`${this.apiEndPoint}/${id}`,
    {
      method: 'DELETE',
      signal,
    })

  update= ([document], { signal }) => customFetch(`${this.apiEndPoint}/${document._id}`, {
    method: 'PUT',
    body: JSON.stringify(document),
    signal,
  })
}
