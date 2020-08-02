import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAsync } from 'react-async';
import ExpenseService from '../../../services/expense.service';

import AVAILABLE_PAYERS from './AvailablePayers.json';
import UsersSelector from './UsersSelector/UsersSelector';

const ExpenseItemForm = ({ createExpense }) => {
  const [payer, setPayer] = useState(AVAILABLE_PAYERS[1]);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState(0);
  const [submittedAt, setDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [usersFor, setUsersFor] = useState([]);

  function resetFields() {
    setPayer(AVAILABLE_PAYERS[1]);
    setLabel('');
    setAmount(0);
    setShowForm(false);
    setUsersFor([]);
  }

  function currentExpense() {
    return {
      payer,
      label,
      amount,
      usersFor,
    };
  }

  function notifyCreationSuccess(res) {
    console.log('res :', res);
    toast.success(`Dépense pour ${label} créée !`);
    createExpense(res.document);
    resetFields();
  }

  function notifyCreationFailure(error) {
    toast.error(`Erreur de création de la dépense: ${error}`);
  }

  const { run } = useAsync({ deferFn: ExpenseService.create, onResolve: notifyCreationSuccess, onReject: notifyCreationFailure });

  function handleCreate() {
    if (!payer || !label || !amount) {
      return toast.error(
        `Des informations sur la dépense sont manquantes payeur: ${payer}, motif: ${label}, montant: ${amount}`,
      );
    }
    return run(currentExpense());
  }

  function toggleShowForm() {
    setShowForm(!showForm);
  }

  function notifyChange(users) {
    setUsersFor(users);
  }

  return showForm ? (
    <div className="card mb-5">
      <div className="card-content">
        <div className="field">
          <div className="field">
            <input
              className="input"
              type="text"
              placeholder="Motif"
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <div className="control has-icons-right">
              <p className="control has-icons-right">
                <input
                  className="input"
                  type="number"
                  placeholder="Montant"
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <span className="icon is-small is-right">
                  <i className="fa fa-euro" />
                </span>
              </p>
            </div>
          </div>
          <div className="select field" style={{ width: '100%' }}>
            <select
              style={{ width: '100%' }}
              aria-label="payer"
              placeholder="payer"
              onChange={(e) => setPayer(e.target.value)}
              value={payer}
              required
            >
              {AVAILABLE_PAYERS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <input
              className="input"
              type="text"
              disabled
              onChange={(e) => setDate(e.target.value)}
              value={submittedAt.toLocaleDateString()}
            />
          </div>
          <UsersSelector
            users={AVAILABLE_PAYERS.map((u) => ({ name: u, checked: true }))}
            notifyChange={notifyChange}
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
  ) : (
    <button
      type="button"
      className="button is-success my-5"
      onClick={toggleShowForm}
    >
      <span className="icon is-small">
        <i className="fa fa-plus" />
      </span>
      <span> Créer une dépense </span>
    </button>
  );
};

export default ExpenseItemForm;
