import React from 'react';
import ExpenseService from '../../../services/expense.service';

const ExpenseItem = ({ expense, deleteExpense }) => {
  const handleDelete = () => {
    ExpenseService.deleteExpense(expense.id);
    deleteExpense(expense.id);
  };

  return (
    <div className="box">
      <div className="media-content">
        <div className="content columns">
          <div className="column">
            <strong>
              {expense.payer}
            </strong>
            ,
            <small>
            &nbsp;
              {new Date(expense.submittedAt).toLocaleDateString()}
            </small>
          </div>
          <div className="column">
            <p>{expense.label}</p>
          </div>
          <div className="column">
            <p>
              {expense.amount}
            &nbsp; €
            </p>
          </div>
          <div className="column">
            <button className="button is-full-width is-danger is-light" type="button" onClick={handleDelete}>
              <i className="fa fa-trash" aria-label="delete" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
