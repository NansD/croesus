import React from 'react';
import { useAsync } from 'react-async';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/authentication';
import GroupService from '../../services/group.service';
import GroupPresentation from '../GroupPresentation/GroupPresentation';
import Loading from '../Loading/Loading';

function Balance() {
  function notifyGetAllError(error) {
    toast.error(`Erreur d'obtention des dettes: ${error}`);
    console.log('error :', error);
  }

  const { user } = useAuth();

  const { data, pending: loading } = useAsync({
    promiseFn: GroupService.getComputedDebts,
    _id: user && user.favoriteGroup,
    onReject: notifyGetAllError,
  });

  const debtsToPool = data && data.debtsToPool;

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
      <GroupPresentation group={data.group} />
      <table className="table is-fullwidth card">
        <tbody>
          {lines.map((l) => l)}
        </tbody>
      </table>
    </>
  );
}

export default Balance;
