import React from 'react';
import { toast } from 'react-toastify';
import { useAsync } from 'react-async';
import ExpenseItem from './ExpenseItem/ExpenseItem';
import ExpenseItemForm from './ExpenseItem/ExpenseItemForm';
import ExpenseService from '../../services/expense.service';

function ExpenseList() {
  function notifyGetAllError(error) {
    toast.error(`Erreur d'obtention des dépenses: ${error}`);
    console.log('error :', error);
  }

  const { data: expenses, pending: loading, setData: setExpenses } = useAsync({
    promiseFn: ExpenseService.getAll,
    onReject: notifyGetAllError,
  });

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e._id !== id));
  };

  const createExpense = (e) => {
    setExpenses([e, ...expenses]);
  };

  if (loading) {
    return (
      <>
        <div className="is-loading" />
      </>
    );
  }

  return (
    <div>
      <ExpenseItemForm createExpense={createExpense} />
      {expenses
        && expenses.map((expense) => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            deleteExpense={deleteExpense}
          />
        ))}
    </div>
  );
}

export default ExpenseList;
