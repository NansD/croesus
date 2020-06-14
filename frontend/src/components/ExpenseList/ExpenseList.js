import React, {useRef} from "react";
import { useFetch } from "../../hooks/useFetch";

function ExpenseList() {
  const isComponentMounted = useRef(true);

  const { data, loading, error } = useFetch("expenses", isComponentMounted, []);
  console.log('data :', data);
  return (
    <>
      {loading ? (
        <div>Loading data...</div>
      ) : (
        data.expenses.map((expense) => (
          <div key={expense.id}>
            <h3>{JSON.stringify((expense))}</h3>
          </div>
        ))
      )}
    </>
  );
}

export default ExpenseList;
