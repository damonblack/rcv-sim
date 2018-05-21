//@flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Typography,
  Paper,
  Button,
  Tooltip,
  Chip
} from '@material-ui/core';
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

const checkeredGradient =
  'repeating-linear-gradient(to top, #fff, #fff 3%, #000 3%, #000 6%), ' +
  'repeating-linear-gradient(to top, #000, #000 3%, #fff 3%, #fff 6%), ' +
  'repeating-linear-gradient(to top, #fff, #fff 3%, #000 3%, #000 6%)';

const styles = theme => {
  return {
    wrapper: {
      display: 'flex',
      alignItems: 'top',
      justifyContent: 'center',
      height: '80vh'
    },
    splitWrapper: { display: 'flex', justifyContent: 'space-between' },
    results: { width: '100%' },
    chartHeader: {
      background: 'transparent',
      height: '2em'
    },
    chartLabel: { transform: 'translate(-50%, 0)' }
  };
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
    '#F1CB21',
    '#FF6600',
    '#EC2127',
    '#272361',
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
      const candidatesData = snapshot.val();
      const candidateIds = Object.keys(candidatesData);
      const candidatesArray = candidateIds.map((key, index) => ({
        id: key,
        name: candidatesData[key].name
      }));

      const colorMap = {};

      candidateIds.forEach(
        (key, i) => (colorMap[key] = this.candidateColors[i])
      );

      this.setState({
        candidates: candidatesArray,
        colorMap
      });

      //Re-runs the election on every vote. Throttle this ?
      database.ref(`votes/${key}`).on('value', snapshot => {
        if (snapshot.val()) {
          const votes = Object.values(snapshot.val());
          const results = getResults(votes, candidatesArray.map(c => c.id));
          this.setState({ votes, results });
        }
      });
    });
  }

  render() {
    const { election, votes, candidates, colorMap, results } = this.state;

    if (!(election && candidates && votes && results && colorMap))
      return <Typography>Loading...</Typography>;

    const firstTotals = results.rounds[0].totals;
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
    const thisRound = results.rounds[roundInt - 1];
    const totalVotes = thisRound.validVoteCount;
    const votesToWin = totalVotes / 2;
    const nextRound = roundInt + 1;
    const lastRound = roundInt < 2 ? 1 : roundInt - 1;
    const finalRound = results.rounds.slice(-1)[0];
    // prettier-ignore
    const winningCount = finalRound.winner ? finalRound.totals[finalRound.winner] : 0;
    const scalar = 10 * totalVotes / winningCount;
    // prettier-ignore
    const graphRulesGradient = `repeating-linear-gradient(to right, #BBB, #BBB 1px, transparent 1px, transparent ${scalar}%)`;

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
          <Typography variant="title" align="center" gutterBottom>
            {election.title} - Round {round}
          </Typography>
          <div className={classes.splitWrapper}>
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
          </div>
          <Paper className={classes.chartHeader}>
            <Chip
              className={classes.chartLabel}
              label="50%"
              style={{ marginLeft: `${5 * scalar}%` }}
            />
          </Paper>
          <Paper
            style={{
              // prettier-ignore
              backgroundImage: graphRulesGradient + ', ' + checkeredGradient,
              backgroundPosition: `left, ${5 * scalar + 0.5}% 0, ${5 * scalar +
                1}%, ${5 * scalar + 1.5}%`,
              backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat',
              backgroundSize: 'contain, 0.5% 100%, 0.5% 100%, 0.5% 100%'
            }}
            elevation={8}
          >
            {sortedCandidates.map(candidate => {
              const segments = thisRound.segments[candidate.id];
              const total = thisRound.totals[candidate.id];
              return (
                <Candidate
                  key={candidate.id}
                  winningCount={winningCount}
                  voteSegments={segments}
                  totalVotesForCandidate={total}
                  percentageOfWin={total / votesToWin * 100}
                  candidate={candidate}
                  colorMap={colorMap || {}}
                  winner={candidate.id === results.winner}
                  loser={thisRound.previousLosers.includes(candidate.id)}
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
