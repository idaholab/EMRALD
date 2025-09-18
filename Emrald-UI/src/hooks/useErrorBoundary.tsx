import { useState, useEffect } from 'react';

function useErrorBoundary() {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      if (event.message !== 'ResizeObserver loop completed with undelivered notifications.') {
        setHasError(true);
        setErrorMessage(event.message);
      }
    };

    window.addEventListener('error', handleWindowError);

    return () => {
      window.removeEventListener('error', handleWindowError);
    };
  }, []);

  return { hasError, errorMessage };
}

export default useErrorBoundary;
