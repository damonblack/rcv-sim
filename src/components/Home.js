import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import { blue500 } from 'material-ui/styles/colors';
import { Link } from 'react-router-dom';

import { auth, googleAuth, database } from '../services';


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

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        this.watchElections(user.uid);
      } else {
        this.setState(this.defaultState);
      }
    });
  }

  watchElections = (uid) => {
    console.log('UID -------- ', uid);
    const electionsRef = database.ref('elections').orderByChild('owner').equalTo(uid);
    
    electionsRef.on('value', (snapshot) => {
      console.log('watchElections called');
      const electionsVal = snapshot.val();
      console.log('electionsRef on value called', snapshot.val());
      
      
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
      this.watchElections(result.user.uid);
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

  handleChange = (e) => {
    const value = e.target.value;
    const fieldName = e.target.dataset.name;
    this.setState({ [fieldName]: value });
  }

  handleChangeCandidate = (e) => {
    const value = e.target.value;
    const index = e.target.dataset.index;
    const candidates = this.state.candidates.slice(0);
    candidates[index] = value;
    this.setState({ candidates });
  }

  addCandidate = () => {
    const candidates = this.state.candidates;
    candidates.push('');
    this.setState({candidates});
  }

  handleSubmit = () => {
    const electionsRef = database.ref(`elections`);
    const electionKey = electionsRef.push({ 
      title: this.state.electionTitle,
      owner: this.state.user.uid
    }).key;
    const candidatesRef = database.ref(`candidates/${electionKey}`);

    this.state.candidates.forEach((candidate) => {
      const candidateEntry = {
        name: candidate, owner: this.state.user.uid
      }
      candidatesRef.push(candidateEntry);
    });

    this.setState({ creating: false, electionTitle: '', candidates: ['', ''] });
  }

  render() {
    const { user, elections, candidates, electionTitle, creating } = this.state;

    return (
      <div>
        {user ?
          <div>
            <Chip>
              <Avatar src={user.photoURL} />
              {user.displayName}
            </Chip>
            <RaisedButton onClick={this.logout}>Log Out</RaisedButton> 
          </div>
          :
          <RaisedButton onClick={this.login}>Log In</RaisedButton>
        }
        {user && !creating &&
          <RaisedButton onClick={() => this.setState({creating: true})}>Create an Election</RaisedButton>
        }
        {user && creating &&
          <form onSubmit={this.handleSubmit}>
            <Paper zDepth={2}>
              <TextField
                key={1}
                type="text"
                hintText="My Election Name"
                floatingLabelText="Name your election"
                value={electionTitle}
                data-name="electionTitle"
                underlineShow={false}
                onChange={this.handleChange}
              />
              <Divider />
              <Divider />
              {candidates.map((candidate, i) => (
                <div>
                  <TextField
                    key={i + 1}
                    type="text"
                    hintText="John Denver"
                    floatingLabelText={`Candidate ${i + 1}`}
                    value={candidate}
                    data-index={i}
                    underlineShow={false}
                    onChange={this.handleChangeCandidate}
                  />
                  <Divider />
                </div>
              ))}
              <RaisedButton type='button' onClick={this.addCandidate}>Add</RaisedButton>
              <RaisedButton type='submit'>Submit</RaisedButton>
            </Paper>
          </form>
        }

        {user &&
          <div className="election-list">
            <List>
              <Subheader>Elections</Subheader>
              {elections.map((election, i) =>
                <Link to={`/elections/${election.id}`}>
                  <ListItem
                    key={i}
                    leftAvatar={
                      <Avatar icon={<EditorInsertChart />} backgroundColor={blue500} />
                    }
                    primaryText={election.title}
                  />
                </Link>
              )}
            </List>
          </div>
        }
      </div>
    )
  }
}

export default Home;