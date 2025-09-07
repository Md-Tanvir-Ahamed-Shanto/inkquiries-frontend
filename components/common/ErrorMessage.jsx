import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <Alert variant="destructive" className={`mt-4 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorMessage;