import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/authentication';
import NAVIGATION from '../../navigation.json';
import AuthenticatedNavBar from './AuthenticatedNavBar';
import UnauthenticatedNavBar from './UnauthenticatedNavBar';

export default function NavBar({ isAuthenticated }) {
  const [showMenu, setShowMenu] = useState(false);
  const { logOut } = useAuth();
  const history = useHistory();

  function disconnect() {
    logOut();
    setShowMenu(false);
    history.push(NAVIGATION.LOGIN);
  }

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="is-flex" style={{ alignItems: 'center' }}>
        <button type="button" className={`${showMenu ? 'is-active' : ''} navbar-burger burger ml-0 button is-white`} aria-label="menu" aria-expanded="false" data-target="navbar-menu" onClick={() => setShowMenu(!showMenu)} tabIndex={0}>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <Link to={NAVIGATION.HOME}>
          <div className="navbar-item">
            <img className="app-logo mr-2" src="./logo-only.png" alt="Croesus icon" />
            <h1 className="title app-logo">
              Croesus
            </h1>
          </div>
        </Link>
      </div>
      {!isAuthenticated && (
      <h2 className="subtitle navbar-item mb-0">
        La super application de partage des dépenses !
      </h2>
      )}

      <div id="navbar-menu" className={`${showMenu ? 'is-active' : ''} navbar-menu`}>

        {!isAuthenticated && (
        <UnauthenticatedNavBar setShowMenu={setShowMenu} />
        )}
        {isAuthenticated && (
        <AuthenticatedNavBar setShowMenu={setShowMenu} disconnect={disconnect} />
        )}
      </div>
    </nav>
  );
}
