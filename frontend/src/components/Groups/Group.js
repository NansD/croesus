import React, { useState } from 'react';
import { useAsync } from 'react-async';
import { toast } from 'react-toastify';
import GroupService from '../../services/group.service';
import CopyGroupIdButton from './CopyGroupIdButton';
import GroupForm from './GroupForm';

export default function Group({
  group, deleteGroup, active, setActiveGroup, reload,
}) {
  const [edit, setEdit] = useState(false);

  function notifyDeleteSuccess() {
    deleteGroup(group);
    toast.success('Groupe supprimé');
  }

  function notifyDeleFailure(error) {
    toast.error(`Erreur lors de la suppression : ${error}`);
  }

  const { run } = useAsync({
    deferFn: GroupService.delete,
    onResolve: notifyDeleteSuccess,
    onReject: notifyDeleFailure,
  });

  function handleDelete() {
    run(group._id);
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

  return (
    <div className="card mb-5 animated">
      <div className="card-content">
        <h2 className="title is-5">
          {group.name}
        </h2>
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
          <button className="button is-full-width is-danger is-light" type="button" onClick={handleDelete}>
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
