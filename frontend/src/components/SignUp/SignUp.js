import React, { useState } from 'react';
import { useAsync } from 'react-async';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useValidateEmail from '../../hooks/useValidateEmail';
import NAVIGATION from '../../navigation.json';
import UserService from '../../services/user.service';

export default function SignUp() {
  const [email, setEmail, isEmailValid] = useValidateEmail('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  function checkEmailValidity(e) {
    const mail = e.target.value;
    setEmail(mail);
  }

  function notifySignupSuccess() {
    toast.success('Utilisateur enregistré, vous pouvez vous authentifier !');
    window.location.href = NAVIGATION.LOGIN;
  }

  function notifySignupFailure(error) {
    toast.error(`Erreur lors de la création d'utilisateur : ${error}`);
  }

  const { run: signup, isPending } = useAsync({
    deferFn: UserService.create,
    onResolve: notifySignupSuccess,
    onReject: notifySignupFailure,
  });

  function submitSignUp() {
    if (!email || !isEmailValid(email) || !name || !password) {
      return toast.warning('Les informations de votre inscription sont incorrectes');
    }
    return signup({ email, password, name });
  }

  const emailIconStatus = isEmailValid
    ? (
      <span className="icon is-small is-right has-text-success">
        <i className="fa fa-check is-success" />
      </span>
    )
    : (
      <span className="icon is-small is-right has-text-danger">
        <i className="fa fa-times" />
      </span>
    );

  return (
    <div>
      <div className="card mb-5">
        <div className="card-content">
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input className="input" type="email" placeholder="Email" required onChange={checkEmailValidity} />
              <span className="icon is-small is-left">
                <i className="fa fa-envelope" />
              </span>
              { emailIconStatus }
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input className="input" type="password" required onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
              <span className="icon is-small is-left">
                <i className="fa fa-lock" />
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input className="input" type="text" required onChange={(e) => setName(e.target.value)} placeholder="Nom d'utilisateur" />
              <span className="icon is-small is-left">
                <i className="fa fa-user" />
              </span>
            </p>
          </div>
        </div>
        <footer className="card-footer card-content" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to={NAVIGATION.LOGIN}>
            Déjà inscrit ?
          </Link>
          <button disabled={isPending} className={`${isPending ? 'is-loading' : ''} button is-primary`} type="submit" onClick={submitSignUp}>
            Je m&apos;inscris
          </button>
        </footer>
      </div>
    </div>
  );
}
