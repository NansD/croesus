import React from 'react';
import { toast } from 'react-toastify';
import { useAsync } from 'react-async';
import ExpenseService from '../../services/expense.service';

function Balance() {
  function notifyGetAllError(error) {
    toast.error(`Erreur d'obtention des dettes: ${error}`);
    console.log('error :', error);
  }

  const { data, pending: loading } = useAsync({
    promiseFn: ExpenseService.getComputedDebts,
    onReject: notifyGetAllError,
  });

  const debtsToPool = data && data.debtsToPool;

  if (loading || !debtsToPool) {
    return (
      <>
        <div className="is-loading"> Chargement... </div>
      </>
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
    <table className="table is-fullwidth">
      <tbody>
        {lines.map((l) => l)}
      </tbody>
    </table>
  );
}

export default Balance;
