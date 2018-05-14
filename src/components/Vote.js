import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from 'material-ui/Table';
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  Tooltip,
  Paper,
  Snackbar
} from 'material-ui';
import {
  Done as CheckIcon,
  PanoramaWideAngle as EmptyIcon,
  InsertChart as ChartIcon,
  Close as CloseIcon,
  Home as HomeIcon
} from '@material-ui/icons';

import { database } from '../services';

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh'
  },
  voting: {
    width: '100vw'
  },
  navButton: {
    display: 'flex',
    justifyContent: 'center',
    width: '10vw',
    maxWidth: '80px'
  },
  cell: { justifyContent: 'center', textAlign: 'center' }
};

class Vote extends Component {
  defaultState = {
    title: '',
    candidates: [],
    votes: {},
    lastAction: '',
    notifierOpen: false
  };

  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  static electionRef(electionKey) {
    return database.ref(`/elections/${electionKey}`);
  }

  static candidatesRef(electionKey) {
    return database.ref(`/candidates/${electionKey}`);
  }

  static votesRef(electionKey) {
    return database.ref(`/votes/${electionKey}`);
  }

  static rankName(number) {
    if (number === 1) return 'first';
    if (number === 2) return 'second';
    if (number === 3) return 'third';
    return number + 'th';
  }

  static actionText(candidateName, displacedName, position, previousPosition) {
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

  componentDidMount() {
    const electionKey = this.props.match.params.key;
    Vote.electionRef(electionKey).on('value', snapshot => {
      const election = snapshot.val();
      this.setState({ title: election.title });
    });

    Vote.candidatesRef(electionKey).on('value', snapshot => {
      const candidatesVal = snapshot.val();
      const candidates = Object.keys(candidatesVal).map(key => ({
        id: key,
        name: candidatesVal[key].name
      }));

      this.setState({ candidates });
    });
  }

  updateVote = (candidateId, position) => {
    if (this.state.votes[position] === candidateId) return;
    const votes = Object.assign({}, this.state.votes);

    const candidateName = this.state.candidates.filter(
      c => c.id === candidateId
    )[0].name;
    const displacedName = votes[position]
      ? this.state.candidates.filter(c => c.id === votes[position])[0].name
      : '';

    let previousPosition;
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
    Vote.votesRef(electionKey).push(this.state.votes);
    this.setState({ votes: {} });
  };

  closeNotifier = () => this.setState({ notifierOpen: false });

  render() {
    const { title, candidates, notifierOpen, lastAction } = this.state;
    const {
      classes,
      match: {
        params: { key }
      }
    } = this.props;

    return (
      <div className={classes.wrapper}>
        <div className={classes.navButton}>
          <Tooltip title="Dashboard">
            <Avatar component={Link} to="/">
              <HomeIcon color="primary" />
            </Avatar>
          </Tooltip>
        </div>
        <div className={classes.voting}>
          <Typography variant="headline" align="center" gutterBottom>
            {title}
          </Typography>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell key={0} colSpan="2" />
                  {candidates.map((candidate, i) => (
                    <TableCell key={i + 1} className={classes.cell}>
                      {i + 1}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate, i) => (
                  <TableRow key={i}>
                    <TableCell key={0} colSpan="2">
                      {candidate.name}
                    </TableCell>
                    {candidates.map((c, i) => (
                      <TableCell className={classes.cell} key={i + 1}>
                        <IconButton
                          onClick={e => this.updateVote(candidate.id, i + 1)}
                        >
                          {this.state.votes[i + 1] === candidate.id ? (
                            <CheckIcon />
                          ) : (
                            <EmptyIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Button variant="raised" color="secondary" onClick={this.submitVote}>
            Submit Vote
          </Button>
        </div>
        <div className={classes.navButton}>
          <Tooltip title="Results">
            <Avatar component={Link} to={`/monitor/${key}/round/1`}>
              <ChartIcon color="primary" />
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
    );
  }
}

export default withStyles(styles)(Vote);
