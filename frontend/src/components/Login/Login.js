import React, { useState } from "react";
import { useAsync } from 'react-async';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../../contexts/authentication";
import NAVIGATION from '../../navigation.json';
import UserService from '../../services/user.service';

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const { setAuthToken } = useAuth();

  function checkEmailValidity(e) {
    const mail = e.target.value;
    setEmail(mail);
    setIsEmailValid(validateEmail(mail));
  }

  const { run: login, isPending } = useAsync({
    deferFn: UserService.login,
    onResolve: notifyLoginSuccess,
    onReject: notifyLoginFailure,
  });

  function notifyLoginSuccess(res) {
    setAuthToken(res.jwt, res.user);
    toast.success(`Bienvenue ${res.user.name}`);
    window.location.href = NAVIGATION.EXPENSES;
  }

  function notifyLoginFailure(error) {
    toast.error(`Erreur lors de l'authentification: ${error}`);
  }

  const emailIconStatus = isEmailValid
  ? (<span className="icon is-small is-right has-text-success">
      <i className="fa fa-check is-success"></i>
    </span>)
  : (<span className="icon is-small is-right has-text-danger">
      <i className="fa fa-times"></i>
    </span>);

  return (
    <div>
      <div className="card mb-5">
        <div className="card-content">
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input className="input" type="email" placeholder="Email" required onChange={checkEmailValidity}/>
              <span className="icon is-small is-left">
                <i className="fa fa-envelope"></i>
              </span>
              { emailIconStatus }
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input className="input" type="password" required onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              <span className="icon is-small is-left">
                <i className="fa fa-lock"></i>
              </span>
            </p>
          </div>
        </div>
        <footer className="card-footer card-content" style={{justifyContent: "space-between", alignItems: "center"}}>
          <Link to={NAVIGATION.SIGNUP}>
            Pas encore inscrit ?
          </Link>
          <button disabled={isPending} className={`${isPending ? 'is-loading' : ''} button is-primary`} type="submit" onClick={() => login(email, password)}>
            Login
          </button>
        </footer>
      </div>
    </div>
  );
}
