import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import useInput from '../../hooks/useInput';

export default function ParticipantForm({ participant, addParticipant, removeParticipant }) {
  const [name, , resetName, bindName] = useInput(participant
    && participant.name);
  const [customRate, , resetCustomRate, bindCustomRate] = useInput(participant
    && participant.customRate);

  function resetFields() {
    resetName();
    resetCustomRate();
  }
  function disabled() {
    if (!name) {
      return true;
    }
    return (
      participant
        && name === participant.name
        && customRate === participant.customRate
    );
  }
  function notifyAddParticipant(e) {
    e.preventDefault();
    if (!disabled()) {
      addParticipant({
        _id: uuidv4(), ...participant, name, customRate,
      });
      if (!participant) {
        resetFields();
      }
    }
  }
  function notifyRemoveParticipant() {
    removeParticipant(participant._id);
  }

  return (
    <form className="field" onSubmit={(e) => notifyAddParticipant(e)}>
      <div className="field">
        <input className="input" type="text" placeholder="Nom" {...bindName} />
      </div>
      <div className="field">
        <input className="input" type="number" placeholder="Ratio" {...bindCustomRate} />
      </div>
      <div className={disabled() || participant ? 'mb-6' : ''} style={{ display: 'flex', justifyContent: 'space-between' }}>
        {participant && (
        <button className="button is-small" type="button" onClick={notifyRemoveParticipant}>
          <span className="icon is-small">
            <i className="fa fa-trash" />
          </span>
        </button>
        )}
        {!disabled() && (
        <button className="button is-small is-success" type="submit">
          <span className="icon is-small">
            <i className="fa fa-check" />
          </span>
          <span>{participant ? 'Mettre à jour' : 'Ajouter'}</span>
        </button>
        )}
      </div>
    </form>
  );
}
