import {
  Route,
  Link,
} from 'react-router-dom';
import React from 'react';

export default function LiLinkRoute({ to, fontAwesomeClassName, label }) {
  return (
    <Route
      path={to}
      // easy way to access "match"
      // eslint-disable-next-line react/no-children-prop
      children={({ match }) => (
        <li className={match && match.isExact ? 'is-active' : ''}>
          <Link to={to}>
            <i className={`icon fa ${fontAwesomeClassName}`} aria-hidden="true" />
            {label}
          </Link>
        </li>
      )}
    />
  );
}
