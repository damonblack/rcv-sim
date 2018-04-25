import React, { Component } from 'react'; 
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'; 
import IconButton from 'material-ui/IconButton';
import DoneIcon from 'material-ui/svg-icons/action/done';
import EmptyIcon from 'material-ui/svg-icons/image/panorama-wide-angle';

import { database } from '../services';


class Election extends Component {

  defaultState = {
    title: '',
    candidates: [],
    votes: {},
  }

  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  componentDidMount() {
    const electionKey = this.props.match.params.key;
    const electionRef = database.ref(`/elections/${electionKey}`);
    electionRef.on('value', (snapshot) => {
      console.log('snapshot.val()', snapshot.val());
      const election = snapshot.val();
      this.setState({ title: election.title });
    });

    const candidatesRef = database.ref(`/candidates/${electionKey}`);
    candidatesRef.on('value', (snapshot) => {
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
  
  render() {
    const { title, candidates } = this.state;
    return (
      <div>
        <h2>Election</h2>
        <span>{title}</span>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn key={0} colSpan="2"/>
              {candidates.map((candidate, i) => (
                <TableHeaderColumn key={i + 1}>{i + 1}</TableHeaderColumn>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {candidates.map((candidate, i) => (
              <TableRow key={i}>
                <TableRowColumn key={0} colSpan="2">{candidate.name}</TableRowColumn>
                { candidates.map((c, i) => (
                  <TableRowColumn key={i + 1}>
                    <IconButton onClick={(e) => this.updateVote(candidate.id, i + 1)}>
                      {this.state.votes[i + 1] === candidate.id ?
                        <DoneIcon /> : <EmptyIcon />
                      }
                    </IconButton>
                  </TableRowColumn>
                ))}
              </TableRow> 
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default Election;