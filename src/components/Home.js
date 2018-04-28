import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles'
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import ButtonBase from 'material-ui/ButtonBase';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemText } from 'material-ui/List';
import ChartIcon from '@material-ui/icons/InsertChart';
import VoteIcon from '@material-ui/icons/Done';
import blue from 'material-ui/colors/blue';
import { Link } from 'react-router-dom';

import { auth, googleAuth, database } from '../services';


const styles = {
  wrapper: {
    maxWidth: 400
  },
  chartIcon: {
    fontSize: '2.5em'
  }

};

class Home extends Component {
  defaultState = {
    userName: '',
    user: null,
    elections: [],
    creating: false,
    electionTitle: '',
    candidates: [ '','' ],
  }

  constructor() {
    super();
    this.state = this.defaultState;
  }

  static myElectionsRef(uid) {
    return database.ref('elections').orderByChild('owner').equalTo(uid);
  }

  static allElectionsRef() {
    return database.ref('elections');
  }

  static candidatesForElectionRef(electionKey) {
    return database.ref(`candidates/${electionKey}`);
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        this.watchMyElections(user.uid);
      } else {
        this.setState(this.defaultState);
      }
    });
  }

  watchMyElections = (uid) => {
    Home.myElectionsRef(uid).on('value', (snapshot) => {
      const electionsVal = snapshot.val();
      let elections = [];
      if (electionsVal && this.state.user) {
        elections = Object.keys(electionsVal).map((key) => {
          return { id: key, title: electionsVal[key].title }
        });
      }
      this.setState({ elections });
    })
  }

  login = async () => {
    try {
      const result = await auth.signInWithPopup(googleAuth);
      this.setState({ user: result.user });
      this.watchMyElections(result.user.uid);
    } catch (e) {
      console.log('LOGIN FAILED: ', e.stack);
      alert('login failed');
    }
  }

  logout = async () => {
    try {
      await auth.signOut();
      this.setState(this.defaultState);
    } catch (e) {
      console.log('LOGIN FAILED: ', e);
      alert('logout failed');
    }
  }

  handleChange = field => e => {
    const value = e.target.value;
    this.setState({ [field]: value });
  }

  handleChangeCandidate = index => e => {
    const value = e.target.value;
    const candidates = this.state.candidates.slice(0);
    candidates[index] = value;
    this.setState({ candidates });
  }

  addCandidate = () => {
    this.setState({ candidates: [ ...this.state.candidates, '']});
  }

  handleSubmit = () => {
    const electionKey = Home.allElectionsRef().push({ 
      title: this.state.electionTitle,
      owner: this.state.user.uid
    }).key;
    const candidateDB = Home.candidatesForElectionRef(electionKey);    
    this.state.candidates.forEach((candidate) => {
      const candidateEntry = {
        name: candidate, owner: this.state.user.uid
      }
      candidateDB.push(candidateEntry);
    });

    this.setState({ creating: false, electionTitle: '', candidates: ['', ''] });
  }

  render() {
    const { user, elections, candidates, electionTitle, creating } = this.state;
    const classes = this.props.classes;

    return (
      <div className={this.props.classes.wrapper}>
        {user ?
          <div>
            <Chip avatar={<Avatar src={user.photoURL} />} 
              label={user.displayName} onDelete={this.logout} />
          </div>
          :
          <Button onClick={this.login}>Log In</Button>
        }
        {user && !creating &&
          <Button onClick={() => this.setState({creating: true})}>Create an Election</Button>
        }
        {user && creating &&
          <form onSubmit={this.handleSubmit}>
            <Paper zDepth={2}>
              <TextField
                key={1}
                placeholder="My Election Name"
                label="Name your election"
                value={electionTitle}
                onChange={this.handleChange('electionTitle')}
              />
              <Divider />
              <Divider />
              {candidates.map((candidate, i) => (
                <div>
                  <TextField
                    key={i + 1}
                    placeholder="John Denver"
                    label={`Candidate ${i + 1}`}
                    value={candidate}
                    onChange={this.handleChangeCandidate(i)}
                  />
                  <Divider />
                </div>
              ))}
              <Button type='button' onClick={this.addCandidate}>Add</Button>
              <Button type='submit'>Submit</Button>
            </Paper>
          </form>
        }

        {user &&
          <div className="election-list">
            <List>
              <div>Elections</div>
              {elections.map((election, i) =>
                <ListItem key={i}>
                  <ButtonBase component={Link} to={`/monitor/${election.id}`}>
                    <ChartIcon className={classes.chartIcon} color="primary" />
                  </ButtonBase>
                  <ListItemText primary={election.title} />
                  <Avatar component={Link} to={`/vote/${election.id}`}><VoteIcon color="red" /></Avatar>
                </ListItem>
              )}
            </List>
          </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(Home);