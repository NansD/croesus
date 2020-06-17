import React from 'react';
import './App.css';
import 'bulma/css/bulma.css';
import ExpenseList from './components/ExpenseList/ExpenseList';

function App() {
  return (
    <>
      <header className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Croesus</h1>
            <span role="img" aria-label="money bag">💰</span>
            <h2 className="subtitle">La super application de partage des dépenses !</h2>
          </div>
        </div>
      </header>
      <section className="columns is-centered">
        <div className="column is-narrow">
          <ExpenseList />
        </div>
      </section>
    </>
  );
}

export default App;
