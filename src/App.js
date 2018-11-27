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

import { Route, BrowserRouter, Switch } from 'react-router-dom';

import NewHome from './components/NewHome';
import Vote from './components/vote/Vote';
import Monitor from './components/Monitor';
import CreatePoll from './components/CreatePoll';

import {
  auth,
  googleAuth,
  myElectionsRef,
  votesRef,
  candidatesRef,
  electionRef
} from './services';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 0,
    backgroundColor: 'transparent'
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

type Props = {
  classes: Object
};

type State = {
  user: ?{ uid: string, displayName: string, photoURL: string, email: string },
  elections: Array<Object>,
  creating: boolean,
  confirmDeleteIsOpen: boolean,
  confirmDeleteElectionKey: ?string
};

const defaultState = {
  user: null,
  elections: [],
  creating: false,
  confirmDeleteIsOpen: false,
  confirmDeleteElectionKey: null
};

class ButtonAppBar extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      elections: []
    };
  }

  watchMyElections = uid => {
    myElectionsRef(uid).on('value', snapshot => {
      const electionsVal = snapshot.val();
      let elections = [];
      if (electionsVal && this.state.user) {
        elections = Object.keys(electionsVal).map(key => {
          return { id: key, title: electionsVal[key].title };
        });
      }
      this.setState({ elections });
    });
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        this.watchMyElections(user.uid);
      } else {
        this.setState(this.defaultState);
      }
    });
  }

  handleDrawer = () => {
    this.setState({ open: !this.state.open });
  };

  login = async () => {
    try {
      const result = await auth.signInWithPopup(googleAuth);
      this.setState({ user: result.user });
      this.watchMyElections(result.user.uid);
    } catch (e) {
      alert('login failed');
    }
  };

  logout = async () => {
    try {
      await auth.signOut();
      this.setState(this.defaultState);
    } catch (e) {
      alert('logout failed');
    }
  };

  render() {
    const { classes } = this.props;

    const { user, elections } = this.state;

    return (
      <BrowserRouter>
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
              {user ? (
                <Button color="inherit" onClick={() => this.logout()}>
                  Sign Out
                </Button>
              ) : (
                <Button color="inherit" onClick={() => this.login()}>
                  Sign In
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <Route
            exact
            path={'/'}
            render={props => (
              <NewHome user={user} login={this.login} elections={elections} />
            )}
          />
          <Route
            exact
            path={'/create'}
            render={props => <CreatePoll user={user} />}
          />
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
            <p>test</p>
          </Drawer>
        </div>
      </BrowserRouter>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
