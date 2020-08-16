import React, { useState } from 'react';
import { useAsync } from 'react-async';
import { toast } from 'react-toastify';
import useUserState from '../../hooks/useUserState';
import ExpenseService from '../../services/expense.service';
import GroupService from '../../services/group.service';
import ExpenseItem from './ExpenseItem/ExpenseItem';
import ExpenseItemForm from './ExpenseItem/ExpenseItemForm';

function ExpenseList() {
  const [user] = useUserState();
  const [group, setGroup] = useState();
  const participants = (group && group.participants) || [];

  const setExpenses = (expenses) => {
    setGroup({ ...group, expenses });
  };

  ExpenseService.setGroup(user && user.favoriteGroup);
  function notifyGetAllError(error) {
    toast.error(`Erreur d'obtention des dépenses: ${error}`);
    console.log('error :', error);
  }

  const { isPending: loading } = useAsync({
    promiseFn: GroupService.getOne,
    _id: user && user.favoriteGroup,
    onReject: notifyGetAllError,
    onResolve: (r) => setGroup(r.document),
  });

  const deleteExpense = (id) => {
    setExpenses(group.expenses.filter((e) => e._id !== id));
  };

  const createExpense = (e) => {
    setExpenses([e, ...group.expenses]);
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
      <h2 className="title is-4">
        { group && group.name }
      </h2>
      <div>
        { group && group.participants && group.participants.map((p) => p.name).join(', ')}
      </div>
      <ExpenseItemForm createExpense={createExpense} participants={participants} />
      {group && group.expenses
        && group.expenses.map((expense) => (
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
