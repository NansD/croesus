import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ExpenseItem from './ExpenseItem/ExpenseItem';
import ExpenseItemForm from './ExpenseItem/ExpenseItemForm';
import ExpenseService from '../../services/expense.service';

function ExpenseList() {
  const isComponentMounted = useRef(true);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchExpenses() {
    try {
      const fetchedData = await ExpenseService.getAll();
      setExpenses(fetchedData.expenses);
    } catch (error) {
      console.log('error :', error);
      toast.error(`Erreur d'obtention des dépenses: ${error}`);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetchExpenses();
  }, [isComponentMounted]);

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
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
    <>
      <h2>Liste des dépenses</h2>
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Date</th>
            <th>Label</th>
            <th>Montant</th>
            <th label="actions" />
          </tr>
        </thead>
        <tbody>
          <ExpenseItemForm createExpense={createExpense} />
          {expenses && expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              deleteExpense={deleteExpense}
            />
          ))}
        </tbody>
      </table>

    </>
  );
}

export default ExpenseList;
