import React, { useState } from 'react';
import { useAsync } from 'react-async';
import GroupService from '../../services/group.service';

export default function GroupForm({ onChange }) {
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);

  function resetFields() {
    setName('');
    setShowForm(false);
  }

  function notifyChange(g) {
    console.log('g :', g);
    onChange(g);
  }

  function notifyCreationSuccess(g) {
    notifyChange(g.document);
    resetFields();
  }

  function notifyCreationFailure() {
    notifyChange();
  }

  const { run } = useAsync({
    deferFn: GroupService.create,
    onResolve: notifyCreationSuccess,
    onReject: notifyCreationFailure,
  });

  function handleCreate() {
    return run({ name });
  }

  function toggleShowForm() {
    setShowForm(!showForm);
  }

  return showForm ? (
    <div className="card mb-5">
      <div className="card-header">
        <h1 className="card-header-title">
          Créer un groupe
        </h1>
      </div>
      <div className="card-content">
        <div className="field">
          <div className="field">
            <input
              className="input"
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <footer
            className="card-footer"
            style={{ justifyContent: 'space-between', borderTop: '0' }}
          >
            <button
              type="button"
              className="button is-warning"
              onClick={toggleShowForm}
            >
              <span className="icon is-small">
                <i className="fa fa-times" />
              </span>
              <span> Annuler </span>
            </button>
            <button
              className="button is-success"
              type="submit"
              onClick={handleCreate}
            >
              <span className="icon is-small">
                <i className="fa fa-check" />
              </span>
              <span>Sauvegarder</span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  ) : (
    <button
      type="button"
      className="button card is-success my-5"
      onClick={toggleShowForm}
    >
      <span className="icon is-small">
        <i className="fa fa-plus" />
      </span>
      <span> Créer un groupe </span>
    </button>
  );
}
