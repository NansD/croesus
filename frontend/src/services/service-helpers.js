import LOCAL_STORAGE_KEYS from '../localStorageKeys.json';

function failIfNotOK(data, response) {
  if (!data.ok) {
    throw new Error(response.message);
  }
}

function getToken() {
  const token = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.token));
  if (!token || token === 'undefined') {
    throw new Error('Session expirée, veuillez vous reconnecter');
  }
  return token;
}

async function customFetch(url, options, useToken = true) {
  const newOptions = useToken
    ? {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      ...options,
    }
    : options;
  const data = await fetch(url, newOptions);

  if (options && options.method === 'DELETE' && data.ok) {
    return {};
  }
  const response = await data.json();
  failIfNotOK(data, response);
  return response;
}

export { failIfNotOK, customFetch };
