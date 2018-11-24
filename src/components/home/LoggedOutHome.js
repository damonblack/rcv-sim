import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 0
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  title: {
    flexGrow: 1,
    color: '#FFFFFF',
    letterSpacing: 1.8,
    padding: 15
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  bold: {
    fontWeight: 600
  },
  greyFont: {
    color: '#757575'
  },
  subtitle: {
    flex: 1,
    textAlign: 'center'
  }
});

const defaultState = {
  user: null,
  elections: [],
  creating: false,
  confirmDeleteIsOpen: false,
  confirmDeleteElectionKey: null
};

class LoggedOutHome extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Typography
          variant="h5"
          className={[classes.bold, classes.greyFont, classes.subtitle]}
        >
          Ranked Choice Voting: A voting method that allows voters to rank
          candidates in order of preference.
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography variant="h3">Create an RCV election</Typography>
            <Typography variant="h5">
              Choose a movie for a group or pick a restaurant.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            world
          </Grid>
        </Grid>
      </div>
    );
  }
}

LoggedOutHome.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoggedOutHome);
