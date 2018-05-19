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

import { auth, googleAuth, myElectionsRef } from '../services';
import ElectionForm from './ElectionForm';
import Vote from './Vote';
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
  confirmDeleteElectionKey: string
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
    this.deleteMyElection(this.state.confirmDeleteElectionKey);
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

  // REVIEW: I'm not thrilled about setting state here and trusting it has stayed unchanged through to handleConfirmDeleteYes().
  //  if all the pieces do what they're supposed to we'll never have an issue . . . but yes, a promise/closure would suit me better.
  //  perhaps there's a way to do this with the MUI Dialog base, but for today I just wanted to get what I started finally working.
  //  (for a while, I was passing in a reference to confirmDeleteElectionKey as part of the dialog properties, similar to confirmDeleteIsOpen but that seemed pointless and I removed.)
  confirmElectionDelete = electionKey => {
    this.setState({
      confirmDeleteIsOpen: true,
      confirmDeleteElectionKey: electionKey
    });
  };

  deleteMyElection = electionKey => {
    // REVIEW: do we really want to use Vote...Ref here? I would guess we want to move votesRef etc into /services/index.js as a single common reference.
    // REVIEW: do we need error handling? we need to have a useful thing to do in case of error, and I'm not sure what that is.
    // in firebase, transactions only operate within a node, afaik we can't txn these at all. (firestore is different)
    Vote.votesRef(electionKey).remove();
    Vote.candidatesRef(electionKey).remove();
    Vote.electionRef(electionKey).remove();

    // watchMyElections handles the state updates for us.
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
    const { user, elections, creating } = this.state;
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
          title="Delete Election Completely?"
          text="You're about to delete this election completely, including all results. This can't be undone. Continue?"
          open={this.state.confirmDeleteIsOpen}
          onConfirm={this.handleConfirmDeleteYes}
          onCancel={this.handleConfirmDeleteNo}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Home);
