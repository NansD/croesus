import React from 'react';
import Modal from '../../components/Modal/Modal';
import useModal from '../../hooks/useModal';
import { ModalContext } from './modal.context';

const { Provider } = ModalContext;

const ModalProvider = ({ children }) => {
  const {
    showModal, setShowModal, modalContent, setModalContent, title, setTitle, callback, setCallback,
  } = useModal();
  return (
    <Provider value={{
      showModal, setShowModal, modalContent, setModalContent, title, setTitle, callback, setCallback,
    }}
    >
      <Modal />
      {children}
    </Provider>
  );
};

export default ModalProvider;
