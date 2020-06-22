import React from 'react';
import { toast } from 'react-toastify';
import ExpenseService from '../../../services/expense.service';

const ExpenseItem = ({ expense, deleteExpense }) => {
  const handleDelete = () => {
    ExpenseService.deleteExpense(expense.id)
      .then(() => {
        deleteExpense(expense.id);
        toast.success('Dépense supprimée');
      })
      .catch((error) => {
        toast.error(`Erreur lors de la suppression : ${error}`);
      });
  };

  return (
    <tr>
      <td>
        <strong>
          {expense.payer}
        </strong>
      </td>
      <td>
        <small>
            &nbsp;
          {new Date(expense.submittedAt).toLocaleDateString()}
        </small>
      </td>
      <td>
        {expense.label}
      </td>
      <td>
        {expense.amount}
        &nbsp;
        €
      </td>
      <td>
        <button className="button is-full-width is-danger is-light" type="button" onClick={handleDelete}>
          <i className="fa fa-trash" aria-label="delete" />
        </button>
      </td>
    </tr>
  );
};

export default ExpenseItem;
