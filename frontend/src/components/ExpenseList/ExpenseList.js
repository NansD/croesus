import React, { useRef } from 'react';
import useFetch from '../../hooks/useFetch';

function ExpenseList() {
  const isComponentMounted = useRef(true);

  const { data, loading, error } = useFetch('expenses', isComponentMounted, []);

  if (loading) {
    return (
      <>
        <div>Loading data ...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div>
          Error
          {JSON.stringify(error)}
        </div>
      </>
    );
  }

  return (
    <>
      {data.expenses.map((expense) => (
        <div key={expense.id}>
          <h3>{JSON.stringify(expense)}</h3>
        </div>
      ))}
    </>
  );
}

export default ExpenseList;
