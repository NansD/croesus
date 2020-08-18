import React from 'react';
import { useAsync } from 'react-async';
import { toast } from 'react-toastify';
import useInput from '../../hooks/useInput';
import useUserState from '../../hooks/useUserState';
import userService from '../../services/user.service';

export default function GroupCodeInput({ reload }) {
  const [code, , , bindCode] = useInput('');
  const [user, setUser] = useUserState();

  function notifyUpdateSuccess(data) {
    setUser(data.document);
    reload();
    toast.success('Groupe ajouté avec succès');
  }

  function notifyUpdateFailure(error) {
    toast.error(`Une erreur a eu lieu lors de l'ajout du groupe : ${error}`);
  }

  const { run } = useAsync({
    deferFn: userService.update,
    onResolve: notifyUpdateSuccess,
    onReject: notifyUpdateFailure,
  });

  function submit() {
    if (!code) {
      return toast.warning('Veuillez spécifier un code');
    }
    if (user.groups.map((g) => g._id).includes(code)) {
      return toast.warning('Vous appartenez déjà à ce groupe');
    }
    return run({ ...user, groups: [...user.groups, code] });
  }
  return (
    <div className="card mb-6">
      <div className="card-content">
        <label className="label" htmlFor="groupCode">
          Code de partage
          <input id="groupCode" className="input" type="text" {...bindCode} />
        </label>
        <button className="button is-success" type="button" onClick={submit}>
          <span>Rejoindre </span>
          <i className="fa fa-sign-in icon" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
