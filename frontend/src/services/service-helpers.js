import LOCAL_STORAGE_KEYS from '../localStorageKeys.json';

function failIfNotOK(data, response) {
  if (!data.ok) {
    throw new Error(response.message);
  }
}

async function customFetch(url, options, useToken = true) {
  const newOptions = useToken
    ? {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.token))}`,
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
