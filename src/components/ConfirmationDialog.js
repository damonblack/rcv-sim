import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core';

class ConfirmationDialog extends React.Component {
  // REVIEW: "open" must reference mutable state in caller. there is no sensible default. how best to handle if it's missing?
  static defaultProps = {
    title: 'Confirm Action',
    text: 'To confirm your action, click Ok. To cancel, click Cancel.',
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Ok',
    onConfirm: cc => {},
    onCancel: cc => {}
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  handleConfirm = () => {
    this.props.onConfirm();
  };

  render() {
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        open={this.props.open}
        classes={this.props.classes}
      >
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          <Typography>{this.props.text}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            {this.props.cancelButtonText}
          </Button>
          <Button onClick={this.handleConfirm} color="primary">
            {this.props.confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmationDialog;
