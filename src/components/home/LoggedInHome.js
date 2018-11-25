import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import {
  Avatar,
  Button,
  ButtonBase,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  Typography
} from '@material-ui/core';

import {
  InsertChart as ChartIcon,
  Done as VoteIcon,
  Cancel as LogoutIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 0
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  title: {
    flexGrow: 1,
    color: '#272361',
    fontWeight: 800
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  bold: {
    fontWeight: 600
  },
  greyFont: {
    color: '#616161'
  },
  subtitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 700,
    paddingTop: 10,
    fontSize: 25
  },
  sectionTitle: {
    color: '#272361',
    fontWeight: 800
  },
  sectionText: {
    lineHeight: 1.2
  },
  rightSide: {
    paddingTop: 45
  },
  leftSide: {
    paddingRight: 55,
    paddingTop: 45
  },
  pageContainer: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  subSectionContainer: {
    paddingBottom: 25
  },
  button: {
    fontWeight: 800,
    fontSize: 23,
    padding: 15,
    textTransform: 'capitalize'
  }
});

class LoggedInHome extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  renderElectionsOptions(classes, elections) {
    if (elections.length > 0) {
      return (
        <List component="nav">
          {elections.map((election, i) => (
            <ListItem key={i} divider>
              <Tooltip title="View Results">
                <ButtonBase
                  component={Link}
                  to={`/monitor/${election.id}/round/1`}
                >
                  <ChartIcon className={classes.chartIcon} color="primary" />
                </ButtonBase>
              </Tooltip>
              <ListItemText primary={election.title} />
              <Tooltip title="Vote">
                <Avatar component={Link} to={`/vote/${election.id}`}>
                  <VoteIcon color="action" />
                </Avatar>
              </Tooltip>
              <Tooltip title="Delete Election Completely">
                <ButtonBase
                  onClick={() => this.confirmElectionDelete(election.id)}
                >
                  <DeleteIcon className={classes.deleteIcon} />
                </ButtonBase>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      );
    } else {
      return (
        <Typography variant="h4" align="center">
          You haven't made any elections yet.
        </Typography>
      );
    }
  }

  render() {
    const { classes, elections } = this.props;

    return (
      <div className={classes.results}>
        <Paper>
          <Typography variant="title" align="center">
            Elections
          </Typography>
          {this.renderElectionsOptions(classes, elections)}
        </Paper>
      </div>
    );
  }
}

LoggedInHome.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoggedInHome);
