import React, { useState } from 'react';
import { useAsync } from 'react-async';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/authentication';
import GroupService from '../../services/group.service';
import GroupCarousel from '../GroupCarousel/GroupCarousel';
import Loading from '../Loading/Loading';

function Balance() {
  function notifyGetAllError(error) {
    toast.error(`Erreur d'obtention des dettes: ${error}`);
    console.log('error :', error);
  }
  const [group, setGroup] = useState();
  const [debtsToPool, setDebtsToPool] = useState();

  const { user } = useAuth();

  const { pending: loading0 } = useAsync({
    promiseFn: GroupService.getComputedDebts,
    _id: user && user.favoriteGroup,
    onReject: notifyGetAllError,
    onResolve: (r) => setGroup(r.group) || setDebtsToPool(r.debtsToPool),
  });

  // because taking {reload} from previous useAsync keeps old arguments
  const { run, isPending: loading1 } = useAsync({
    deferFn: GroupService.getComputedDebts,
    onReject: notifyGetAllError,
    onResolve: (r) => setGroup(r.group) || setDebtsToPool(r.debtsToPool),
  });

  const loading = loading0 || loading1;

  if (loading || !debtsToPool) {
    return (
      <Loading />
    );
  }

  const keys = Object.keys(debtsToPool);
  const debts = keys.map((k) => ({ name: k, totalDebt: debtsToPool[k].totalDebt }));
  const lines = debts.map((line) => {
    if (line.totalDebt > 0) {
      return (
        <tr key={line.name}>
          <td>
            {line.name}
          </td>
          <td className="has-text-success">
            +
            {line.totalDebt}
          </td>
        </tr>
      );
    }
    return (
      <tr key={line.name}>
        <td>
          {line.name}
        </td>
        <td className="has-text-danger">
          {line.totalDebt}
        </td>
      </tr>
    );
  });

  return (
    <>
      <GroupCarousel groups={user.groups} activeGroupId={group && group._id} reload={run} />

      <table className="table is-fullwidth card">
        <tbody>
          {lines.map((l) => l)}
        </tbody>
      </table>
    </>
  );
}

export default Balance;
