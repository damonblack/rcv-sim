import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import { List, ListItem } from 'material-ui/List';

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

  handleSubmit = () => {
    const electionsRef = database.ref(`elections/${this.state.user.uid}`);
    electionsRef.push({ title: this.state.electionTitle });
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
            <span>Logged in as {user.displayName}</span>
            <Avatar src={user.photoURL} />
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
            <TextField 
              type="text" 
              hintText="My Election Name" 
              floatingLabelText="Name your election" 
              value={electionTitle} 
              data-name="electionTitle" 
              onChange={this.handleChange}
            />
            <RaisedButton type='submit'>Submit</RaisedButton>
          </form>
        }

        {this.state.user && 
          <div className="election-list">
            <span>My Elections</span>
            <List>
              {this.state.elections.map((election) => 
                <ListItem>{election.title}</ListItem>)}
            </List>
          </div>
        }

      </div>
    );
  }
}

export default App;
