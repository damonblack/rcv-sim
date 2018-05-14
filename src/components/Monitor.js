//@flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { Avatar, Typography, Paper, Button, Tooltip } from 'material-ui';
import {
  ArrowBack,
  ArrowForward,
  Done as VoteIcon,
  Home as HomeIcon
} from '@material-ui/icons';

import { database } from '../services';
import { getResults } from '../lib/voteCounter';
import Candidate from './chart/Candidate';
import type { Results } from '../lib/voteTypes';

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'top',
    justifyContent: 'center',
    height: '80vh'
  },
  splitWrapper: { display: 'flex', justifyContent: 'space-between' },
  results: { width: '100%' }
};

type Props = {
  match: {
    params: {
      key: string,
      round: string
    }
  },
  classes: Object
};

type State = {
  election?: Object,
  candidates?: Array<Object>,
  colorMap?: Object,
  votes?: Array<any>,
  results?: Results
};

class Monitor extends Component<Props, State> {
  state = {};

  candidateColors = [
    'green',
    'red',
    'blue',
    'gold',
    'purple',
    'cyan',
    'magenta',
    'darkGrey',
    'brown',
    'pink'
  ];

  componentDidMount() {
    const { key } = this.props.match.params;
    database.ref(`elections/${key}`).on('value', snapshot => {
      const election = snapshot.val();
      election.id = key;
      this.setState({ election });
    });
    database.ref(`candidates/${key}`).once('value', snapshot => {
      const candidatesObj = snapshot.val();
      const candidateIds = Object.keys(snapshot.val());
      const candidatesArray = candidateIds.map((key, index) => ({
        id: key,
        name: candidatesObj[key].name
      }));

      database.ref(`votes/${key}`).on('value', snapshot => {
        if (snapshot.val()) {
          const votes = Object.values(snapshot.val());
          const results = getResults(votes, candidatesArray.map(c => c.id));
          this.setState({ votes, results });
        }
      });

      const colorMap = {};

      candidateIds.forEach(
        (key, i) => (colorMap[key] = this.candidateColors[i])
      );

      this.setState({
        candidates: candidatesArray,
        colorMap
      });
    });
  }

  render() {
    const { election, votes, candidates, colorMap, results } = this.state;

    if (!(election && candidates && votes && results))
      return <Typography>Loading...</Typography>;

    const firstTotals = results[0].totals;
    const sortedCandidates = candidates
      .concat()
      .sort((a, b) => firstTotals[b.id] - firstTotals[a.id]);
    const {
      classes,
      match: {
        params: { key, round }
      }
    } = this.props;
    const roundInt = parseInt(round, 10);
    const thisRound = results[roundInt - 1];
    const totalVotes = thisRound.validVoteCount;
    const votesToWin = totalVotes / 2;
    const nextRound = roundInt + 1;
    const lastRound = roundInt < 2 ? 1 : roundInt - 1;

    return (
      <div className={classes.wrapper}>
        <Tooltip title="Previous Round">
          <Button
            disabled={roundInt === 1}
            variant="raised"
            component={Link}
            to={`/monitor/${key}/round/${lastRound}`}
          >
            <ArrowBack className={classes.chartIcon} color="primary" />
          </Button>
        </Tooltip>
        <div className={classes.results}>
          <Typography variant="headline" align="center" gutterBottom>
            {election.title}
          </Typography>
          <div className={classes.splitWrapper}>
            <Typography>Total Votes: {thisRound.validVoteCount}</Typography>
            <Tooltip title="Dashboard">
              <Avatar component={Link} to={`/`}>
                <HomeIcon className={classes.chartIcon} color="primary" />
              </Avatar>
            </Tooltip>
            <Tooltip title="Vote">
              <Avatar component={Link} to={`/vote/${election.id}`}>
                <VoteIcon color="primary" />
              </Avatar>
            </Tooltip>
            <Typography>Votes to Win: > {votesToWin}</Typography>
          </div>
          <Paper
            style={{
              background: `repeating-linear-gradient(to right, #ddd, #ddd 1px, #fff 1px, #fff 20%)`
            }}
            elevation={8}
          >
            {sortedCandidates.map(candidate => {
              const segments = thisRound.segments[candidate.id];
              const total = thisRound.totals[candidate.id];
              return (
                <Candidate
                  key={candidate.id}
                  voteSegments={segments}
                  totalVotesForCandidate={total}
                  percentageOfWin={total / votesToWin * 100}
                  candidate={candidate}
                  colorMap={colorMap}
                />
              );
            })}
          </Paper>
        </div>
        <Tooltip title="Next Round">
          <Button
            disabled={!!thisRound.winner}
            variant="raised"
            component={Link}
            to={`/monitor/${key}/round/${nextRound}`}
          >
            <ArrowForward className={classes.chartIcon} color="primary" />
          </Button>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(styles)(Monitor);
