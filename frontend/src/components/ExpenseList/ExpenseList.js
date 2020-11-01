import React, { useEffect, useState } from 'react';
import { useAsync } from 'react-async';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import useUserState from '../../hooks/useUserState';
import NAVIGATION from '../../navigation.json';
import ExpenseService from '../../services/expense.service';
import GroupService from '../../services/group.service';
import GroupCarousel from '../GroupCarousel/GroupCarousel';
import Loading from '../Loading/Loading';
import ExpenseItem from './ExpenseItem/ExpenseItem';
import ExpenseItemForm from './ExpenseItem/ExpenseItemForm';

function pickUserFavoriteGroup(user) {
  return user && (user.favoriteGroup
                  || (user.groups[0] && user.groups[0]._id));
}

function checkUserGroups(user, history) {
  if (!user) {
    return;
  }
  if (user && (!user.groups.length || !pickUserFavoriteGroup(user))) {
    history.push(NAVIGATION.GROUPS);
    toast.info(
      <>
        <p>
          Vous n&apos;avez pas encore de groupe. Voici la page qui permet d&apos;en créer un!
        </p>
        <p>
          Pour commencer, cliquez sur &quot;Créer un groupe&quot;.
        </p>
      </>,
      { toastId: user._id },
    );
  }
}

export default function ExpenseList() {
  const [user] = useUserState();
  const [group, setGroup] = useState();
  const history = useHistory();
  const participants = (group && group.participants) || [];

  const setExpenses = (expenses) => {
    setGroup({ ...group, expenses });
  };

  useEffect(() => {
    checkUserGroups(user, history);
  }, [user, history]);

  if (!ExpenseService.groupId) ExpenseService.setGroup(pickUserFavoriteGroup(user));
  function notifyGetAllError(error) {
    toast.error(`Erreur d'obtention des dépenses: ${error}`);
    console.log('error :', error);
  }

  const { isPending: loading0 } = useAsync({
    promiseFn: GroupService.getOne,
    _id: ExpenseService.groupId || (user && user.favoriteGroup),
    onReject: notifyGetAllError,
    onResolve: (r) => setGroup(r.document),
  });

  // because taking {reload} from previous useAsync keeps old arguments
  const { run, isPending: loading1 } = useAsync({
    deferFn: GroupService.getOne,
    onReject: notifyGetAllError,
    onResolve: (r) => setGroup(r.document),
  });

  const loading = loading0 || loading1;

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
      <GroupCarousel groups={user.groups} activeGroupId={group && group._id} reload={run} />
      <h1 className="title">
        {group && group.name}
      </h1>
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
