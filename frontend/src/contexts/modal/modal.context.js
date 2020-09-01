import { createContext, useContext } from 'react';

const ModalContext = createContext();
function useModalContext() {
  return useContext(ModalContext);
}
export { ModalContext, useModalContext };
