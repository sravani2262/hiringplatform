import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CandidatesErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Candidates Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="card-premium border-none shadow-xl rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50/50 to-white" />
          <CardContent className="text-center py-16 relative z-10">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800 mb-2">
              Something went wrong
            </CardTitle>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              We encountered an issue loading the candidates section. Don't worry, this is usually temporary.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={this.handleRetry}
                className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="px-8 py-3 rounded-xl border-slate-200 hover:bg-slate-50"
              >
                Refresh Page
              </Button>
            </div>
            {this.state.error && (
              <details className="mt-6 text-xs text-slate-500">
                <summary className="cursor-pointer hover:text-slate-700">Technical Details</summary>
                <pre className="mt-2 p-4 bg-slate-100 rounded-lg text-left overflow-x-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}