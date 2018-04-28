import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Home from './components/Home';
import Vote from './components/Vote';
import Monitor from './components/Monitor';
import './App.css';


const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class App extends Component {

  render() {
    const { classes } = this.props;

    return (
      <div className="app">
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Welcome to the Ranked Choice Vote Runner
            </Typography>
          </Toolbar>
        </AppBar>

        <Route exact path={'/'} component={Home} />
        <Route path={'/vote/:key/'} component={Vote} />
        <Route path={'/monitor/:key/'} component={Monitor} />
      </div>
    );
  }
}

export default withStyles(styles)(App);
