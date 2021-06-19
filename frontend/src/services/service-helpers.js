import LOCAL_STORAGE_KEYS from '../localStorageKeys.json';
// import NAVIGATION from '../navigation.json';

const JWTConfig = {
  EXPIRES_IN: 604800000,
};

function failIfNotOK(data, response) {
  if (!data.ok) {
    throw new Error(response.message);
  }
}

function logOut() {
  // setTimeout(() => {
  //   window.location.href = NAVIGATION.LOGIN;
  // }, 3000);
  throw new Error('Session expirée, veuillez vous reconnecter');
}

function getToken() {
  const token = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.token));
  const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.user));
  if (
    !user
    || !user.tokenStartTime
    // if the token has expired
    || new Date().getTime() - JWTConfig.EXPIRES_IN > user.tokenStartTime) {
    logOut();
  }

  if (!token || token === 'undefined') {
    logOut();
  }
  return token;
}

async function customFetch(url, options, useToken = true) {
  const newOptions = useToken
    ? {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      ...options,
    }
    : {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };
  const data = await fetch(url, newOptions);

  if (options && options.method === 'DELETE' && data.ok) {
    return {};
  }
  const response = await data.json();
  failIfNotOK(data, response);
  return response;
}

export { failIfNotOK, customFetch };
