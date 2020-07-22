import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ExpenseService from '../../../services/expense.service';

const AVAILABLE_PAYERS = ['Solène', 'Nans'];

const ExpenseItemForm = ({ createExpense }) => {
  const [payer, setPayer] = useState(AVAILABLE_PAYERS[1]);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState(0);
  const [showForm, setShowForm] = useState(false);

  function resetFields() {
    setPayer(AVAILABLE_PAYERS[1]);
    setLabel('');
    setAmount(0);
    setShowForm(false);
  }

  function handleCreate() {
    if (!payer || !label || !amount) {
      return toast.error(
        `Des informations sur la dépense sont manquantes payeur: ${payer}, motif: ${label}, montant: ${amount}`,
      );
    }
    return ExpenseService.createExpense({ payer, label, amount })
      .then(() => {
        toast.success(`Dépense pour ${label} créée !`);
        createExpense();
        resetFields();
      })
      .catch((error) => {
        toast.error(`Erreur de création de la dépense: ${error}`);
      });
  }

  function toggleShowForm() {
    setShowForm(!showForm);
  }

  return showForm ? (
    <div className="card mb-5">
      <div className="card-content">
        <div className="field">
          <div className="select is-rounded">
            <select
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
        </div>

        <div className="field">
          <input
            className="input"
            type="text"
            disabled
            value={new Date().toLocaleDateString()}
          />
        </div>

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
        <footer
          className="card-footer"
          style={{ justifyContent: 'flex-end', borderTop: '0' }}
        >
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
    <button type="button" className="button is-success my-5" onClick={toggleShowForm}>
      <span className="icon is-small">
        <i className="fa fa-plus" />
      </span>
      <span> Créer une dépense </span>
    </button>
  );
};

export default ExpenseItemForm;
