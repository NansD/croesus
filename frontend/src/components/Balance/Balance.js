import React, { useState } from 'react';
import { useAsync } from 'react-async';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/authentication';
import GroupService from '../../services/group.service';
import Loading from '../Loading/Loading';
import PullToRefresh from '../PullToRefresh/PullToRefresh';

function Balance() {
  const [debtsToPool, setDebtsToPool] = useState();
  function notifyGetAllError(error) {
    toast.error(`Erreur d'obtention des dettes: ${error}`);
    console.log('error :', error);
  }

  const { user } = useAuth();

  const { pending: loading, reload } = useAsync({
    promiseFn: GroupService.getComputedDebts,
    _id: user && user.favoriteGroup,
    onReject: notifyGetAllError,
    onResolve: (d) => setDebtsToPool(d.debtsToPool) || console.log(d),
  });

  if (loading && !debtsToPool) {
    return (
      <Loading />
    );
  }

  let lines = [];
  if (debtsToPool) {
    const keys = Object.keys(debtsToPool);
    const debts = keys.map((k) => ({ name: k, totalDebt: debtsToPool[k].totalDebt }));
    lines = debts.map((line) => {
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
  }

  return (
    <PullToRefresh onRefresh={() => console.log('reload') || reload()}>
      {loading && (<Loading />)}
      <table className="table is-fullwidth card">
        <tbody>
          {lines.map((l) => l)}
        </tbody>
      </table>
    </PullToRefresh>
  );
}

export default Balance;
