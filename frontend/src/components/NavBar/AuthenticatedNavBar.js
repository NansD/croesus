import React from 'react';
import { Link } from 'react-router-dom';
import NAVIGATION from '../../navigation.json';

export default function AuthenticatedNavBar({ setShowMenu, disconnect }) {
  return (
    <>
      <div className="navbar-start">
        <div className="navbar-item">
          <div className="buttons">
            <Link to={NAVIGATION.GROUPS} onClick={() => setShowMenu(false)} className="button navbar-item">
              <i className="icon fa fa-users" aria-hidden="true" />
              <strong>Groupes</strong>
            </Link>
          </div>
        </div>
      </div>
      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            <Link to={NAVIGATION.LOGIN} onClick={disconnect} className="button is-primary navbar-item">
              <strong>Se déconnecter</strong>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
