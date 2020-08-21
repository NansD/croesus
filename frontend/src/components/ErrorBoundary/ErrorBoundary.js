/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import LOCAL_STORAGE_KEYS from '../../localStorageKeys.json';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error, info);
    // localStorage.clear();
  }

  static getDerivedStateFromError(error) {
    console.log('ERROR BOUNDARY', error);
    console.log('error.message :', error.message);
    const lsUser = localStorage.getItem(LOCAL_STORAGE_KEYS.user);
    if (!lsUser || lsUser === 'undefined') {
      localStorage.clear();
      console.log('window.location.host :', window.location.host);
      window.location.assign(window.location.host);
    }
    // Update state so the next render will show the fallback UI.
    return { hasError: error };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <h1>
            Something went wrong :
            {' '}
            {JSON.stringify(this.state.hasError.message)}

          </h1>
          <button className="button" type="button" onClick={() => this.setState({ hasError: false })}>
            OK
          </button>
        </>
      );
    }
    return this.props.children;
  }
}
