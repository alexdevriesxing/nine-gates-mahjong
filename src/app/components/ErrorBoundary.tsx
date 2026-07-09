import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Nine Gates Mahjong app:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-ink-950 text-ivory p-6 text-center">
          <div className="gate-medallion mb-8 animate-pulse">
            <span /><span /><span />
            <span /><span /><span />
            <span /><span /><span />
          </div>
          <h1 className="font-display text-4xl text-gold mb-4">Something went wrong</h1>
          <p className="text-ink-200 max-w-md mb-8">
            An unexpected error occurred while loading this page. Please try returning to the home page.
          </p>
          {this.state.error && (
            <pre className="bg-ink-900 border border-gold/10 p-4 rounded text-left text-xs max-w-xl overflow-auto mb-8 font-mono text-vermilion-light">
              {this.state.error.toString()}
            </pre>
          )}
          <button onClick={this.handleReset} className="btn-primary px-8 py-3">
            Go to Home Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
