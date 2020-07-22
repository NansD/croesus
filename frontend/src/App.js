import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'bulma/css/bulma.css';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import ExpenseList from './components/ExpenseList/ExpenseList';

toast.configure();
function App() {
  return (
    <div style={{ backgroundColor: '#FAFAFA' }}>
      <header className="hero" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="px-5 py-2">
          <div className="container">
            <h1 className="title">
              Croesus &nbsp;
              <i className="fa fa-money is-green" />
            </h1>
            <h2 className="subtitle">
              La super application de partage des dépenses !
            </h2>
          </div>
        </div>
      </header>
      <ToastContainer />
      <section className="mx-5 my-3 columns is-centered is-narrow">
        <div className="column">
          <ExpenseList />
        </div>
      </section>
    </div>
  );
}

export default App;
