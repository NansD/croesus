import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'bulma/css/bulma.css';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import ExpenseList from './components/ExpenseList/ExpenseList';
import Balance from './components/Balance/Balance';
import useIsMobile from './hooks/useIsMobile';

const NAVIGATION = {
  EXPENSES: 'expenses',
  BALANCE: 'balance',
};

toast.configure();

function App() {
  const isMobile = useIsMobile();
  const [nav, setNav] = useState(NAVIGATION.EXPENSES);

  function navigate(page) {
    return function handleNavigate() {
      setNav(page);
    };
  }
  return (
    <div className="has-background-white-ter is-full-height">
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
        <nav className={`${isMobile && 'is-fixed-bottom'} navbar tabs is-centered is-large navbar has-shadow`}>
          <ul>
            <li className={nav === NAVIGATION.EXPENSES ? 'is-active' : undefined}>
              <a onClick={navigate(NAVIGATION.EXPENSES)}>
                <i className="icon fa fa-credit-card" aria-hidden="true" />
                Dépenses
              </a>
            </li>
            <li className={nav === NAVIGATION.BALANCE ? 'is-active' : undefined}>
              <a onClick={navigate(NAVIGATION.BALANCE)}>
                <i className="icon fa fa-balance-scale" aria-hidden="true" />
                Équilibres
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <ToastContainer />
      <section className="mx-5 my-3 columns is-centered is-narrow">
        <div className="column">
          { nav === NAVIGATION.EXPENSES && <ExpenseList />}
          { nav === NAVIGATION.BALANCE && <Balance />}
        </div>
      </section>
    </div>
  );
}

export default App;
