import React, { useState } from 'react';
import { useAsync } from 'react-async';
import { toast } from 'react-toastify';
import ExpenseService from '../../../services/expense.service';
import UsersSelector from './UsersSelector/UsersSelector';

const ExpenseItem = ({ expense, deleteExpense }) => {
  const [showDetail, setShowDetail] = useState(false);

  function notifyDeleteSuccess() {
    deleteExpense(expense._id);
    toast.success('Dépense supprimée');
  }

  function notifyDeleteFailure(error) {
    toast.error(`Erreur lors de la suppression : ${error}`);
  }

  const { run } = useAsync({
    deferFn: ExpenseService.delete,
    onResolve: notifyDeleteSuccess,
    onReject: notifyDeleteFailure,
  });

  function handleDelete() {
    run(expense._id);
  }

  function toggleShowDetail() {
    setShowDetail(!showDetail);
  }

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
          {expense.payer.name}
        </strong>
        <div>
          <small>
              &nbsp;
            {new Date(expense.submittedAt).toLocaleDateString()}
          </small>
        </div>

        { showDetail
          ? (
            <div>
              { expense.usersFor && <UsersSelector users={expense.usersFor} disabled />}
              <button type="button" className="button is-full-width is-info is-light" onClick={toggleShowDetail}>
                <i className="fa fa-caret-square-o-up" />
            &nbsp; Afficher moins
              </button>
            </div>
          )
          : (
            <div>
              <button type="button" className="button is-full-width is-info is-light" onClick={toggleShowDetail}>
                <i className="fa fa-caret-square-o-down" />
            &nbsp; Afficher plus
              </button>
            </div>
          )}

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
