import React, { useState } from 'react';
import { useAsync } from 'react-async';
import { toast } from 'react-toastify';
import useUserState from '../../hooks/useUserState';
import ExpenseService from '../../services/expense.service';
import GroupService from '../../services/group.service';
import Loading from '../Loading/Loading';
import ExpenseItem from './ExpenseItem/ExpenseItem';
import ExpenseItemForm from './ExpenseItem/ExpenseItemForm';

export default function ExpenseList() {
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
      <Loading />
    );
  }

  return (
    <>
      <div className="hero has-background-white mb-5">
        <div className="hero-body">
          <h3 className="title is-3">
            { group && group.name }
          </h3>
          <h4 className="subtitle is-4">
            Participants :
            { group
            && group.participants && group.participants.map((p) => <div key={p._id}>{p.name}</div>)}
          </h4>
        </div>
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
    </>
  );
}
