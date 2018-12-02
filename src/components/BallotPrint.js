//@flow
import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/index';
import {
  Avatar,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
  Grid,
  Button
} from '@material-ui/core';
import {
  Home as HomeIcon,
  InsertChart as ChartIcon,
  Close as CloseIcon,
  Print as PrintIcon
} from '@material-ui/icons';
import ReactToPrint from 'react-to-print';

import { auth, electionRef, candidatesRef, votesRef } from '../services';
import type { Election } from '../lib/voteTypes';
import LegacyBallot from './vote/LegacyBallot';

const styles = {
  container: {
    width: '80%',
    margin: '0 auto',
    marginBottom: 80,
    marginTop: 80
  },
  wrapper: {
    display: 'flex'
  },
  navButton: {
    display: 'flex',
    justifyContent: 'center',
    width: '10vw',
    maxWidth: '80px'
  },
  ballotContainer: {
    backgroundColor: '#fff',
    border: '3px solid #000',
    marginTop: 20
  },
  title: {
    flexGrow: 1,
    color: '#272361',
    fontWeight: 800
  },
  titleContainer: {
    borderBottom: '1px solid #000',
    paddingTop: 40,
    paddingBottom: 40
  },
  instructionsContainer: {
    borderBottom: '1px solid #000',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25
  },
  sectionTitle: {
    color: '#272361',
    fontWeight: 800
  },
  button: {
    fontWeight: 800,
    fontSize: 23,
    padding: 15,
    textTransform: 'capitalize'
  },
  buttonNarrow: {
    width: '25%'
  },
  printContainer: {
    paddingLeft: 40,
    paddingRight: 40
  }
};

type Props = {
  classes: Object,
  match: {
    params: {
      key: string
    }
  }
};
type State = {
  election?: Election,
  votes: Object,
  lastAction: string,
  notifierOpen: boolean,
  candidates: Array<{ id: string, name: string }>,
  user: ?Object
};

class BallotPrint extends Component<Props, State> {
  defaultState = {
    candidates: [],
    votes: {},
    lastAction: '',
    notifierOpen: false,
    user: auth.currentUser,
    copyErrMsg: '',
    copyStatus: '',
    printing: false
  };

  constructor(props: Props) {
    super(props);
    this.state = this.defaultState;
  }

  static rankName(number: number) {
    if (number === 1) return 'first';
    if (number === 2) return 'second';
    if (number === 3) return 'third';
    return number + 'th';
  }

  updateUser = user => {
    user ? this.setState({ user }) : this.setState(this.defaultState);
  };

  updateElection = electionKey => snapshot => {
    const election = snapshot.val();
    election.key = electionKey;
    this.setState({ election: election });
  };

  updateCandidate = snapshot => {
    const candidatesVal = snapshot.val();
    const candidates = Object.keys(candidatesVal).map(key => ({
      id: key,
      name: candidatesVal[key].name
    }));
    this.setState({ candidates });
  };

  componentDidMount() {
    auth.onAuthStateChanged(this.updateUser);
    const electionKey = this.props.match.params.key;
    electionRef(electionKey).on('value', this.updateElection(electionKey));
    candidatesRef(electionKey).on('value', this.updateCandidate);
  }

  componentWillUnmount() {
    const electionKey = this.props.match.params.key;
    electionRef(electionKey).off('value', this.updateElection(electionKey));
    candidatesRef(electionKey).off('value', this.updateCandidate);
  }

  updateVote = (candidateId: string, position: number) => {
    if (this.state.votes[position] === candidateId) return;
    const votes = Object.assign({}, this.state.votes);

    const candidateName = this.state.candidates.filter(
      c => c.id === candidateId
    )[0].name;
    const displacedName = votes[position]
      ? this.state.candidates.filter(c => c.id === votes[position])[0].name
      : '';

    let previousPosition = 0;
    Object.keys(votes).forEach(key => {
      if (votes[key] === candidateId) {
        previousPosition = key;
        votes[key] = null;
      }
    });
    votes[position] = candidateId;

    this.setState({ votes, notifierOpen: true });
  };

  submitVote = () => {
    const electionKey = this.props.match.params.key;
    votesRef(electionKey).push(this.state.votes);
    localStorage.setItem('RCV' + electionKey, JSON.stringify(this.state.votes));
    this.setState({ votes: {} });
  };

  closeNotifier = () => this.setState({ notifierOpen: false });

  userIsElectionOwner = () => {
    return (
      this.state.user &&
      this.state.election &&
      this.state.user.uid === this.state.election.owner
    );
  };

  loaded = () => this.state.election && this.state.candidates;

  render() {
    const {
      election,
      candidates,
      notifierOpen,
      lastAction,
      votes,
      printing
    } = this.state;
    const {
      classes,
      match: {
        params: { key }
      }
    } = this.props;

    if (this.loaded()) {
      if (!localStorage.getItem('RCV' + key) || this.userIsElectionOwner()) {
        return (
          <div className={classes.container}>
            <div
              className={classes.ballotContainer}
              ref={el => (this.ballotRef = el)}
            >
              <div>
                <div className={classes.titleContainer}>
                  <Typography
                    variant="h3"
                    align="center"
                    className={classes.title}
                  >
                    {election.title}
                  </Typography>
                </div>
                <div className={classes.instructionsContainer}>
                  <Typography variant="h5" className={classes.title}>
                    How to Vote
                  </Typography>
                  <Typography variant="title">
                    A. To vote, fill in the oval to the right of the candidate
                    of your choice completely.
                  </Typography>
                  <Typography variant="title">
                    B. If you wrongly mark, tear or spoil the ballot, return the
                    damaged ballot and get a replacement.
                  </Typography>
                  <Typography variant="title">
                    C. Mark no more than one oval per candidate / choice.
                  </Typography>
                  <Typography variant="title">
                    D. Mark no more than one oval per column.
                  </Typography>
                </div>
                <div className={classes.wrapper}>
                  <LegacyBallot
                    preview
                    election={election}
                    candidates={candidates}
                    votes={votes}
                    lastAction={lastAction}
                    notifierOpen={notifierOpen}
                    updateVote={this.updateVote}
                    submitVote={this.submitVote}
                    closeNotifier={this.closeNotifier}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                'margin-top': '20px',
                flexDirection: 'column'
              }}
            >
              <ReactToPrint
                trigger={() => (
                  <Button
                    variant="raised"
                    color="secondary"
                    className={[classes.button, classes.buttonNarrow]}
                    fullWidth
                  >
                    Print Ballot
                  </Button>
                )}
                content={() => this.ballotRef}
                bodyClass={classes.printContainer}
              />
            </div>
          </div>
        );
      } else {
        return <Redirect to={`/monitor/${key}/round/1`} />;
      }
    } else {
      return 'Loading ...';
    }
  }
}

export default withStyles(styles)(BallotPrint);
