import { useState } from 'react';

export default function useModal() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('I am a title');
  const [modalContent, setModalContent] = useState("I'm the Modal Content");
  const [callback, _setCallback] = useState(() => () => {});

  const setCallback = (fn) => {
    _setCallback(() => fn);
  };

  return {
    showModal, setShowModal, modalContent, setModalContent, title, setTitle, callback, setCallback,
  };
}
