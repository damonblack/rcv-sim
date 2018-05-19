import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

class ConfirmationDialog extends React.Component {
  // "open" and probably "openContext" must reference mutable state in caller. there are no sensible defaults. how best to handle if they're missing?
  static defaultProps = {
    title: 'Confirm Action',
    text: 'To confirm your action, click Ok. To cancel, click Cancel.',
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Ok',
    onConfirm: cc => {},
    onCancel: cc => {}
  };

  handleCancel = () => {
    this.props.onCancel(this.props.openContext);
  };

  handleConfirm = () => {
    this.props.onConfirm(this.props.openContext);
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

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  dialog: {
    width: '80%',
    maxHeight: 435
  }
});

//export default withStyles(styles)(ConfirmationDialog);

class ConfirmationDialogDemo extends React.Component {
  state = {
    confirmDeleteIsOpen: false,
    confirmDeleteContext: 0
  };

  button = undefined;

  tempOpenDialogMethod = () => {
    const newContext = this.state.confirmDeleteContext + 1;
    this.setState({
      confirmDeleteIsOpen: true,
      confirmDeleteContext: newContext
    });
  };

  handleConfirmDeleteYes = results => {
    console.log('yes', results);
    this.setState({ confirmDeleteIsOpen: false });
  };

  handleConfirmDeleteNo = results => {
    console.log('no', results);
    this.setState({ confirmDeleteIsOpen: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <List>
          <ListItem
            button
            divider
            aria-haspopup="true"
            onClick={this.tempOpenDialogMethod}
          >
            <ListItemText primary="Later, this will be triggered by event instead of listitem click." />
          </ListItem>
        </List>
        <ConfirmationDialog
          classes={{
            paper: classes.dialog
          }}
          title="Ride With Toonces?"
          text="You're about to drive off a cliff to your death. Continue?"
          open={this.state.confirmDeleteIsOpen}
          openContext={this.state.confirmDeleteContext}
          onConfirm={this.handleConfirmDeleteYes}
          onCancel={this.handleConfirmDeleteNo}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ConfirmationDialogDemo);
