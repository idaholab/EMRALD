import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface DialogComponentProps {
  open: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
  onSave: () => void;
  onClose: () => void;
}

const DialogComponent: React.FC<DialogComponentProps> = ({
  open,
  title,
  disabled,
  children,
  onSave,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onSave} variant="contained" disabled={disabled}>
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
