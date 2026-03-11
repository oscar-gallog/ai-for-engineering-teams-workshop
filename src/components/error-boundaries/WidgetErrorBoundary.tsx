'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  widgetName?: string;
}

interface State {
  error: Error | null;
  retries: number;
}

const MAX_RETRIES = 3;

export class WidgetErrorBoundary extends Component<Props, State> {
  state: State = { error: null, retries: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[WidgetErrorBoundary:${this.props.widgetName ?? 'unknown'}]`, error, info.componentStack);
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
    const name = this.props.widgetName ?? 'Widget';

    return (
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 p-4 flex flex-col items-center text-center gap-2"
      >
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p className="text-sm font-medium text-red-700">{name} failed to load</p>
        {!isPermanent ? (
          <button
            onClick={this.handleRetry}
            className="text-xs text-red-600 underline hover:text-red-800 focus:outline-none"
          >
            Retry
          </button>
        ) : (
          <p className="text-xs text-red-500">Please refresh the page.</p>
        )}
      </div>
    );
  }
}
