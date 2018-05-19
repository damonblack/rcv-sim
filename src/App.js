//@flow
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import CssBaseline from '@material-ui/core/CssBaseline';
import Home from './components/Home';
import Vote from './components/vote/Vote';
import Monitor from './components/Monitor';
import './App.css';

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

type Props = {
  classes: Object
};

class App extends Component<Props> {
  render() {
    const { classes } = this.props;

    return (
      <div className="app">
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Welcome to the Ranked Choice Vote Runner
            </Typography>
          </Toolbar>
        </AppBar>

        <Route exact path={'/'} component={Home} />
        <Route path={'/vote/:key'} component={Vote} />
        <Route path={'/monitor/:key/round/:round'} component={Monitor} />
      </div>
    );
  }
}

export default withStyles(styles)(App);
