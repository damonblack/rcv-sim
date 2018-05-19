//@flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {
  Typography,
  Chip,
  Avatar,
  Button,
  ButtonBase,
  Paper,
  Tooltip,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import {
  InsertChart as ChartIcon,
  Done as VoteIcon,
  Cancel as LogoutIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';

import {
  auth,
  googleAuth,
  myElectionsRef,
  votesRef,
  candidatesRef,
  electionRef
} from '../services';
import ElectionForm from './ElectionForm';
import ConfirmationDialog from './ConfirmationDialog';

const styles = theme => {
  return {
    avatarChip: { backgroundColor: theme.palette.primary.contrastText },
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    results: { minWidth: '60vw' },
    splitWrapper: { display: 'flex', justifyContent: 'space-between' },
    deleteIcon: { paddingLeft: '1em', paddingRight: '1em' },
    chartIcon: { fontSize: '2.5em', transform: 'rotate(90deg)' }
  };
};

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

class Home extends Component<Props, State> {
  defaultState = {
    user: null,
    elections: [],
    creating: false,
    confirmDeleteIsOpen: false,
    confirmDeleteElectionKey: null
  };

  constructor() {
    super();
    this.state = this.defaultState;
  }

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

  handleConfirmDeleteYes = () => {
    const key = this.state.confirmDeleteElectionKey;
    key && this.deleteMyElection(key);
    this.setState({
      confirmDeleteIsOpen: false,
      confirmDeleteElectionKey: null
    });
  };

  handleConfirmDeleteNo = () => {
    this.setState({
      confirmDeleteIsOpen: false,
      confirmDeleteElectionKey: null
    });
  };

  confirmElectionDelete = electionKey => {
    this.setState({
      confirmDeleteIsOpen: true,
      confirmDeleteElectionKey: electionKey
    });
  };

  deleteMyElection = electionKey => {
    votesRef(electionKey).remove();
    candidatesRef(electionKey).remove();
    electionRef(electionKey).remove();
  };

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

  login = async () => {
    try {
      const result = await auth.signInWithPopup(googleAuth);
      this.setState({ user: result.user });
      this.watchMyElections(result.user.uid);
    } catch (e) {
      console.log('LOGIN FAILED: ', e.stack);
      alert('login failed');
    }
  };

  logout = async () => {
    try {
      await auth.signOut();
      this.setState(this.defaultState);
    } catch (e) {
      console.log('LOGOUT FAILED: ', e);
      alert('logout failed');
    }
  };

  render() {
    const { user, elections, creating, confirmDeleteIsOpen } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.splitWrapper}>
          <div>
            {user ? (
              <Tooltip
                title={`Logged in with ${user.email}. Click 'x' to logout`}
              >
                <Chip
                  className={classes.avatarChip}
                  avatar={<Avatar src={user.photoURL} />}
                  deleteIcon={<LogoutIcon />}
                  label={user.displayName}
                  onDelete={this.logout}
                />
              </Tooltip>
            ) : (
              <Button onClick={this.login}>Log In</Button>
            )}
          </div>
          {user &&
            !creating && (
              <div>
                <Tooltip title="Create an Election">
                  <Button
                    variant="raised"
                    color="secondary"
                    onClick={() => this.setState({ creating: true })}
                  >
                    Create an Election
                  </Button>
                </Tooltip>
              </div>
            )}
        </div>
        <div className={classes.wrapper}>
          {user &&
            creating && (
              <ElectionForm
                user={user}
                onCancel={() => this.setState({ creating: false })}
              />
            )}
        </div>

        <div className={classes.wrapper}>
          {user &&
            !creating && (
              <div className={classes.results}>
                <Paper>
                  <Typography variant="title" align="center">
                    Elections
                  </Typography>
                  <List component="nav">
                    {elections.map((election, i) => (
                      <ListItem key={i} divider>
                        <Tooltip title="View Results">
                          <ButtonBase
                            component={Link}
                            to={`/monitor/${election.id}/round/1`}
                          >
                            <ChartIcon
                              className={classes.chartIcon}
                              color="primary"
                            />
                          </ButtonBase>
                        </Tooltip>
                        <ListItemText primary={election.title} />
                        <Tooltip title="Vote">
                          <Avatar component={Link} to={`/vote/${election.id}`}>
                            <VoteIcon color="action" />
                          </Avatar>
                        </Tooltip>
                        <Tooltip title="Delete Election Completely">
                          <ButtonBase
                            // onClick={() => this.deleteMyElection(election.id)}
                            onClick={() =>
                              this.confirmElectionDelete(election.id)
                            }
                          >
                            <DeleteIcon className={classes.deleteIcon} />
                          </ButtonBase>
                        </Tooltip>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </div>
            )}
        </div>
        {/* REVIEW: the demo code set classes.paper in a way I was copying incorrectly, getting errors from, was confused by, and punted on. defaults look OK . . . */}
        <ConfirmationDialog
          open={confirmDeleteIsOpen}
          title="Delete Election Completely?"
          text="You're about to delete this election completely, including all results. This can't be undone. Continue?"
          onConfirm={this.handleConfirmDeleteYes}
          onCancel={this.handleConfirmDeleteNo}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Home);
