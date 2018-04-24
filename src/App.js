import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import { List, ListItem } from 'material-ui/List';
import Chip from 'material-ui/Chip';
import Subheader from 'material-ui/Subheader';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import { blue500 } from 'material-ui/styles/colors';

import { auth, googleAuth, database } from './services';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      user: null,
      elections: [],
      creating: false,
      electionTitle: '',
      candidates: [ '','' ],
    }
  }

  componentDidMount() {
  }

  login = async () => {
    try {
      const result = await auth.signInWithPopup(googleAuth);
      this.setState({ user: result.user });
      const electionsRef = database.ref(`elections/${result.user.uid}`);
      electionsRef.on('value', (snapShot) => {
        const electionsVal = snapShot.val();
        
        let elections = [];
        if (electionsVal && this.state.user) {
          elections = Object.keys(electionsVal).map((key) => {
            return { id: key, title: electionsVal[key].title }
          });
        }
        this.setState({ elections });
      })
    } catch (e) {
      console.log('LOGIN FAILED: ', e.stack);
      alert('login failed');
    }
  }

  logout = async () => {
    try {
      await auth.signOut();
      this.setState({ user: null, elections: [] });
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
    const electionsRef = database.ref(`elections/${this.state.user.uid}`);
    const electionKey = electionsRef.push({ title: this.state.electionTitle }).key;
    const candidatesRef = database.ref(`candidates/${this.state.user.uid}/${electionKey}`);

    this.state.candidates.forEach((candidate) => {
      candidatesRef.push(candidate);
    });

    this.setState({creating: false, electionTitle: ''});
  }

  render() {
    const { user, electionTitle } = this.state;
    return (
      <div>
        <AppBar>
          <h2>Welcome to the Ranked Choice Vote Splainer</h2>
        </AppBar>
        {this.state.user ?
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
        {this.state.user && !this.state.creating && this.state.elections.length < 4 &&
          <RaisedButton onClick={() => this.setState({creating: true})}>Create an Election</RaisedButton>
        }

        {this.state.creating && 
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
              { this.state.candidates.map((candidate, i) => (
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

        {this.state.user && 
          <div className="election-list">
            <List>
              <Subheader>Elections</Subheader>
              {this.state.elections.map((election, i) => 
                <ListItem 
                  key={i}
                  leftAvatar={
                    <Avatar icon={<EditorInsertChart />} backgroundColor={blue500} />
                  }
                  primaryText={election.title}
                />
              )}
            </List>
          </div>
        }

      </div>
    );
  }
}

export default App;
