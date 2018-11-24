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

import { Route } from 'react-router-dom';

import Home from './components/Home';
import Vote from './components/vote/Vote';
import Monitor from './components/Monitor';

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

class ButtonAppBar extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  handleDrawer = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon onClick={this.handleDrawer} />
            </IconButton>
            <Typography variant="h2" className={classes.title}>
              <span className={classes.boldLogo}>RCV</span>Tally
            </Typography>
          </Toolbar>
        </AppBar>
        <Route path={'/vote/:key'} component={Vote} />
        <Route path={'/monitor/:key/round/:round'} component={Monitor} />

        <Drawer
          className={styles.drawer}
          open={this.state.open}
          onClose={this.handleDrawer}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <Route exact path={'/'} component={Home} />
        </Drawer>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
