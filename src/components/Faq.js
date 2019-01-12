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
      <div style={{ padding: '20px' }}>
        <Typography
          variant="h3"
          className={'title'}
          style={{ 'padding-top': '30px' }}
        >
          FAQ
        </Typography>
        <div class="faq-question-container">
          <Typography variant="h5" className={'sectionTitle'}>
            RCV Saves Money
          </Typography>
          <Typography variant="h6" className={'sectionText'}>
            Runoffs are avoided since voters have already selected a second
            choice.
          </Typography>
        </div>
        <div class="faq-question-container">
          <Typography variant="h5" className={'sectionTitle'}>
            RCV Saves Money
          </Typography>
          <Typography variant="h6" className={'sectionText'}>
            Runoffs are avoided since voters have already selected a second
            choice.
          </Typography>
        </div>
        <div class="faq-question-container">
          <Typography variant="h5" className={'sectionTitle'}>
            RCV Saves Money
          </Typography>
          <Typography variant="h6" className={'sectionText'}>
            Runoffs are avoided since voters have already selected a second
            choice.
          </Typography>
        </div>
        <div class="faq-question-container">
          <Typography variant="h5" className={'sectionTitle'}>
            RCV Saves Money
          </Typography>
          <Typography variant="h6" className={'sectionText'}>
            Runoffs are avoided since voters have already selected a second
            choice.
          </Typography>
        </div>
        <div class="faq-question-container">
          <Typography variant="h5" className={'sectionTitle'}>
            RCV Saves Money
          </Typography>
          <Typography variant="h6" className={'sectionText'}>
            Runoffs are avoided since voters have already selected a second
            choice.
          </Typography>
        </div>
        <div class="faq-question-container">
          <Typography variant="h5" className={'sectionTitle'}>
            RCV Saves Money
          </Typography>
          <Typography variant="h6" className={'sectionText'}>
            Runoffs are avoided since voters have already selected a second
            choice.
          </Typography>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Footer));
