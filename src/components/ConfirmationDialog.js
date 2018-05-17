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
import FormControlLabel from '@material-ui/core/FormControlLabel';

class ConfirmationDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  state = {};

  // TODO
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.value !== this.props.value) {
  //     this.setState({ value: nextProps.value });
  //   }
  // }

  handleEntering = () => {
    console.log('entering!');
    //this.radioGroup.focus();
  };

  handleCancel = () => {
    this.props.onClose('cancelled');
    //this.props.onClose(this.props.value);
  };

  handleOk = () => {
    this.props.onClose('confirmed');
    //this.props.onClose(this.state.value);
  };

  // handleChange = (event, value) => {
  //   console.log('change', event, value);
  //   this.setState({ value });
  // };

  render() {
    const { ...other } = this.props;
    //const { value, ...other } = this.props;

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        onEntering={this.handleEntering}
        aria-labelledby="Confirmation-dialog-title"
        {...other}
      >
        <DialogTitle id="Confirmation-dialog-title">
          {this.props.title}
        </DialogTitle>
        <DialogContent>
          <p>{this.props.text}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
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

class ConfirmationDialogDemo extends React.Component {
  state = {
    confirmDeleteIsOpen: false
  };

  button = undefined;

  tempOpenDialogMethod = () => {
    this.setState({ confirmDeleteIsOpen: true });
  };

  handleConfirmDeleteResults = results => {
    console.log(results);
    this.setState({ results, confirmDeleteIsOpen: false });
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
          onClose={this.handleConfirmDeleteResults}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ConfirmationDialogDemo);
