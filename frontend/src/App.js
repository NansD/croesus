import React, { useEffect } from "react";
import "./App.css";
import 'bulma/css/bulma.css'
import ExpenseList from "./components/ExpenseList/ExpenseList";

function App() {
  return (
    <>
      <header className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Croesus 💰</h1>
            <h2 className="subtitle">La super application de partage des dépenses !</h2>
          </div>
        </div>
      </header>
      <section className="columns">
        <div className="column">
        </div>
        <div className="column">
          <ExpenseList></ExpenseList>
        </div>
        <div className="column">
        </div>
      </section>
    </>
  );
}

export default App;
