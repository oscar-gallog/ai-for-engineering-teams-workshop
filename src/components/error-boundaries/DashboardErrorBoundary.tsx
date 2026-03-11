'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  retries: number;
}

const MAX_RETRIES = 3;

export class DashboardErrorBoundary extends Component<Props, State> {
  state: State = { error: null, retries: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[DashboardErrorBoundary]', error, info.componentStack);
    }
  }

  handleRetry = () => {
    if (this.state.retries < MAX_RETRIES) {
      this.setState((s) => ({ error: null, retries: s.retries + 1 }));
    }
  };

  render() {
    const { error, retries } = this.state;
    if (!error) return this.props.children;

    const isPermanent = retries >= MAX_RETRIES;

    return (
      <div
        role="alert"
        className="min-h-screen flex items-center justify-center bg-gray-50 p-8"
      >
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-600 mb-6">
            {isPermanent
              ? 'The dashboard encountered a persistent error. Please refresh the page.'
              : 'An unexpected error occurred. You can try again.'}
          </p>
          {!isPermanent ? (
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Retry ({MAX_RETRIES - retries} attempt{MAX_RETRIES - retries !== 1 ? 's' : ''} left)
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-md
                hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Refresh page
            </button>
          )}
        </div>
      </div>
    );
  }
}
