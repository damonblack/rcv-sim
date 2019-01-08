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

import {
  Route,
  BrowserRouter,
  Switch,
  Link,
  withRouter
} from 'react-router-dom';

import NewHome from './components/NewHome';
import Vote from './components/vote/Vote';
import Monitor from './components/Monitor';
import CreatePoll from './components/CreatePoll';
import BallotPreview from './components/BallotPreview';
import BallotPrint from './components/BallotPrint';
import Login from './components/Login';

import './index.css';

import {
  auth,
  googleAuth,
  myElectionsRef,
  votesRef,
  candidatesRef,
  electionRef
} from './services';

const styles = theme => ({});

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

  googleLogin = async props => {
    try {
      const result = await auth.signInWithPopup(googleAuth);
      this.setState({ user: result.user });
      this.watchMyElections(result.user.uid);
      this.props.history.push('/');
    } catch (e) {
      console.log(e);
      alert('login failed');
    }
  };

  login() {
    this.props.history.push('/login');
  }

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
      <div>
        <CssBaseline />
        <AppBar position="static" className={'appBar'}>
          <Toolbar>
            <IconButton
              className={'menuButton'}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon onClick={this.handleDrawer} />
            </IconButton>

            <Typography variant="h2" className={'headerTitle'}>
              <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                <span className={'boldLogo'}>RCV</span>Tally
              </Link>
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
        <Route
          exact
          path={'/login'}
          render={props => <Login login={() => this.googleLogin(props)} />}
        />
        <Route path={'/vote/:key'} component={Vote} />
        <Route path={'/preview/:key'} component={BallotPreview} />
        <Route path={'/print/:key'} component={BallotPrint} />
        <Route path={'/monitor/:key/round/:round'} component={Monitor} />

        <Drawer
          className={'drawer'}
          open={this.state.open}
          onClose={this.handleDrawer}
          classes={{
            paper: 'drawerPaper'
          }}
        >
          <p>test</p>
        </Drawer>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(ButtonAppBar));
