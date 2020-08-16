import React from 'react';
import { useAsync } from 'react-async';
import { toast } from 'react-toastify';
import GroupService from '../../services/group.service';

export default function Group({
  group, deleteGroup, active, setActiveGroup,
}) {
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
  return (
    <div className="card mb-5 animated">
      <div className="card-content">
        {group.name}
        {group._id}

      </div>
      <footer className="card-footer" style={{ justifyContent: 'space-between', borderTop: '0' }}>
        <button type="button" className="button is-light" onClick={setActiveGroup}>
          {active ? <i className="icon fa fa-star" aria-hidden="true" />
            : <i className="icon fa fa-star-o" aria-hidden="true" />}
        </button>
        <button className="button is-full-width is-danger is-light" type="button" onClick={handleDelete}>
          <i className="fa fa-trash" aria-label="delete" />
        </button>
      </footer>
    </div>
  );
}
