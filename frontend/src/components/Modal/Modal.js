import React from 'react';
import { useModalContext } from '../../contexts/modal/modal.context';

export default function Modal() {
  const {
    showModal, setShowModal, modalContent, title, callback,
  } = useModalContext();

  if (!showModal) {
    return null;
  }

  function closeModal() {
    callback(false);
    setShowModal(false);
  }

  function confirm() {
    callback(true);
    setShowModal(false);
  }

  function handleKeyPress(event) {
    if (['Esc', 'Escape'].includes(event.key)) {
      closeModal();
    }
  }

  return (
    <div className="modal is-active">
      <div role="button" tabIndex={0} aria-label="background close modal" onKeyPress={(e) => handleKeyPress(e)} className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button type="button" className="delete" onClick={closeModal} aria-label="close" />
        </header>
        <section className="modal-card-body">
          <div className="content">
            {modalContent}
          </div>
        </section>
        <footer className="modal-card-foot" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="button" onClick={closeModal}>Annuler</button>
          <button type="button" className="button is-primary" onClick={confirm}>Confirmer</button>
        </footer>
      </div>
    </div>
  );
}
