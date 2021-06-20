import React, { useEffect, useState } from 'react';

function UsersSelector({
  users, notifyChange, disabled, setPayer, payer,
}) {
  const usersCheckList = users.map((u) => ({ name: u.name, checked: disabled ? u.checked : true }));
  const [usersFor, setUsersFor] = useState(usersCheckList);

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

  if (!users.length) {
    return (
      <div className="message message-body is-danger">
        Ajoutez des utilisateurs à votre
        groupe pour pouvoir renseigner des payeurs pour les dépenses.
      </div>
    );
  }

  return (
    <>
      {!disabled && (
      <div className="select field" style={{ width: '100%', verticalAlign: 'inherit' }}>
        <select
          style={{ width: '100%' }}
          aria-label="payer"
          placeholder="payer"
          onChange={(e) => setPayer(users.find((p) => p.name === e.target.value))}
          value={payer?.name}
          disabled={disabled}
          required
          className="control"
        >
          {users.map((p) => (
            <option key={p._id} value={p.name}>{p.name}</option>
          ))}
        </select>
        <p className="help">Nom de la personne qui a payé pour cette dépense.</p>
      </div>
      )}
      {usersFor.map((u) => (
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
      ))}
    </>
  );
}

export default UsersSelector;
