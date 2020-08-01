import React, { useEffect } from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';
import { toast } from 'react-toastify';
import ExpenseService from '../../services/expense.service';

import useIsComponentMounted from '../../hooks/useIsComponentMounted';

function Balance() {
  const isComponentMounted = useIsComponentMounted();
  const [debtsToPool, setDebtsToPool] = useStateIfMounted([]);
  const [loading, setLoading] = useStateIfMounted(false);

  useEffect(() => {
    async function fetchBalance() {
      setLoading(true);
      try {
        const fetchedData = await ExpenseService.getComputedDebts();
        setDebtsToPool(fetchedData.debtsToPool);
      } catch (error) {
        toast.error(`Erreur d'obtention des équilibres: ${error}`);
        console.error('error :', error);
      }
      setLoading(false);
    }
    fetchBalance();
  }, [isComponentMounted]);

  if (loading) {
    return (
      <>
        <div className="is-loading" />
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
