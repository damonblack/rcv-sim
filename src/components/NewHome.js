import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';

import LoggedOutHome from './home/LoggedOutHome';

import { Route } from 'react-router-dom';

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
  boldLogo: {
    fontWeight: 800
  },
  drawer: {
    width: 250,
    flexShrink: 0
  },
  drawerPaper: {
    width: 250
  }
});

const defaultState = {
  user: null,
  elections: [],
  creating: false,
  confirmDeleteIsOpen: false,
  confirmDeleteElectionKey: null
};

class NewHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    const { classes, user } = this.props;
    return <LoggedOutHome />;
  }
}

NewHome.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewHome);
