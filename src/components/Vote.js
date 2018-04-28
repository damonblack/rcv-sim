import React, { Component } from 'react'; 
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from 'material-ui/Table'; 
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import CheckIcon from '@material-ui/icons/Done';
import EmptyIcon from '@material-ui/icons/PanoramaWideAngle';

import { database } from '../services';


class Vote extends Component {

  defaultState = {
    title: '',
    candidates: [],
    votes: {},
  }

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

  componentDidMount() {
    const electionKey = this.props.match.params.key;
    Vote.electionRef(electionKey).on('value', (snapshot) => {
      const election = snapshot.val();
      this.setState({ title: election.title });
    });

    Vote.candidatesRef(electionKey).on('value', (snapshot) => {
      const candidatesVal = snapshot.val();
      const candidates = Object.keys(candidatesVal).map((key) => (
        { id: key, name: candidatesVal[key].name}
      ));

      this.setState({ candidates });
    });
  }

  updateVote = (candidateId, position) => {
    if (this.state.votes[position] === candidateId) return;
    const votes = Object.assign({}, this.state.votes);

    Object.keys(votes).forEach((key) => {
      if (votes[key] === candidateId) votes[key] = null;
    });
    votes[position] = candidateId;

    this.setState({ votes });
  }

  submitVote = () => {
    const electionKey = this.props.match.params.key;
    Vote.votesRef(electionKey).push(this.state.votes);
  }
  
  render() {
    const { title, candidates } = this.state;
    return (
      <div>
        <h2>Vote</h2>
        <span>{title}</span>
        <Table>
          <TableHead
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableCell key={0} colSpan="2"/>
              {candidates.map((candidate, i) => (
                <TableCell key={i + 1}>{i + 1}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            displayRowCheckbox={false}
          >
            {candidates.map((candidate, i) => (
              <TableRow key={i}>
                <TableCell key={0} colSpan="2">{candidate.name}</TableCell>
                { candidates.map((c, i) => (
                  <TableCell key={i + 1}>
                    <IconButton onClick={(e) => this.updateVote(candidate.id, i + 1)}>
                      {this.state.votes[i + 1] === candidate.id ?
                        <CheckIcon /> : <EmptyIcon />
                      }
                    </IconButton>
                  </TableCell>
                ))}
              </TableRow> 
            ))}
          </TableBody>
        </Table>
        <Button onClick={this.submitVote}>Submit Vote</Button>
      </div>
    );
  }
}

export default Vote;