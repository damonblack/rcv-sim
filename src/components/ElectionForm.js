//@flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { Paper, TextField, Divider, Button, ButtonBase } from 'material-ui';
import { Delete as DeleteIcon } from '@material-ui/icons';

import { electionsRef, candidatesForElectionRef } from '../services';

const styles = {
  results: { width: '400px', minWidth: '30%' },
  candidateEntry: { display: 'flex', justifyContent: 'space-between' }
};

type Props = {
  classes: { results: Object, candidateEntry: Object },
  user: { uid: string }
};

type State = {
  creating: boolean,
  electionTitle: string,
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

  handleSubmit = () => {
    const electionKey = electionsRef().push({
      title: this.state.electionTitle.trim(),
      owner: this.props.user.uid
    }).key;
    const candidateDB = candidatesForElectionRef(electionKey);
    this.state.candidates.forEach(candidate => {
      const candidateEntry = {
        name: candidate.trim(),
        owner: this.props.user.uid
      };
      candidateDB.push(candidateEntry);
    });

    this.setState({ electionTitle: '', candidates: ['', ''] });
  };

  render() {
    const { candidates, electionTitle } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.results}>
        <form onSubmit={this.handleSubmit}>
          <Paper elevation={5}>
            <TextField
              key={1}
              required
              placeholder="My Election Name"
              label="Name your election"
              value={electionTitle}
              onChange={this.handleChange('electionTitle')}
              fullWidth
            />
            <Divider />
            <Divider />
            {candidates.map((candidate, i) => (
              <div key={i + 1} className={classes.candidateEntry}>
                <TextField
                  label={`Candidate ${i + 1}`}
                  required
                  value={candidate}
                  onChange={this.handleChangeCandidate(i)}
                  fullWidth
                />
                <ButtonBase onClick={() => this.removeCandidate(i)}>
                  <DeleteIcon />
                </ButtonBase>
                <Divider />
              </div>
            ))}
            <Button type="button" onClick={this.addCandidate}>
              Add
            </Button>
            <Button type="submit">Submit</Button>
            <Button
              type="button"
              onClick={() =>
                this.setState({
                  creating: false,
                  candidates: ['', '', '']
                })
              }
            >
              Cancel
            </Button>
          </Paper>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(ElectionForm);
