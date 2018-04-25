import React, { Component } from 'react';
import {  Route } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';

import Home from './components/Home';
import Election from './components/Election';
import './App.css';

class App extends Component {

  render() {
    return (
      <div>
        <AppBar>
          <h2>Welcome to the Ranked Choice Vote Splainer</h2>
        </AppBar>

        <Route exact path={'/'} component={Home} />
        <Route path={'/elections/:key'} component={Election} />
      </div>
    );
  }
}

export default App;
