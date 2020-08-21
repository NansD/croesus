/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import ErrorHandler from './ErrorHandler';

export default class CoreAppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    console.log('[CoreAppErrorBoundary]', error, info);
    this.setState({ hasError: error, info: info.componentStack });
  }

  static getDerivedStateFromError(error) {
    return { hasError: error };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorHandler message={`${this.state.hasError.message} ${JSON.stringify(this.state.info)}` || ''} removeError={() => this.setState({ hasError: false })} />
      );
    }
    return this.props.children;
  }
}
