import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import {
  AppBar,
  Avatar,
  Button,
  ButtonBase,
  Chip,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  Typography
} from '@material-ui/core';

import LoggedOutHome from './home/LoggedOutHome';
import LoggedInHome from './home/LoggedInHome';

import { Route } from 'react-router-dom';

import styles from '../styles/baseStyles';

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
    const { classes, user, login, elections } = this.props;

    return (
      <div>
        {user ? (
          <LoggedInHome user={user} elections={elections} />
        ) : (
          <LoggedOutHome login={login} />
        )}
      </div>
    );
  }
}

NewHome.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewHome);
