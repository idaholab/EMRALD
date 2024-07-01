import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { SxProps } from '@mui/material';

interface DialogComponentProps {
  open: boolean;
  title?: string;
  disabled?: boolean;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
  onClose?: () => void;
  sx?: SxProps;
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
  sx,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {title && <DialogTitle sx={{ ...sx }}>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ ...sx, p: 3 }}>
        {onClose && <Button onClick={onClose}>{cancelText ? cancelText : 'Cancel'}</Button>}
        {onSubmit && (
          <Button onClick={onSubmit} variant="contained" disabled={disabled}>
            {submitText ? submitText : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
