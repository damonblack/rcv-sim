// @flow
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {
  TextField,
  Button,
  ButtonBase,
  InputAdornment,
  Grid,
  Typography,
} from '@material-ui/core';
import {Delete as DeleteIcon} from '@material-ui/icons';

import {withRouter} from 'react-router-dom';
import {electionsRef, candidatesForElectionRef} from '../services';

import styles from '../styles/baseStyles';

const moviePlaceholders = [
  'Pretty Woman',
  'Braveheart',
  'Fight Club',
  'V for Vendetta',
  'Godfather',
  'Wonder Woman',
];

class CreatePoll extends Component {
  defaultState = {
    creating: false,
    electionTitle: '',
    numberOfWinners: 1,
    candidates: ['', '', ''],
    errors: {electionTitle: '', candidateNames: ['', '', '']},
  };

  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  handleChange = (field) => (e) => {
    const {value} = e.target;
    this.setState({[field]: value});
  };

  updateNumberOfWinners = (e) => {
    const numberOfWinners = Math.trunc(e.target.value) || '';
    if (isNaN(numberOfWinners) || numberOfWinners < 1 || numberOfWinners > 5) {
      this.setState({numberOfWinners, error: 'Must be between 1 and 5'});
    } else {
      this.setState((prevState) => {
        const candidates = prevState.candidates.slice();
        while (candidates.length < numberOfWinners + 1) {
          candidates.push('');
        }
        return {
          candidates,
          numberOfWinners,
          error: null,
        };
      });
    }
  };

  handleChangeCandidate = (index) => (e) => {
    const {value} = e.target;
    this.setState((state) => {
      const candidates = state.candidates.slice(0);
      candidates[index] = value;
      return {candidates};
    });
  };

  addCandidate = () => {
    this.setState(({candidates}) => ({candidates: [...candidates, '']}));
  };

  removeCandidate = (i: number) => {
    this.setState(({candidates: oldCandidates}) => {
      const candidates = oldCandidates.slice(0);
      candidates.splice(i, 1);
      return {candidates};
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {electionTitle, numberOfWinners, candidates} = this.state;
    if (candidates.length < 1 + numberOfWinners) {
      this.setState({error: 'Must have more candidates than winners'});
      return;
    }
    const title = electionTitle.trim();
    const key = Math.floor(Math.random() * 90000) + 10000;
    electionsRef()
      .child(key)
      .set({
        title,
        numberOfWinners,
        owner: this.props.user.uid,
        created: Date.now(),
      })
      .then(() => {
        const candidateDB = candidatesForElectionRef(key);
        candidates.forEach((candidate) => {
          const candidateEntry = {
            name: candidate.trim(),
            owner: this.props.user.uid,
          };
          candidateDB.push(candidateEntry);
        });
      })
      .catch(() =>
        // eslint-disable-next-line no-alert
        window.alert('Unable to create election. Try a different name.'),
      );

    // redirect to /
    // this is where we'll go after the election is created
    // only if the election is successfully created
    this.props.history.push('/');

    // this.props.onCancel();
  };

  render() {
    const {candidates, electionTitle, numberOfWinners, error} = this.state;
    const {classes} = this.props;
    const disableRemove = candidates.length < 3 + numberOfWinners;
    const disabbleAdd = candidates.length === 8;
    return (
      <Grid container>
        <Grid item xs={0} sm={3} />
        <Grid item xs={12} sm={6}>
          <form onSubmit={this.handleSubmit}>
            <Typography
              variant="h4"
              className={classes.sectionTitle}
              style={{fontSize: '2rem', padding: '20px 0'}}
            >
              Create a Poll with Ranked Choice Voting
            </Typography>
            <Typography
              variant="h5"
              className={[classes.sectionTitle, classes.formTitle]}
            >
              Number of Winners
            </Typography>
            <TextField
              required
              id="numberOfWinners"
              onChange={this.updateNumberOfWinners}
              value={numberOfWinners}
              placeholder="1"
              margin="dense"
              variant="outlined"
              type="number"
              InputProps={{
                classes: {
                  input: classes.textField,
                },
              }}
            />
            <Typography
              variant="h5"
              className={[classes.sectionTitle, classes.formTitle]}
            >
              Question
            </Typography>
            <TextField
              required
              id="question"
              onChange={this.handleChange('electionTitle')}
              value={electionTitle}
              placeholder="What movie should we see Saturday Night?"
              margin="dense"
              variant="outlined"
              fullWidth
              InputProps={{
                classes: {
                  input: classes.textField,
                },
              }}
            />
            <Typography
              variant="h5"
              className={[classes.sectionTitle, classes.formTitle]}
            >
              Possible Answers
            </Typography>
            {/* <TextField
              key={1}
              className={classes.textField}
              defaultValue={1}
              required
              placeholder="Number of Winners"
              label={error || 'Number of Winners'}
              value={numberOfWinners}
              onChange={this.updateNumberOfWinners}
              fullWidth
              type="number"
              inputProps={{ min: 0, max: 20 }}
              variant="filled"
              error={error}
            /> */}
            {candidates.map((candidate, i) => (
              <TextField
                id={i}
                value={candidate}
                placeholder={moviePlaceholders[i]}
                onChange={this.handleChangeCandidate(i)}
                margin="dense"
                variant="outlined"
                style={{'background-color': '#fff'}}
                fullWidth
                required
                InputProps={{
                  classes: {
                    input: classes.textField,
                  },
                  endAdornment: (
                    <InputAdornment variant="outlined" position="end">
                      <ButtonBase
                        disabled={disableRemove}
                        onClick={() => this.removeCandidate(i)}
                      >
                        <DeleteIcon />
                      </ButtonBase>
                    </InputAdornment>
                  ),
                }}
              />
            ))}
            <Button
              fullWidth
              type="button"
              onClick={this.addCandidate}
              disabled={disabbleAdd}
            >
              Add Another Candidate
            </Button>
            <div className={classes.buttonTray}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                className={[classes.button, classes.buttonNarrow]}
                disabled={error}
                type="submit"
              >
                Preview Ballot
              </Button>
            </div>
          </form>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles)(CreatePoll));
