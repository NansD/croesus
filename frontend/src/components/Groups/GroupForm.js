import React, { useState } from 'react';
import { useAsync } from 'react-async';
import GroupService from '../../services/group.service';
import ParticipantForm from './ParticipantForm';

export default function GroupForm({ onChange }) {
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [showForm, setShowForm] = useState(false);

  function resetFields() {
    setName('');
    setShowForm(false);
  }

  function notifyChange(g) {
    onChange(g);
  }

  function notifyCreationSuccess(g) {
    notifyChange(g.document);
    resetFields();
  }

  function notifyCreationFailure() {
    notifyChange();
  }

  const { run } = useAsync({
    deferFn: GroupService.create,
    onResolve: notifyCreationSuccess,
    onReject: notifyCreationFailure,
  });

  function handleCreate() {
    return run({
      name,
      participants: participants.map((p) => ({ name: p.name, customRate: p.customRate })),
    });
  }

  function toggleShowForm() {
    setShowForm(!showForm);
  }

  function addParticipant(p) {
    setParticipants([p, ...participants]);
  }

  function updateParticipant(p) {
    const newParticipants = participants.map((participant) => (participant._id === p._id
      ? p
      : participant));
    setParticipants(newParticipants);
  }

  function removeParticipant(_id) {
    setParticipants(participants.filter((p) => p._id !== _id));
  }

  return showForm ? (
    <div className="card mb-5">
      <div className="card-header">
        <h1 className="card-header-title">
          Créer un groupe
        </h1>
      </div>
      <div className="card-content">
        <div className="field">
          <div className="field">
            <input
              className="input"
              type="text"
              placeholder="Nom du groupe"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <h2 className="title is-5"> Participants : </h2>
            <ParticipantForm addParticipant={addParticipant} />
            {participants.map((p) => <ParticipantForm addParticipant={updateParticipant} key={p._id} participant={p} removeParticipant={removeParticipant} />)}
          </div>

          <footer
            className="card-footer pt-2"
            style={{ justifyContent: 'space-between' }}
          >
            <button
              type="button"
              className="button is-warning"
              onClick={toggleShowForm}
            >
              <span className="icon is-small">
                <i className="fa fa-times" />
              </span>
              <span> Annuler </span>
            </button>
            <button
              className="button is-success"
              type="submit"
              onClick={handleCreate}
            >
              <span className="icon is-small">
                <i className="fa fa-check" />
              </span>
              <span>Sauvegarder</span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  ) : (
    <button
      type="button"
      className="button card is-success my-5"
      onClick={toggleShowForm}
    >
      <span className="icon is-small">
        <i className="fa fa-plus" />
      </span>
      <span> Créer un groupe </span>
    </button>
  );
}
