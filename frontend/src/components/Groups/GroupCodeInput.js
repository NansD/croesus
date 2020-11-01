import React, { useRef } from 'react';
import { useAsync } from 'react-async';
import { toast } from 'react-toastify';
import useInput from '../../hooks/useInput';
import useUserState from '../../hooks/useUserState';
import ClipboardService from '../../services/others/clipboard.service';
import userService from '../../services/user.service';
import LOCAL_STORAGE_KEYS from '../../localStorageKeys.json';

export default function GroupCodeInput({ reload }) {
  const [code, setCode, , bindCode] = useInput('');
  const [user, setUser] = useUserState();
  const inputRef = useRef(null);

  function notifyUpdateSuccess(data) {
    setUser({ ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.user)), ...data.document });
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

  async function pasteInInput() {
    try {
      const text = await ClipboardService.read();
      inputRef.current.value = text;
      setCode(text);
    } catch (error) {
      toast.error(error.message, { autoClose: 5000 });
    }
  }

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
      <div className="card-header">
        <h1 className="card-header-title">
          Rejoindre un groupe
        </h1>
      </div>
      <div className="card-content">
        <h3 className="label">
          Code de partage
        </h3>
        <div className="field has-addons">
          <div className="control">
            <button className="button is-primary" type="button" onClick={pasteInInput}>
              <i className="fa fa-paste icon" aria-hidden="true" />
            </button>
          </div>
          <div className="control is-expanded">
            <input id="groupCode" ref={inputRef} className="input" type="text" {...bindCode} />
          </div>
        </div>
        <button className="button is-success" type="button" onClick={submit}>
          <span>Rejoindre </span>
          <i className="fa fa-sign-in icon" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
