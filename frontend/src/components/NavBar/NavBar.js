import React, { useState } from 'react';
import { useAuth } from '../../contexts/authentication';
import AuthenticatedNavBar from './AuthenticatedNavBar';
import UnauthenticatedNavBar from './UnauthenticatedNavBar';

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
