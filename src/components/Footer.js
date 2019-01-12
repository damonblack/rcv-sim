//@flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  TextField,
  Button,
  ButtonBase,
  Divider,
  InputAdornment,
  Grid,
  Typography
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  DeleteSweep as DeleteSweepIcon
} from '@material-ui/icons';

import { withRouter } from 'react-router-dom';

import styles from '../styles/baseStyles';

class Footer extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div class="footerBody">
        <h4>
          <a target="_blank" href="https://goo.gl/forms/KHiHVaNh302TUZIG2">
            Provide Feedback
          </a>
        </h4>
        <p>
          Built by{' '}
          <a target="_blank" href="https://rcvforcolorado.org/">
            RCV for Colorado
          </a>
        </p>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Footer));
