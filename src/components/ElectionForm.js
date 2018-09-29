//@flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  TextField,
  Button,
  ButtonBase,
  Divider,
  InputAdornment
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  DeleteSweep as DeleteSweepIcon
} from '@material-ui/icons';

import { electionsRef, candidatesForElectionRef } from '../services';

const styles = theme => ({
  results: {
    minWidth: '30%',
    padding: 2 * theme.spacing.unit
  },
  // candidateEntry: { display: 'flex', justifyContent: 'space-between' },
  buttonTray: {
    display: 'flex',
    justifyContent: 'space-around'
  }
});

type Props = {
  classes: { results: Object, candidateEntry: Object },
  user: { uid: string },
  onCancel: () => void
};

type State = {
  creating: boolean,
  electionTitle: string,
  numberOfWinners: number,
  candidates: Array<string>,
  errors: {
    electionTitle: string,
    candidateNames: Array<string>
  }
};

class ElectionForm extends Component<Props, State> {
  defaultState = {
    creating: false,
    electionTitle: '',
    numberOfWinners: 1,
    candidates: ['', '', ''],
    errors: { electionTitle: '', candidateNames: ['', '', ''] }
  };

  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  handleChange = field => e => {
    const value = e.target.value;
    this.setState({ [field]: value });
  };

  updateNumberOfWinners = e => {
    const numberOfWinners = Math.trunc(e.target.value) || '';
    if (isNaN(numberOfWinners) || numberOfWinners < 1 || numberOfWinners > 20) {
      this.setState({ numberOfWinners, error: 'Must be between 1 and 20' });
    } else {
      this.setState(prevState => {
        const candidates = prevState.candidates.slice();
        while (candidates.length < numberOfWinners + 1) {
          candidates.push('');
        }
        return {
          candidates,
          numberOfWinners,
          error: null
        };
      });
    }
  };

  handleChangeCandidate = index => e => {
    const value = e.target.value;
    const candidates = this.state.candidates.slice(0);
    candidates[index] = value;
    this.setState({ candidates });
  };

  addCandidate = () => {
    this.setState({ candidates: [...this.state.candidates, ''] });
  };

  removeCandidate = (i: number) => {
    const candidates = this.state.candidates.slice(0);
    candidates.splice(i, 1);

    this.setState({ candidates });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { electionTitle, numberOfWinners, candidates } = this.state;
    if (candidates.length < 1 + numberOfWinners) {
      this.setState({ error: 'Must have more candidates than winners' });
      return;
    }
    const title = electionTitle.trim();
    const cleanTitle = title.replace(/[^\w\s]/gi, '');
    const key = cleanTitle.replace(/\s+/g, '-').toLowerCase();
    electionsRef()
      .child(key)
      .set({
        title: title,
        numberOfWinners,
        owner: this.props.user.uid,
        created: Date.now()
      })
      .then(result => {
        const candidateDB = candidatesForElectionRef(key);
        candidates.forEach(candidate => {
          const candidateEntry = {
            name: candidate.trim(),
            owner: this.props.user.uid
          };
          candidateDB.push(candidateEntry);
        });
      })
      .catch(error =>
        alert('Unable to create election. Try a different name.')
      );

    this.props.onCancel();
  };

  render() {
    const { candidates, electionTitle, numberOfWinners, error } = this.state;
    const { classes, onCancel } = this.props;
    const disableRemove = candidates.length < 2 + numberOfWinners;
    return (
      <Paper className={classes.results} elevation={5}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            key={1}
            className={classes.textField}
            required
            placeholder="My Election Name"
            label="Name your election"
            value={electionTitle}
            onChange={this.handleChange('electionTitle')}
            variant="filled"
            fullWidth
          />
          <Divider />
          <Divider />
          <Divider />
          <Divider />
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
            <div key={i + 1} className={classes.candidateEntry}>
              <TextField
                label={`Candidate ${i + 1}`}
                required
                className={classes.textField}
                value={candidate}
                onChange={this.handleChangeCandidate(i)}
                variant="filled"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment variant="filled" position="end">
                      <ButtonBase
                        disabled={disableRemove}
                        onClick={() => this.removeCandidate(i)}
                      >
                        <DeleteIcon />
                      </ButtonBase>
                    </InputAdornment>
                  )
                }}
              />
            </div>
          ))}
          <Button fullWidth type="button" onClick={this.addCandidate}>
            Add Another Candidate
          </Button>
          <div className={classes.buttonTray}>
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={error}
              type="submit"
            >
              Create
            </Button>
          </div>
        </form>
      </Paper>
    );
  }
}

export default withStyles(styles)(ElectionForm);
