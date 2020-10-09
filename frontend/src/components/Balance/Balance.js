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
  const debts = keys.map((k) => ({
    name: k,
    totalDebt: Math.round(debtsToPool[k].totalDebt * 100) / 100,
  }));
  const lowestAmount = Math.max(...debts.map((d) => d.totalDebt));
  const nextShouldPay = debts.find((debt) => debt.totalDebt === lowestAmount);
  const lines = debts.map((line) => {
    if (line.totalDebt > 0) {
      return (
        <tr key={line.name}>
          <td>
            {line.name}
          </td>
          <td className="has-text-danger">
            -
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
        <td className="has-text-success">
          +
          {Math.abs(line.totalDebt)}
        </td>
      </tr>
    );
  });

  return (
    <>
      <GroupCarousel groups={user.groups} activeGroupId={group && group._id} reload={run} />

      {nextShouldPay && (
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
      )}
      {lines && lines.length ? (
        <>
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
              Un chiffre
              {' '}
              <span className="has-text-success">positif</span>
              {' '}
              signifie que l'on vous
              {' '}
              <strong>doit</strong>
              {' '}
              un montant d&apos;argent.
              <br />
              Un chiffre
              {' '}
              <span className="has-text-danger">négatif</span>
              {' '}
              signifie que vous
              {' '}
              <strong>devez</strong>
              {' '}
              de l&apos;argent.
            </div>
          </div>
        </>

      )
        : (
          <div className="card message is-warning">
            <div className="message-header">
              <p>Pas de dépenses pour ce groupe</p>
            </div>
            <div className="message-body">
              <p>
                Votre groupe ne contient pas encore de dépenses.
                Rendez-vous dans l&apos;onglet &quot;dépenses&quot; pour en créer!
              </p>
            </div>
          </div>
        )}
    </>
  );
}

export default Balance;
