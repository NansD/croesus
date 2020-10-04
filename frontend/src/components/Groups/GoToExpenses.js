import React from 'react';
import { useHistory } from 'react-router-dom';
import NAVIGATION from '../../navigation.json';
import ExpenseService from '../../services/expense.service';

export default function GoToExpenses({ group }) {
  const history = useHistory();

  function goToExpenses(groupId) {
    return function navigateToExpense() {
      ExpenseService.setGroup(groupId);
      history.push(NAVIGATION.EXPENSES);
    };
  }
  return (
    <button
      type="button"
      className="card-header-icon button is-link is-full-height is-inverted"
      aria-label="more options"
      onClick={goToExpenses(group._id)}
    >
      <span>Voir les dépenses</span>
      <i className="fa fa-share icon" aria-label="share" />
    </button>
  );
}
