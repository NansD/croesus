import React from 'react';
import { useHistory } from 'react-router-dom';
import useAuthTokenState from '../../hooks/useAuthTokenState';
import useUserState from '../../hooks/useUserState';
import NAVIGATION from '../../navigation.json';

export default function ErrorHandler({ message, removeError }) {
  const [, setAuthToken] = useAuthTokenState();
  const [, setUser] = useUserState();
  const history = useHistory();

  function handleRemoveError() {
    setAuthToken();
    setUser();
    history.push(NAVIGATION.LOGIN);
    removeError();
  }

  return (
    <div className="columns is-flex">
      <div className="column" />
      <div className="column">
        <p className="message message-body is-danger">
          {JSON.stringify(message)}
        </p>
        <button className="button" type="button" onClick={handleRemoveError}>
          Je me reconnecte
        </button>
      </div>
      <div className="column" />
    </div>
  );
}
