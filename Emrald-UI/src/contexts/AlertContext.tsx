import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface AlertContextType {
  showAlert: (message: string, severity?: 'error' | 'warning' | 'info' | 'success') => void;
  handleClose: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlertContext = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<{ id: string, message: string, severity: 'error' | 'warning' | 'info' | 'success' } | null>(null);

  const showAlert = (message: string, severity: 'error' | 'warning' | 'info' | 'success' = 'error') => {
    setAlert({ id: uuidv4(), message, severity });
  };

  const handleClose = () => {
    setAlert(null);
  };

  const contextValue: AlertContextType = {
    showAlert,
    handleClose,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {alert && (
        <Snackbar
          key={alert.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={handleClose}
          autoHideDuration={6000}
        >
          <Alert onClose={handleClose} severity={alert.severity} variant="filled" sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </AlertContext.Provider>
  );
};
