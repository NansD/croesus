import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useStateIfMounted } from 'use-state-if-mounted';
import ExpenseItem from './ExpenseItem/ExpenseItem';
import ExpenseItemForm from './ExpenseItem/ExpenseItemForm';
import ExpenseService from '../../services/expense.service';
import useIsComponentMounted from '../../hooks/useIsComponentMounted';

function ExpenseList() {
  const isComponentMounted = useIsComponentMounted();
  const [expenses, setExpenses] = useStateIfMounted([]);
  const [loading, setLoading] = useStateIfMounted(false);

  async function fetchExpenses() {
    try {
      const fetchedData = await ExpenseService.getAll();
      setExpenses(fetchedData.documents);
    } catch (error) {
      toast.error(`Erreur d'obtention des dépenses: ${error}`);
      console.log('error :', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetchExpenses();
  }, [isComponentMounted]);

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e._id !== id));
  };

  const createExpense = () => {
    fetchExpenses();
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
      {expenses && expenses.map((expense) => (
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
