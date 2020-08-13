import { useState } from 'react';

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function useValidateEmail(initialState = '') {
  const [email, setEmail] = useState(initialState);
  const [isEmailValid, setIsEmailValid] = useState(validateEmail(validateEmail(initialState)));

  function newSetEmail(value) {
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  }

  return [email, newSetEmail, isEmailValid];
}
