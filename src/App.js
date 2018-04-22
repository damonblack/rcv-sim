import React, { Component } from 'react';

import { auth, googleAuth, database } from './services';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      user: null,
      elections: [],
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
            return { id: key, name: electionsVal[key].name }
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

  createElection = () => {
    const electionsRef = database.ref(`elections/${this.state.user.uid}`);
    electionsRef.push({ name: 'John' });
  }

  render() {
    // console.log('ELECTIONS', this.state.elections);
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the Ranked Choice Vote Splainer</h1>
        </header>
        {this.state.user ?
          <div>
            <span>Logged in as {this.state.user.displayName}</span>
            <span>UID: {this.state.user.uid}</span>
            <div className='user-profile'>
              <img src={this.state.user.photoURL} />
            </div>
            <button onClick={this.logout}>Log Out</button> 
          </div>
          :
          <button onClick={this.login}>Log In</button>
        }
        {this.state.user && this.state.elections.length < 4 &&
          <button onClick={this.createElection}>Create an Election</button>
        }

        {this.state.user && 
          <ul>
            {this.state.elections.map((election) => <li key={election.id}>{election.id}/{election.name}</li>)}
          </ul>
        }

      </div>
    );
  }
}

export default App;
