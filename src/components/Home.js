import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import List, { ListItem, ListItemText } from 'material-ui/List';
import {
  Typography,
  Chip,
  Avatar,
  Button,
  ButtonBase,
  Paper,
  TextField,
  Divider,
  Tooltip
} from 'material-ui';
import {
  InsertChart as ChartIcon,
  Done as VoteIcon,
  Cancel as LogoutIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';

import { auth, googleAuth, database } from '../services';

const styles = theme => {
  return {
    avatarChip: { backgroundColor: theme.palette.primary.contrastText },
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    splitWrapper: { display: 'flex', justifyContent: 'space-between' },
    results: { width: '400px', minWidth: '30%' },
    chartIcon: { fontSize: '2.5em' },
    candidateEntry: { display: 'flex', justifyContent: 'space-between' }
  };
};

class Home extends Component {
  defaultState = {
    userName: '',
    user: null,
    elections: [],
    creating: false,
    electionTitle: '',
    candidates: ['', '', '']
  };

  constructor() {
    super();
    this.state = this.defaultState;
  }

  static myElectionsRef(uid) {
    return database
      .ref('elections')
      .orderByChild('owner')
      .equalTo(uid);
  }

  static allElectionsRef() {
    return database.ref('elections');
  }

  static candidatesForElectionRef(electionKey) {
    return database.ref(`candidates/${electionKey}`);
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

  watchMyElections = uid => {
    Home.myElectionsRef(uid).on('value', snapshot => {
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
      console.log('LOGIN FAILED: ', e);
      alert('logout failed');
    }
  };

  handleChange = field => e => {
    const value = e.target.value;
    this.setState({ [field]: value });
  };

  handleChangeCandidate = index => e => {
    const value = e.target.value;
    const candidates = this.state.candidates.slice(0);
    candidates[index] = value;
    this.setState({ candidates });
  };

  addCandidate = () => {
    this.setState({ candidates: [...this.state.candidates, ''] });
  };

  removeCandidate = i => {
    const candidates = this.state.candidates.slice(0);
    candidates.splice(i, 1);

    this.setState({ candidates });
  };

  handleSubmit = () => {
    const electionKey = Home.allElectionsRef().push({
      title: this.state.electionTitle,
      owner: this.state.user.uid,
      created: Date.now()
    }).key;
    const candidateDB = Home.candidatesForElectionRef(electionKey);
    this.state.candidates.forEach(candidate => {
      const candidateEntry = {
        name: candidate,
        owner: this.state.user.uid
      };
      candidateDB.push(candidateEntry);
    });

    this.setState({ creating: false, electionTitle: '', candidates: ['', ''] });
  };

  render() {
    const { user, elections, candidates, electionTitle, creating } = this.state;
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
              <div className={classes.results}>
                <form onSubmit={this.handleSubmit}>
                  <Paper elevation={5}>
                    <TextField
                      key={1}
                      placeholder="My Election Name"
                      label="Name your election"
                      value={electionTitle}
                      onChange={this.handleChange('electionTitle')}
                      fullWidth
                    />
                    <Divider />
                    <Divider />
                    {candidates.map((candidate, i) => (
                      <div key={i + 1} className={classes.candidateEntry}>
                        <TextField
                          label={`Candidate ${i + 1}`}
                          value={candidate}
                          onChange={this.handleChangeCandidate(i)}
                          fullWidth
                        />
                        <ButtonBase onClick={() => this.removeCandidate(i)}>
                          <DeleteIcon />
                        </ButtonBase>
                        <Divider />
                      </div>
                    ))}
                    <Button type="button" onClick={this.addCandidate}>
                      Add
                    </Button>
                    <Button type="submit">Submit</Button>
                    <Button
                      type="button"
                      onClick={() =>
                        this.setState({
                          creating: false,
                          candidates: ['', '', '']
                        })
                      }
                    >
                      Cancel
                    </Button>
                  </Paper>
                </form>
              </div>
            )}
        </div>

        <div className={classes.wrapper}>
          {user &&
            !creating && (
              <div className={classes.results}>
                <Paper>
                  <Typography>Elections</Typography>
                  <List component="nav">
                    {elections.map((election, i) => (
                      <ListItem key={i} button>
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
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
