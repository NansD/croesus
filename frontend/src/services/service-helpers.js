function failIfNotOK(data, response) {
  if (!data.ok) {
    throw new Error(response.message);
  }
}

async function customFetch(url, options, signal) {
  const data = await fetch(url, options, signal);

  if (options && options.method === 'DELETE' && data.ok) {
    return {};
  }
  const response = await data.json();
  failIfNotOK(data, response);
  return response;
}

export { failIfNotOK, customFetch };
