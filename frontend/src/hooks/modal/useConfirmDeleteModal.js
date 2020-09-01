import { useEffect, useState } from 'react';
import { useModalContext } from '../../contexts/modal/modal.context';

export default function useConfirmDeleteModal() {
  const {
    setShowModal, setModalContent, setTitle, setCallback,
  } = useModalContext();
  const [name, setName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  function newSetShowModal(show, nameToUse, newCustomMessage) {
    setShowModal(show);
    if (newCustomMessage) setCustomMessage(newCustomMessage);
    setName(nameToUse);
  }
  useEffect(() => {
    setTitle(`Supprimer ${name}`);
    if (customMessage) {
      setModalContent(customMessage);
    } else {
      setModalContent(`Confirmez-vous la suppression de ${name} ?`);
    }
  }, [name, setModalContent, customMessage, setTitle]);
  return { setShowModal: newSetShowModal, setCallback };
}
