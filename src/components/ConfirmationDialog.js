//@flow
import React from 'react';
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core';

type Props = {
  open: boolean,
  title: string,
  text: string,
  onCancel: () => void,
  cancelButtonText: string,
  onConfirm: () => void,
  confirmButtonText: string
};

const ConfirmationDialog = (props: Props) => {
  const {
    open,
    title,
    text,
    onCancel,
    cancelButtonText,
    onConfirm,
    confirmButtonText
  } = props;

  return (
    <Dialog disableBackdropClick disableEscapeKeyDown maxWidth="xs" open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{text}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} style={{ color: 'red' }}>
          {confirmButtonText}
        </Button>
        <Button onClick={onCancel}>{cancelButtonText}</Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.defaultProps = {
  title: 'Confirm Action',
  text: 'To confirm your action, click Ok. To cancel, click Cancel.',
  cancelButtonText: 'Cancel',
  confirmButtonText: 'Ok',
  onConfirm: () => {},
  onCancel: () => {}
};

export default ConfirmationDialog;
