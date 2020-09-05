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
  const lowestAmount = Math.min(...debts.map((d) => d.totalDebt));
  const nextShouldPay = debts.find((debt) => debt.totalDebt === lowestAmount);
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

      <div className="card message is-dark">
        <div className="card-content message-header">
          <p>Qui devrait payer ensuite ?</p>
        </div>
        <div className="message-body">
          <h4 className="title is-4 is-inline">{nextShouldPay.name}</h4>
          {' '}
          devrait payer la prochaine fois afin de réduire les écarts de dette.
        </div>
      </div>
      <table className="table is-fullwidth card mb-6">
        <tbody>
          {lines.map((l) => l)}
        </tbody>
      </table>
      <div className="card message is-dark">
        <div className="card-content message-header">
          <p>Comment lire ce tableau ?</p>
        </div>
        <div className="message-body">
          Un chiffre négatif signifie que vous
          {' '}
          <strong>devez</strong>
          {' '}
          un montant d&apos;argent.
          <br />
          Un chiffre positif signifie que les autres participants
          {' '}
          <strong>vous doivent</strong>
          {' '}
          de l&apos;argent.
        </div>
      </div>
    </>
  );
}

export default Balance;
