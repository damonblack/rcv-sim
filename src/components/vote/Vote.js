// @flow
import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {IconButton, Snackbar, Typography, withStyles} from '@material-ui/core';
import {Close as CloseIcon} from '@material-ui/icons';

import {auth, electionRef, candidatesRef, votesRef} from '../../services';
import type {Election} from '../../lib/voteTypes';
import LegacyBallot from './LegacyBallot';

const styles = {
  container: {
    width: '80%',
    margin: '0 auto',
    marginBottom: 80,
  },
  wrapper: {
    display: 'flex',
  },
  navButton: {
    display: 'flex',
    justifyContent: 'center',
    width: '10vw',
    maxWidth: '80px',
  },
  ballotContainer: {
    backgroundColor: '#fff',
    border: '3px solid #000',
    marginTop: 80,
  },
  title: {
    flexGrow: 1,
    color: '#272361',
    fontWeight: 800,
  },
  titleContainer: {
    borderBottom: '1px solid #000',
    paddingTop: 40,
    paddingBottom: 40,
  },
};

type Props = {
  classes: Object,
  match: {
    params: {
      key: string,
    },
  },
};
type State = {
  election?: Election,
  votes: Object,
  lastAction: string,
  notifierOpen: boolean,
  candidates: Array<{id: string, name: string}>,
  user: ?Object,
};

class Vote extends Component<Props, State> {
  static rankName(number: number) {
    if (number === 1) return 'first';
    if (number === 2) return 'second';
    if (number === 3) return 'third';
    return `${number}th`;
  }

  static actionText(
    candidateName: string,
    displacedName: string,
    position: number,
    previousPosition: number,
  ): string {
    const replacing =
      displacedName === '' ? '' : `, replacing ${displacedName}`;
    const goFirstPlace = position === 1 ? ` Go ${candidateName}!` : '';

    if (!previousPosition)
      return `You've chosen ${candidateName} as your ${Vote.rankName(
        position,
      )} choice${replacing}.${goFirstPlace}`;

    const verb = previousPosition > position ? 'promoting' : 'demoting';

    return `You've changed your vote for ${candidateName}, ${verb} them to your ${Vote.rankName(
      position,
    )} choice${replacing}.`;
  }

  defaultState = {
    candidates: [],
    votes: {},
    lastAction: '',
    notifierOpen: false,
    user: auth.currentUser,
  };

  constructor(props: Props) {
    super(props);
    this.state = this.defaultState;
  }

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

  updateUser = (user) => {
    if (user) {
      this.setState({user});
    } else {
      this.setState(this.defaultState);
    }
  };

  updateElection = (electionKey) => (snapshot) => {
    const election = snapshot.val();
    election.key = electionKey;
    this.setState({election});
  };

  updateCandidate = (snapshot) => {
    const candidatesVal = snapshot.val();
    const candidates = Object.keys(candidatesVal).map((key) => ({
      id: key,
      name: candidatesVal[key].name,
    }));
    this.setState({candidates});
  };

  updateVote = (candidateId, position) => {
    this.setState(({votes: oldVotes}) => {
      if (oldVotes[position] !== candidateId) {
        const votes = Object.assign({}, oldVotes);

        const candidateName = this.state.candidates.filter(
          (c) => c.id === candidateId,
        )[0].name;
        const displacedName = votes[position]
          ? this.state.candidates.filter((c) => c.id === votes[position])[0]
              .name
          : '';

        let previousPosition = 0;
        Object.keys(votes).forEach((key) => {
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
          previousPosition,
        );
        return {votes, lastAction, notifierOpen: true};
      }
      return {};
    });
  };

  submitVote = () => {
    const electionKey = this.props.match.params.key;
    votesRef(electionKey).push(this.state.votes);
    window.localStorage.setItem(
      `RCV${electionKey}`,
      JSON.stringify(this.state.votes),
    );
    this.setState({votes: {}});
  };

  closeNotifier = () => this.setState({notifierOpen: false});

  userIsElectionOwner = () => {
    return (
      this.state.user &&
      this.state.election &&
      this.state.user.uid === this.state.election.owner
    );
  };

  loaded = () => this.state.election && this.state.candidates;

  render() {
    const {election, candidates, notifierOpen, lastAction, votes} = this.state;
    const {
      classes,
      match: {
        params: {key},
      },
    } = this.props;

    if (this.loaded()) {
      if (
        !window.localStorage.getItem(`RCV${key}`) ||
        this.userIsElectionOwner()
      ) {
        return (
          <div className={classes.container}>
            <div className={classes.ballotContainer}>
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
                  election={election}
                  candidates={candidates}
                  votes={votes}
                  lastAction={lastAction}
                  notifierOpen={notifierOpen}
                  updateVote={this.updateVote}
                  submitVote={this.submitVote}
                  closeNotifier={this.closeNotifier}
                  ref={(el) => (this.ballotRef = el)}
                />
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  open={notifierOpen}
                  autoHideDuration={4000}
                  onClose={this.closeNotifier}
                  SnackbarContentProps={{
                    'aria-describedby': 'message-id',
                  }}
                  message={<span id="message-id">{lastAction}</span>}
                  action={[
                    <IconButton
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      className={classes.close}
                      onClick={this.closeNotifier}
                    >
                      <CloseIcon />
                    </IconButton>,
                  ]}
                />
              </div>
            </div>
          </div>
        );
      }
      return <Redirect to={`/monitor/${key}/round/1`} />;
    }
    return 'Loading ...';
  }
}

export default withStyles(styles)(Vote);
