import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { 
  Typography, 
  Table, 
  TableBody,
  TableHead, 
  TableRow,
  TableCell,
  Paper
} from 'material-ui';

import { database } from '../services';
import {

} from 'material-ui/colors';


const styles = { 
  wrapper: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' },
  splitWrapper: { display: 'flex', justifyContent: 'space-between' },
  results: { width: '50%' },
};

class Monitor extends Component {
  state = {};

  candidateColors = ['green', 'red', 'blue', 'gold', 'purple', 'cyan', 'dark-blue' ]

  componentDidMount() {
    const { key } = this.props.match.params;
    database.ref(`elections/${key}`).on('value', (snapshot) => {
      this.setState({ election: snapshot.val() })
    });
    database.ref(`candidates/${key}`).on('value', (snapshot) => {
      const candidatesObj = snapshot.val();
      const candidatesArray = Object.keys(snapshot.val()).map(key => (
        { id: key, name: candidatesObj[key].name}
      ));
      this.setState({ candidates: candidatesArray });
    });
    database.ref(`votes/${key}`).on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({ votes: Object.values(snapshot.val()) })
      }
    });
  }

  getVotesForPosition = (position, candidateId) => {
    const results = this.state.votes.reduce((total, vote) => (
      vote[position] === candidateId ? total + 1 : total
    ), 0);
    return results;
  };

  getGraphTickInterval = (votesToWin) => {
    if (votesToWin < 20) {
      return 100/votesToWin;
    } else if (votesToWin < 200) {
      return 1000/votesToWin;
    } else {
      return 10000/votesToWin;
    }
  }


  render() {
    const { candidates, votes, election } = this.state;
    const { classes } = this.props;
    const votesToWin = votes ? Math.ceil(votes.length / 2) : ''; 
    const tick = this.getGraphTickInterval(votesToWin);


    return (
      <div className={classes.wrapper}>
        { election && candidates ?
        <div className={classes.results}>
          <Typography variant="headline">{this.state.election.title}</Typography> 
          <div className={classes.splitWrapper}>
            <Typography>Total Votes: { votes ? votes.length : '0' }</Typography>
            <Typography>Votes to Win: { votesToWin }</Typography>
          </div>
          { votes ?
            <Paper 
              style={{ 
                background: `repeating-linear-gradient(to right, #eee, #eee 1px, #fff 1px, #fff ${tick}%)` 
              }} 
              elevation={8}>
              {this.state.candidates.map((candidate, i) => {
                const voteCount = this.getVotesForPosition(1, candidate.id);
                const style = {
                  width: voteCount / Math.ceil(votes.length / 2) * 100 + '%',
                  height: '50px',
                  backgroundColor: this.candidateColors[i]
                };
                return (
                  <div key={candidate.id}>
                    <Typography variant="subheading">{candidate.name} : {voteCount}</Typography>
                    <Paper style={style} square />
                  </div>
                );
              })}
            </Paper>
             :
            <Typography>No votes yet.</Typography>
          }
          </div>
        : 
          <Typography>Loading...</Typography>
        }
      </div>
    );
  }
}

export default withStyles(styles)(Monitor);