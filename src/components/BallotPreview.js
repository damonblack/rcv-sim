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

import pdf from '../assets/candyElection_fake_doc.pdf';

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

class Vote extends Component<Props, State> {
  defaultState = {
    candidates: [],
    votes: {},
    lastAction: '',
    notifierOpen: false,
    user: auth.currentUser,
    copyErrMsg: '',
    copyStatus: ''
  };

  constructor(props: Props) {
    super(props);
    this.state = this.defaultState;
  }

  copyToClipboard() {
    try {
      const el = document.createElement('textarea');
      el.value = window.location.href;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
      this.setState({ copyErrMsg: 'Copied!', copyStatus: true });
      setTimeout(
        function() {
          this.setState({ copyStatus: '', copyErrMsg: '' });
        }.bind(this),
        3000
      );
    } catch (e) {
      this.setState({
        copyErrMsg: 'There was an error copying your ballot URL.',
        copyStatus: false
      });
      setTimeout(
        function() {
          this.setState({ copyStatus: '', copyErrMsg: '' });
        }.bind(this),
        3000
      );
    }
  }

  static rankName(number: number) {
    if (number === 1) return 'first';
    if (number === 2) return 'second';
    if (number === 3) return 'third';
    return number + 'th';
  }

  static actionText(
    candidateName: string,
    displacedName: string,
    position: number,
    previousPosition: number
  ): string {
    const replacing =
      displacedName === '' ? '' : `, replacing ${displacedName}`;
    const goFirstPlace = position === 1 ? ` Go ${candidateName}!` : '';

    if (!previousPosition)
      return `You've chosen ${candidateName} as your ${Vote.rankName(
        position
      )} choice${replacing}.${goFirstPlace}`;

    const verb = previousPosition > position ? 'promoting' : 'demoting';

    return `You've changed your vote for ${candidateName}, ${verb} them to your ${Vote.rankName(
      position
    )} choice${replacing}.`;
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

    const lastAction = Vote.actionText(
      candidateName,
      displacedName,
      position,
      previousPosition
    );

    this.setState({ votes, lastAction, notifierOpen: true });
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

  downloadBallot() {
    const { election } = this.state;
    if (election.title === 'Which of these candies is the best?') {
      return (
        <Grid direction="row" justify="flex-end" alignItems="center" container>
          <Grid item>
            <Grid
              direction="row"
              justify="flex-end"
              alignItems="center"
              container
              style={{ cursor: 'pointer' }}
            >
              <Grid item>
                <PrintIcon color="action" style={{ fontSize: '34px' }} />
              </Grid>
              <Grid item>
                <a
                  style={{
                    display: 'inline-block',
                    fontSize: '20px',
                    paddingLeft: '8px',
                    textDecoration: 'none',
                    color: 'rgba(0, 0, 0, 0.54)',
                    fontFamily: 'Montserrat'
                  }}
                  href={pdf}
                  target="_blank"
                >
                  Print Ballot
                </a>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

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
            <Typography variant="h3" className={classes.sectionTitle}>
              RCV Ballot Preview
            </Typography>
            <div className={classes.ballotContainer}>
              <div ref={el => (this.ballotRef = el)}>
                <div className={classes.titleContainer}>
                  <Typography
                    variant="h3"
                    align="center"
                    className={classes.title}
                  >
                    {election.title}
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
            {this.downloadBallot()}
            <Typography variant="h5" className={classes.sectionTitle}>
              Invite others to vote in your election
            </Typography>
            <Typography variant="h6">
              To hold your election, share a link to your ballot. Anyone with
              this link will be able to vote.
            </Typography>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                'margin-top': '20px',
                flexDirection: 'column'
              }}
            >
              <Button
                variant="raised"
                color="secondary"
                className={[classes.button, classes.buttonNarrow]}
                style={{ cursor: 'copy' }}
                fullWidth
                onClick={() => this.copyToClipboard()}
              >
                Get Link to Ballot
              </Button>
              <Typography style={{ marginTop: 10 }}>
                {this.state.copyErrMsg}
              </Typography>
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

export default withStyles(styles)(Vote);
