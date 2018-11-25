import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import styles from '../styles/baseStyles';

import {
  Avatar,
  Button,
  ButtonBase,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';

import {
  InsertChart as ChartIcon,
  Done as VoteIcon,
  Cancel as LogoutIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';

class CreatePoll extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  render() {
    const { classes, elections } = this.props;

    return (
      <Grid container>
        <Grid item xs={0} sm={3} />
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h4"
            className={classes.sectionTitle}
            style={{ fontSize: '2rem', padding: '20px 0' }}
          >
            Create a Poll with Ranked Choice Voting
          </Typography>
          <Typography
            variant="h5"
            className={[classes.sectionTitle, classes.formTitle]}
          >
            Question
          </Typography>
          <TextField
            required
            id="question"
            value=""
            placeholder="What movie should we see Saturday Night?"
            margin="dense"
            variant="outlined"
            fullWidth
            InputProps={{
              classes: {
                input: classes.textField
              }
            }}
          />
          <Typography
            variant="h5"
            className={[classes.sectionTitle, classes.formTitle]}
          >
            Possible Answers
          </Typography>
          <TextField
            required
            id="option-one"
            value=""
            placeholder="Braveheart"
            margin="dense"
            variant="outlined"
            fullWidth
            InputProps={{
              classes: {
                input: classes.textField
              }
            }}
          />
          <TextField
            id="option-two"
            value=""
            placeholder="Fight Club"
            margin="dense"
            variant="outlined"
            fullWidth
            InputProps={{
              classes: {
                input: classes.textField
              }
            }}
          />
          <TextField
            id="option-three"
            value=""
            placeholder="V for Vendetta"
            margin="dense"
            variant="outlined"
            fullWidth
            InputProps={{
              classes: {
                input: classes.textField
              }
            }}
          />
          <TextField
            id="option-four"
            value=""
            placeholder="Pretty Woman"
            margin="dense"
            variant="outlined"
            fullWidth
            InputProps={{
              classes: {
                input: classes.textField
              }
            }}
          />
          <TextField
            id="option-five"
            value=""
            placeholder="Serenity"
            margin="dense"
            variant="outlined"
            fullWidth
            InputProps={{
              classes: {
                input: classes.textField
              }
            }}
          />
          <TextField
            id="option-six"
            value=""
            placeholder="Wonder Woman"
            margin="dense"
            variant="outlined"
            fullWidth
            InputProps={{
              classes: {
                input: classes.textField
              }
            }}
          />
          <div className={classes.buttonTray}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
            >
              Preview Ballot
            </Button>
          </div>
        </Grid>
      </Grid>
    );
  }
}

CreatePoll.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreatePoll);
