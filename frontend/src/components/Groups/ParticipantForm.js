import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useInput from '../../hooks/useInput';

export default function ParticipantForm({
  participantsNames,
  participant,
  addParticipant,
  removeParticipant,
}) {
  const [name, , resetName, bindName] = useInput(participant
    && participant.name);
  const [customRate, , resetCustomRate, bindCustomRate] = useInput(participant
    && participant.customRate);
  const [nameError, setNameError] = useState();

  function flushNameError() {
    if (nameError) setNameError();
  }

  function setError(error) {
    if (!nameError) setNameError(error);
  }

  function resetFields() {
    resetName();
    resetCustomRate();
  }
  function disabled() {
    if (!name) {
      return true;
    }
    const duplicate = participantsNames && participantsNames.find((pn) => pn === name);
    if (duplicate && !participant) {
      setError('Les noms des participants doivent être uniques');
      return true;
    }
    flushNameError();
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
        {nameError && (<p className="help is-danger">{nameError}</p>)}
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
