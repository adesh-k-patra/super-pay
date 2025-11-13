import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface ErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

export function useErrorRecovery(options: ErrorRecoveryOptions = {}) {
  const { maxRetries = 3, retryDelay = 1000, onError, onSuccess } = options;
  const { toast } = useToast();
  
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);

  const executeWithRecovery = useCallback(async (
    operation: () => Promise<any>,
    customErrorMessage?: string
  ) => {
    try {
      setIsRetrying(true);
      const result = await operation();
      
      // Reset on success
      setRetryCount(0);
      setLastError(null);
      onSuccess?.();
      
      return result;
    } catch (error) {
      const err = error as Error;
      setLastError(err);
      onError?.(err);
      
      // Show user-friendly error message
      const message = customErrorMessage || getErrorMessage(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
      
      throw err;
    } finally {
      setIsRetrying(false);
    }
  }, [onError, onSuccess, toast]);

  const retry = useCallback(async (operation: () => Promise<any>) => {
    if (retryCount >= maxRetries) {
      toast({
        variant: "destructive",
        title: "Maximum retries reached",
        description: "Please try again later or contact support if the problem persists.",
      });
      return;
    }

    setRetryCount(prev => prev + 1);
    
    // Add delay before retry
    if (retryDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }

    return executeWithRecovery(operation);
  }, [retryCount, maxRetries, retryDelay, executeWithRecovery, toast]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setLastError(null);
    setIsRetrying(false);
  }, []);

  return {
    executeWithRecovery,
    retry,
    reset,
    isRetrying,
    retryCount,
    lastError,
    canRetry: retryCount < maxRetries,
  };
}

// Helper function to get user-friendly error messages
function getErrorMessage(error: Error): string {
  // Network errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return 'Connection problem. Please check your internet and try again.';
  }
  
  // Authentication errors
  if (error.message.includes('401') || error.message.includes('unauthorized')) {
    return 'Please log in to continue.';
  }
  
  // Permission errors
  if (error.message.includes('403') || error.message.includes('forbidden')) {
    return 'You don\'t have permission to perform this action.';
  }
  
  // Not found errors
  if (error.message.includes('404') || error.message.includes('not found')) {
    return 'The requested resource was not found.';
  }
  
  // Server errors
  if (error.message.includes('500') || error.message.includes('server')) {
    return 'Server error. Please try again later.';
  }
  
  // Rate limiting
  if (error.message.includes('429') || error.message.includes('too many')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  // Validation errors
  if (error.message.includes('validation') || error.message.includes('invalid')) {
    return 'Please check your input and try again.';
  }
  
  // Default fallback
  return 'Something went wrong. Please try again.';
}