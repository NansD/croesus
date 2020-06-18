import React, { useRef, useState, useEffect } from 'react';
import ExpenseItem from './ExpenseItem/ExpenseItem';
import ExpenseService from '../../services/expense.service';

function ExpenseList() {
  const isComponentMounted = useRef(true);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const fetchedData = await ExpenseService.getAll();
      setExpenses(fetchedData.expenses);
      setLoading(false);
    })();
  }, [isComponentMounted]);

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  if (loading) {
    return (
      <>
        <div className="is-loading" />
      </>
    );
  }

  return (
    <>
      <h2>Liste des dépenses</h2>
      {expenses && expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          deleteExpense={deleteExpense}
        />
      ))}
    </>
  );
}

export default ExpenseList;
