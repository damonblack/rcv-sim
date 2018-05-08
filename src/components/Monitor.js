import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { Typography, Paper, Button } from 'material-ui';

import { database } from '../services';
import { getResultsForRound } from '../lib/voteCounter';
import Candidate from './chart/Candidate';

const styles = { 
  wrapper: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' },
  splitWrapper: { display: 'flex', justifyContent: 'space-between' },
  results: { width: '50%' },
};

class Monitor extends Component {
  state = { };

  candidateColors = ['green', 'red', 'blue', 'gold', 'purple', 'cyan', 'dark-blue', 'pink', 'brown' ]


  componentDidMount() {
    const { key, round } = this.props.match.params;
    database.ref(`elections/${key}`).on('value', (snapshot) => {
      this.setState({ election: snapshot.val() })
    });
    database.ref(`candidates/${key}`).on('value', (snapshot) => {
      const candidatesObj = snapshot.val();
      const candidateIds = Object.keys(snapshot.val());
      const candidatesArray = candidateIds.map((key, index) => (
        { id: key, name: candidatesObj[key].name }
      ));

      const colorMap = {};

      candidateIds.forEach((key, i) => colorMap[key] = this.candidateColors[i]);

      this.setState({ 
        candidates: candidatesArray,  
        colorMap
      });
      
    });
    database.ref(`votes/${key}`).on('value', (snapshot) => {
      if (snapshot.val()) {
        const votes = Object.values(snapshot.val());
        this.setState({ votes });
      }
    });
  }


  render() {
    const { election, votes, candidates, colorMap } = this.state;
    if (!(election && candidates && votes)) return <Typography>Loading...</Typography>;
    const { classes, match: { params: { key, round } } } = this.props;
    const results = getResultsForRound(votes, round);
    const roundInt = parseInt(round, 10);
    const totalVotes = results ? results.overallTotal : 0;
    const votesToWin = totalVotes / 2; 
    const nextRound = roundInt + 1;
    const previousRound = roundInt < 2 ? 1 : roundInt - 1;

    return (
      <div className={classes.wrapper}>
        <Button variant="raised" component={Link} to={`/monitor/${key}/round/${previousRound}`}>
          Previous Round
        </Button>
        <div className={classes.results}>
          <Typography variant="headline">{election.title}</Typography> 
          <div className={classes.splitWrapper}>
            <Typography>Total Votes: { results ? results.overallTotal : '0' }</Typography>
            <Typography>Votes to Win: { Math.ceil(votesToWin) }</Typography>
          </div>
          <Paper 
            style={{ 
              background: `repeating-linear-gradient(to right, #eee, #eee 1px, #fff 1px, #fff 20%)` 
            }} 
            elevation={8}>
            {this.state.candidates.map((candidate) => {
              if (results.segments[candidate.id]) {
                return <Candidate 
                  key={candidate.id} 
                  voteSegments={results.segments[candidate.id]} 
                  totalVotesForCandidate={results.candidateTotals[candidate.id]}
                  percentageOfWin={results.candidateTotals[candidate.id] / votesToWin * 100}
                  candidate={candidate} 
                  colorMap={colorMap}
                />;
              }
            })}
          </Paper>
        </div>
        <Button variant="raised" component={Link} to={`/monitor/${key}/round/${nextRound}`}>
          Next Round
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Monitor);