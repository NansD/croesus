import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authentication';
import NAVIGATION from '../../navigation.json';

export default function NavBar({ isAuthenticated }) {
  const [showMenu, setShowMenu] = useState(false);
  const { logOut } = useAuth();

  function disconnect() {
    logOut();
    setShowMenu(false);
  }

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="is-flex" style={{ alignItems: 'center' }}>
        <button type="button" className={`${showMenu ? 'is-active' : ''} navbar-burger burger ml-0 button is-white`} aria-label="menu" aria-expanded="false" data-target="navbar-menu" onClick={() => setShowMenu(!showMenu)} tabIndex={0}>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <h1 className="title navbar-item">
          Croesus &nbsp;
          <i className="fa fa-money has-text-success" />
        </h1>
      </div>
      {!isAuthenticated && (
      <h2 className="subtitle navbar-item mb-0">
        La super application de partage des dépenses !
      </h2>
      )}

      <div id="navbar-menu" className={`${showMenu ? 'is-active' : ''} navbar-menu`}>
        <div className="navbar-end">
          <div className="navbar-item">
            {!isAuthenticated && (
            <div className="buttons">
              <Link to={NAVIGATION.SIGNUP} onClick={() => setShowMenu(false)} className="button is-primary">
                <strong>Sign up</strong>
              </Link>
              <Link to={NAVIGATION.LOGIN} onClick={() => setShowMenu(false)} className="button is-light">
                Log in
              </Link>
            </div>
            )}
            {isAuthenticated && (
            <div className="buttons">
              <Link to={NAVIGATION.LOGIN} onClick={disconnect} className="button is-primary">
                <strong>Se déconnecter</strong>
              </Link>
            </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
