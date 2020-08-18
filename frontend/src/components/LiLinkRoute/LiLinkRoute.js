import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

export default function LiLinkRoute({ to, fontAwesomeClassName, label }) {
  const match = useRouteMatch(to);
  return (
    <li className={match && match.isExact ? 'is-full-height is-active' : 'is-full-height'}>
      <Link className="is-full-height" to={to}>
        <i className={`icon fa ${fontAwesomeClassName}`} aria-hidden="true" />
        {label}
      </Link>
    </li>
  );
}
