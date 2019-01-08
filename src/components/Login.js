import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TextField, Grid } from '@material-ui/core';

import baseStyles from '../styles/baseStyles';

const styles = theme => baseStyles;

class Login extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      username: '',
      password: ''
    };
  }

  signup() {
    this.props.login();
  }

  handleChange = field => e => {
    const value = e.target.value;
    this.setState({ [field]: value });
  };

  render() {
    const { username, password } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <Grid container>
          <Grid item xs={0} sm={4} />
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h4"
              className={classes.sectionTitle}
              style={{
                fontSize: '2rem',
                padding: '20px 0',
                textAlign: 'center'
              }}
            >
              Create an Account
            </Typography>
            <Button fullWidth type="button" onClick={() => this.signup()}>
              Sign in with Google
            </Button>
            <Typography
              variant="h6"
              className={classes.sectionTitle}
              style={{
                fontSize: '1.5rem',
                padding: '20px 0',
                textAlign: 'center'
              }}
            >
              Or
            </Typography>
            <TextField
              required
              id="username"
              onChange={this.handleChange('username')}
              value={username}
              placeholder="democracy@rcv.org"
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
              required
              id="password"
              type="password"
              onChange={this.handleChange('password')}
              placeholder={'**********'}
              value={password}
              margin="dense"
              variant="outlined"
              fullWidth
              InputProps={{
                classes: {
                  input: classes.textField
                }
              }}
            />
            <Button fullWidth type="button">
              Create an Account
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
