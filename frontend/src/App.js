import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'bulma/css/bulma.css';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import ExpenseList from './components/ExpenseList/ExpenseList';

toast.configure();
function App() {
  return (
    <>
      <header className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Croesus &nbsp;
              <i className="fa fa-money is-green" />
            </h1>
            <h2 className="subtitle">La super application de partage des dépenses !</h2>
          </div>
        </div>
      </header>
      <ToastContainer />
      <section className="mx-5 columns is-centered is-narrow">
        <div className="column">
          <ExpenseList />
        </div>
      </section>
    </>
  );
}

export default App;
