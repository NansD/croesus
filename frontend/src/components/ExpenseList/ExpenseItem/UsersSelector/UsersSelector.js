import React, { useState, useEffect } from 'react';

function UsersSelector({ users, notifyChange, disabled }) {
  const [usersFor, setUsersFor] = useState(users);

  function emitChange() {
    return notifyChange && notifyChange(usersFor);
  }

  useEffect(emitChange);

  function checkPayer(p) {
    return function handleCheckPayer() {
      setUsersFor([
        ...usersFor.map((u) => {
          const newUser = { ...u };
          if (u.name === p.name) {
            newUser.checked = !u.checked;
          }
          return newUser;
        }),
      ]);
    };
  }
  return usersFor.map((u) => (
    <div className="field" key={u.name}>
      <label className="checkbox" htmlFor={u.name}>
        <input
          id={u.name}
          disabled={disabled}
          type="checkbox"
          checked={u.checked}
          onChange={checkPayer(u)}
        />
        &nbsp;
        {' '}
        {u.name}
      </label>
    </div>
  ));
}

export default UsersSelector;
