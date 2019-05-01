import React from 'react';
import {withStyles} from '@material-ui/core/styles';

import LoggedOutHome from './home/LoggedOutHome';
import LoggedInHome from './home/LoggedInHome';

import styles from '../styles/baseStyles';

const NewHome = ({user, elections, login}) => (
  <div>
    {user ? (
      <LoggedInHome user={user} elections={elections} />
    ) : (
      <LoggedOutHome login={login} />
    )}
  </div>
);

export default withStyles(styles)(NewHome);
