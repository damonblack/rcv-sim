//@flow
import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/index';
import {
  Avatar,
  IconButton,
  Snackbar,
  Tooltip,
  Typography
} from '@material-ui/core';
import {
  Home as HomeIcon,
  InsertChart as ChartIcon,
  Close as CloseIcon
} from '@material-ui/icons';

import { auth, electionRef, candidatesRef, votesRef } from '../../services';
import type { Election } from '../../lib/voteTypes';
import LegacyBallot from './LegacyBallot';

const styles = {
  wrapper: {
    display: 'flex',
    height: '80vh'
  },
  navButton: {
    display: 'flex',
    justifyContent: 'center',
    width: '10vw',
    maxWidth: '80px'
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
    election: {
      key: '',
      title: '',
      owner: ''
    },
    candidates: [],
    votes: {},
    lastAction: '',
    notifierOpen: false,
    user: auth.currentUser
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

  updateUser = user =>
    user ? this.setState({ user }) : this.setState(this.defaultState);

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

  userIsElectionOwner = () =>
    this.state.user &&
    this.state.election &&
    this.state.user === this.state.election.owner;

  ready = () => this.state.election && this.state.candidates;

  render() {
    const {
      election,
      candidates,
      notifierOpen,
      lastAction,
      votes
    } = this.state;
    const {
      classes,
      match: {
        params: { key }
      }
    } = this.props;

    if (election && candidates) {
      if (
        !localStorage.getItem('RCV' + key) ||
        (this.state.user && !this.userIsElectionOwner())
      ) {
        return (
          <div>
            <div>
              <Typography variant="title" align="center" gutterBottom>
                {election.title}
              </Typography>
            </div>
            <div className={classes.wrapper}>
              <div className={classes.navButton}>
                <Tooltip title="Dashboard">
                  <Avatar component={Link} to="/">
                    <HomeIcon color="primary" />
                  </Avatar>
                </Tooltip>
              </div>
              <LegacyBallot
                election={election}
                candidates={candidates}
                votes={votes}
                lastAction={lastAction}
                notifierOpen={notifierOpen}
                updateVote={this.updateVote}
                submitVote={this.submitVote}
                closeNotifier={this.closeNotifier}
              />
              <div className={classes.navButton}>
                <Tooltip title="Results">
                  <Avatar
                    component={Link}
                    to={`/monitor/${election.key}/round/1`}
                  >
                    <ChartIcon className={classes.chartIcon} color="primary" />
                  </Avatar>
                </Tooltip>
              </div>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
                open={notifierOpen}
                autoHideDuration={4000}
                onClose={this.closeNotifier}
                SnackbarContentProps={{
                  'aria-describedby': 'message-id'
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
                  </IconButton>
                ]}
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

export default withStyles(styles)(Vote);
