import React, { useState } from 'react';
import { useAsync } from 'react-async';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import useConfirmDeleteModal from '../../hooks/modal/useConfirmDeleteModal';
import NAVIGATION from '../../navigation.json';
import ExpenseService from '../../services/expense.service';
import GroupService from '../../services/group.service';
import CopyGroupIdButton from './CopyGroupIdButton';
import GroupForm from './GroupForm';

export default function Group({
  group, deleteGroup, active, setActiveGroup, reload,
}) {
  const history = useHistory();
  const [edit, setEdit] = useState(false);
  const { setShowModal, setCallback } = useConfirmDeleteModal();

  function notifyDeleteSuccess() {
    deleteGroup(group);
    toast.success('Groupe supprimé');
  }

  function notifyDeleteFailure(error) {
    reload();
    toast.error(`Erreur lors de la suppression : ${error}`);
  }

  const { run } = useAsync({
    deferFn: GroupService.delete,
    onResolve: notifyDeleteSuccess,
    onReject: notifyDeleteFailure,
  });

  function handleDelete(modalAction) {
    return modalAction && run(group._id);
  }

  function showConfirmModal() {
    setCallback(handleDelete);
    setShowModal(true, group.name, `Le groupe ${group.name} ainsi que toutes les dépenses qu'il contient seront supprimés. Vos amis qui y participent perdront aussi l'accès à ce groupe.`);
  }

  function updateGroup() {
    reload();
    setEdit(false);
  }

  if (edit) {
    return (
      <GroupForm group={group} toggle={() => setEdit(false)} onChange={updateGroup} />
    );
  }

  function goToExpenses(groupId) {
    return function navigateToExpense() {
      ExpenseService.setGroup(groupId);
      history.push(NAVIGATION.EXPENSES);
    };
  }

  return (
    <div className="card mb-5 animated">
      <div className="card-header">
        <h2 className="card-header-title is-5">
          {group.name}
        </h2>
        <button
          type="button"
          className="card-header-icon button is-link is-full-height is-inverted"
          aria-label="more options"
          onClick={goToExpenses(group._id)}
        >
          <span>Voir les dépenses</span>
          <i className="fa fa-share icon" aria-label="share" />
        </button>
      </div>
      <div className="card-content">
        <ul>
          { group && group.participants && group.participants.map((p) => (
            <li key={p._id}>
              { p.name }
            </li>
          ))}
        </ul>
      </div>
      <footer className="card-footer" style={{ justifyContent: 'space-between', borderTop: '0' }}>
        <div style={{ display: 'flex' }}>
          <button type="button" className="button is-light" onClick={setActiveGroup}>
            {active ? <i className="icon fa fa-star" aria-hidden="true" aria-label="Add to favorites" />
              : <i className="icon fa fa-star-o" aria-hidden="true" aria-label="Remove from favorites" />}
          </button>

          <CopyGroupIdButton groupId={group._id} />
        </div>
        <div style={{ display: 'flex' }}>
          <button className="button is-full-width is-danger is-light" type="button" onClick={showConfirmModal}>
            <i className="fa fa-trash" aria-label="delete" />
          </button>
          {!edit && (
          <button className="button is-full-width is-info is-light" type="button" onClick={() => setEdit(true)}>
            <i className="fa fa-pencil" aria-label="modify" />
          </button>
          )}
        </div>
      </footer>
    </div>
  );
}
