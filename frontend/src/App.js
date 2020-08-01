import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import 'bulma/css/bulma.css';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import ExpenseList from './components/ExpenseList/ExpenseList';
import Balance from './components/Balance/Balance';
import useIsMobile from './hooks/useIsMobile';
import LiLinkRoute from './components/LiLinkRoute/LiLinkRoute';

const NAVIGATION = {
  EXPENSES: '/',
  BALANCE: '/balance',
};

toast.configure();

function App() {
  const isMobile = useIsMobile();

  return (
    <Router>
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
          <nav
            className={`${
              isMobile && 'is-fixed-bottom'
            } navbar tabs is-centered is-large navbar has-shadow`}
          >
            <ul>
              <LiLinkRoute to={NAVIGATION.EXPENSES} fontAwesomeClassName="fa-credit-card" label="Dépenses" />
              <LiLinkRoute to={NAVIGATION.BALANCE} fontAwesomeClassName="fa-balance-scale" label="Équilibres" />
            </ul>
          </nav>
        </header>
        <ToastContainer />
        <Switch>
          <>
            <section className="mx-5 my-3 columns is-centered is-narrow">
              <div className="column">
                <Route exact path={NAVIGATION.EXPENSES}>
                  <ExpenseList />
                </Route>
                <Route exact path={NAVIGATION.BALANCE}>
                  <Balance />
                </Route>
              </div>
            </section>
          </>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
