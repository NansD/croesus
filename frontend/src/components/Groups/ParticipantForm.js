import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return [
    value,
    setValue,
    () => setValue(''),
    {
      value,
      onChange: (event) => {
        setValue(event.target.value);
      },
    },
  ];
};

export default function ParticipantForm({ participant, addParticipant, removeParticipant }) {
  const [name, setName, resetName, bindName] = useInput('');
  const [customRate, setCustomRate, resetCustomRate, bindCustomRate] = useInput('');

  useEffect(() => {
    if (participant) {
      setName(participant.name);
      setCustomRate(participant.customRate);
    }
  }, [participant]);

  function resetFields() {
    resetName();
    resetCustomRate();
  }
  function notifyAddParticipant() {
    addParticipant({ _id: uuidv4(), name, customRate });
    if (!participant) resetFields();
  }
  function notifyRemoveParticipant() {
    removeParticipant(participant._id);
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
  return (
    <div className="field">
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
        <button className="button is-small is-success" type="button" onClick={notifyAddParticipant}>
          <span className="icon is-small">
            <i className="fa fa-check" />
          </span>
          <span>{participant ? 'Mettre à jour' : 'Ajouter'}</span>
        </button>
        )}
      </div>
    </div>
  );
}
