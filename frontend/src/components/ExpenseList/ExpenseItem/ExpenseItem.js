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
    <div className="card mb-5">
      <header className="card-header-title" style={{ justifyContent: 'space-between' }}>
        <div>
          {expense.label}
        </div>
        <div>
          {expense.amount}
          &nbsp;
          €
        </div>
      </header>
      <div className="card-content">
        <strong>
          {expense.payer}
        </strong>
        <div>
          <small>
              &nbsp;
            {new Date(expense.submittedAt).toLocaleDateString()}
          </small>
        </div>

        <footer className="card-footer" style={{ justifyContent: 'flex-end', borderTop: '0' }}>
          <button className="button is-full-width is-danger is-light" type="button" onClick={handleDelete}>
            <i className="fa fa-trash" aria-label="delete" />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ExpenseItem;
