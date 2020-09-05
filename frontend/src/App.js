import 'bulma/css/bulma.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Balance from './components/Balance/Balance';
import Credits from './components/Credits/Credits';
import CoreAppErrorBoundary from './components/ErrorBoundary/CoreAppErrorBoundary';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ExpenseList from './components/ExpenseList/ExpenseList';
import Groups from './components/Groups/Groups';
import Home from './components/Home/Home';
import LiLinkRoute from './components/LiLinkRoute/LiLinkRoute';
import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import SignUp from './components/SignUp/SignUp';
import { AuthContext } from './contexts/authentication';
import ModalProvider from './contexts/modal/modal.provider';
import useAuthTokenState from './hooks/useAuthTokenState';
import useIsMobile from './hooks/useIsMobile';
import useUserState from './hooks/useUserState';
import NAVIGATION from './navigation.json';

toast.configure();

function App() {
  const isMobile = useIsMobile();
  const [authToken, setAuthToken] = useAuthTokenState();
  const [user, setUser] = useUserState();

  const setToken = (token, newUser) => {
    setAuthToken(token);
    setUser(newUser);
  };

  const logOut = () => {
    setUser('');
    setAuthToken('');
  };

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={{
        authToken, setAuthToken: setToken, logOut, user,
      }}
      >
        <ModalProvider>
          <Router>
            <div className="has-navbar-fixed-bottom has-background-white-ter is-full-height has-overflow-scroll">
              <header className="hero" style={{ backgroundColor: '#FFFFFF' }}>
                <NavBar isAuthenticated={!!authToken} />
                {authToken && (
                <nav
                  className={isMobile
                    ? 'is-fixed-bottom tabs is-fullwidth navbar has-background-white has-shadow'
                    : 'tabs is-fullwidth navbar has-background-white has-shadow'}
                >
                  <ul>
                    <LiLinkRoute to={NAVIGATION.EXPENSES} fontAwesomeClassName="fa-credit-card" label="Dépenses" />
                    <LiLinkRoute to={NAVIGATION.BALANCE} fontAwesomeClassName="fa-balance-scale" label="Équilibres" />
                  </ul>
                </nav>
                )}
              </header>
              <ToastContainer limit={2} />
              <CoreAppErrorBoundary>
                <Switch>
                  <>
                    <section className="mx-5 my-3 pb-6 columns is-centered is-narrow">
                      <div className="column">
                        <Route exact path={NAVIGATION.HOME}>
                          <Home />
                        </Route>
                        <Route exact path={NAVIGATION.LOGIN}>
                          <Login />
                        </Route>
                        <Route path={NAVIGATION.SIGNUP}>
                          <SignUp />
                        </Route>
                        <Route path={NAVIGATION.CREDITS}>
                          <Credits />
                        </Route>
                        <PrivateRoute exact path={NAVIGATION.EXPENSES}>
                          <ExpenseList />
                        </PrivateRoute>
                        <PrivateRoute exact path={NAVIGATION.BALANCE}>
                          <Balance />
                        </PrivateRoute>
                        <PrivateRoute exact path={NAVIGATION.GROUPS}>
                          <Groups />
                        </PrivateRoute>
                      </div>
                    </section>
                  </>
                </Switch>
              </CoreAppErrorBoundary>
            </div>
          </Router>
        </ModalProvider>
      </AuthContext.Provider>
    </ErrorBoundary>

  );
}

export default App;
