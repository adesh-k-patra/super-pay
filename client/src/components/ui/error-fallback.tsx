import { Button } from './button';
import { Card } from './card';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
  showRetry?: boolean;
  showGoBack?: boolean;
  className?: string;
}

export function ErrorFallback({
  error,
  resetError,
  title = "Something went wrong",
  message,
  showRetry = true,
  showGoBack = true,
  className = ""
}: ErrorFallbackProps) {
  const defaultMessage = message || 
    "We encountered an unexpected error. Please try again or go back to the previous page.";

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Card className={`p-6 text-center space-y-4 ${className}`}>
      <div className="flex justify-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">
          {defaultMessage}
        </p>
        {error && process.env.NODE_ENV === 'development' && (
          <details className="mt-2 text-left">
            <summary className="cursor-pointer text-xs text-muted-foreground">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
              {error.stack || error.message}
            </pre>
          </details>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        {showRetry && resetError && (
          <Button 
            onClick={resetError}
            size="sm"
            data-testid="button-retry-error"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        
        {showGoBack && (
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            size="sm"
            data-testid="button-go-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        )}
      </div>
    </Card>
  );
}

// Specialized error fallbacks for different scenarios
export function NetworkErrorFallback({ resetError }: { resetError?: () => void }) {
  return (
    <ErrorFallback
      title="Connection Problem"
      message="Unable to connect to our servers. Please check your internet connection and try again."
      resetError={resetError}
      showGoBack={false}
    />
  );
}

export function NotFoundErrorFallback() {
  return (
    <ErrorFallback
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      showRetry={false}
    />
  );
}

export function UnauthorizedErrorFallback() {
  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <Card className="p-6 text-center space-y-4">
      <div className="flex justify-center">
        <AlertCircle className="h-10 w-10 text-yellow-500" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Authentication Required</h3>
        <p className="text-muted-foreground text-sm">
          You need to be logged in to access this page.
        </p>
      </div>

      <Button onClick={handleLogin} data-testid="button-login">
        Go to Login
      </Button>
    </Card>
  );
}