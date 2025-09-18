import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface DialogComponentProps {
  open: boolean;
  title?: string;
  disabled?: boolean;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
  onClose?: () => void;
}

const DialogComponent: React.FC<DialogComponentProps> = ({
  open,
  title,
  disabled,
  children,
  submitText,
  cancelText,
  onSubmit,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ p: 3 }}>
        {onSubmit && (
          <Button onClick={onSubmit} variant="contained" disabled={disabled}>
            {submitText ?? 'Save'}
          </Button>
        )}
        {onClose && (
          <Button onClick={onClose} variant="contained" color="secondary">
            {cancelText ?? 'Cancel'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
