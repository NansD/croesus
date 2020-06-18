import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ExpenseService from '../../../services/expense.service';

const AVAILABLE_PAYERS = [
  'Nathan',
  'Solène',
  'Nans',
];

const ExpenseItemForm = ({ createExpense }) => {
  const [payer, setPayer] = useState('Nans');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState(0);
  const handlecreate = async () => {
    if (!payer || !label || !amount) {
      return toast.error('Des informations sur la dépense sont manquantes');
    }
    try {
      await ExpenseService.createExpense({ payer, label, amount });
      toast.success(`Dépense pour ${label} créée !`);
    } catch (error) {
      toast.error(`Erreur de création de la dépense: ${error}`);
    }
    createExpense();
  };

  return (
    <tr>
      <td>
        <div className="select is-rounded">
          <select onChange={(e) => setPayer(e.target.value)} value={payer} required>
            {
              AVAILABLE_PAYERS.map((p) => <option key={p}>{p}</option>)
            }
          </select>
        </div>
      </td>
      <td>
        <input className="input" type="text" disabled value={new Date().toLocaleDateString()} />
      </td>
      <td>
        <input className="input" type="text" placeholder="Motif" onChange={(e) => setLabel(e.target.value)} required />
      </td>
      <td className="control has-icons-right">
        <p className="control has-icons-right">
          <input className="input" type="number" placeholder="Montant" onChange={(e) => setAmount(e.target.value)} required />
          <span className="icon is-small is-right">
            <i className="fa fa-euro" />
          </span>
        </p>
      </td>
      <td>
        <button className="button is-full-width is-success is-light" type="submit" onClick={handlecreate}>
          <i className="fa fa-send" aria-label="create" />
        </button>
      </td>
    </tr>
  );
};

export default ExpenseItemForm;
