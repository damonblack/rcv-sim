import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {
  electionsRef,
  candidatesForElectionRef,
  votesRef
} from '../../services';

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
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@material-ui/core';

import {
  InsertChart as ChartIcon,
  Done as VoteIcon,
  Cancel as LogoutIcon,
  Delete as DeleteIcon,
  Add as AddIcon
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
  },
  thickerButton: {
    border: '4px solid',
    borderRadius: 18,
    fontWeight: 700,
    fontSize: 18,
    padding: '14px 20px',
    '&:hover': {
      border: '4px solid'
    }
  },
  cssRoot: {
    color: 'green',
    backgroundColor: 'green',
    '&:hover': {
      backgroundColor: 'green'
    }
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const actionMovieSampleElection = {
  electionTitle: 'Which of these is the best action movie?',
  numberOfWinners: 1,
  candidates: [
    'Die Hard',
    'Raiders of the Lost Ark',
    'The Terminator',
    'The Dark Knight',
    'The Matrix',
    'The Bourne Identity'
  ]
};

class LoggedInHome extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      election: ''
    };
  }

  truncateElectionTitle(title) {
    let shortenedTitle = title.substring(0, 19);
    if (title.length > 19) {
      shortenedTitle += '...';
    }
    return shortenedTitle;
  }

  clearVotes(electionKey) {
    votesRef(electionKey).set([]);
    this.handleClose();
  }

  renderElectionsOptions(classes, elections) {
    if (elections.length > 0) {
      return (
        <List component="nav">
          {elections.map((election, i) => (
            <ListItem key={i}>
              <Grid container alignItems="center">
                <Grid item xs={3}>
                  <Typography variant="h6">
                    {this.truncateElectionTitle(election.title)}
                  </Typography>
                  {/*<Tooltip title="Delete Election Completely">
                    <ButtonBase
                      onClick={() => this.confirmElectionDelete(election.id)}
                    >
                      <DeleteIcon className={classes.deleteIcon} />
                    </ButtonBase>
                  </Tooltip>*/}
                </Grid>
                <Grid
                  item
                  xs={8}
                  direction="row"
                  justify="space-around"
                  alignItems="center"
                  container
                >
                  <Grid item>
                    <Button
                      variant="outlined"
                      size="large"
                      color="primary"
                      component={Link}
                      to={'/preview/' + election.id}
                      className={classes.thickerButton}
                    >
                      View Ballot
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      size="large"
                      color="primary"
                      component={Link}
                      to={`/vote/${election.id}`}
                      className={classes.thickerButton}
                    >
                      Enter Votes
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      size="large"
                      color="primary"
                      component={Link}
                      to={`/monitor/${election.id}/round/1`}
                      className={classes.thickerButton}
                    >
                      See Results
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() =>
                        this.setState({ election: election, open: true })
                      }
                    >
                      Clear Results
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      );
    } else {
      return (
        <Typography variant="h4" align="center">
          You haven't created any elections yet. <br />
          Get started by Creating a New Ballot or Adding a Sample Ballot.
        </Typography>
      );
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  addSampleElection({ electionTitle, numberOfWinners, candidates }) {
    const title = electionTitle.trim();
    const cleanTitle = title.replace(/[^\w\s]/gi, '');
    const key = Math.floor(Math.random() * 90000) + 10000;
    electionsRef()
      .child(key)
      .set({
        title: title,
        numberOfWinners,
        owner: this.props.user.uid,
        created: Date.now()
      })
      .then(result => {
        const candidateDB = candidatesForElectionRef(key);
        candidates.forEach(candidate => {
          const candidateEntry = {
            name: candidate.trim(),
            owner: this.props.user.uid
          };
          candidateDB.push(candidateEntry);
        });
      })
      .catch(error =>
        alert('Unable to create election. Try a different name.')
      );
  }

  render() {
    const { classes, elections } = this.props;

    return (
      <Grid container>
        <Grid item xs={0} sm={1} />
        <Grid item xs={12} sm={10}>
          <Typography
            variant="h3"
            className={classes.title}
            style={{ 'padding-top': '30px' }}
          >
            Elections
          </Typography>
          <Grid
            item
            xs={8}
            direction="row"
            alignItems="center"
            container
            style={{ 'padding-top': '30px' }}
          >
            <Grid item>
              <Typography variant="h4" className={classes.title}>
                Create New Ballot
              </Typography>
            </Grid>
            <Grid item style={{ 'padding-left': '40px' }}>
              <Button
                variant="outlined"
                size="large"
                color="primary"
                component={Link}
                to={'/create'}
                className={classes.thickerButton}
              >
                Create Ballot
              </Button>
            </Grid>
          </Grid>
          <div style={{ 'padding-top': '30px' }}>
            <Typography variant="h4" className={classes.title}>
              My Elections
            </Typography>
            {this.renderElectionsOptions(classes, elections)}
          </div>
          <div style={{ paddingTop: '30px', paddingBottom: '40px' }}>
            <Typography variant="h4" className={classes.title}>
              Sample Elections
            </Typography>
            <Typography
              variant="h6"
              className={classes.sectionText}
              style={{ width: '85%' }}
            >
              Sample Elections have been created so that you can easily
              demonstrate Ranked Choice Voting. Sample results will show how
              votes are allocated in multiple rounds. To hold an election using
              a Sample ballot, select <b>Add to My Elections</b>.
            </Typography>
            <List>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <Typography variant="h6">Action Movie Election</Typography>
                    {/*<Tooltip title="Delete Election Completely">
                      <ButtonBase
                        onClick={() => this.confirmElectionDelete(election.id)}
                      >
                        <DeleteIcon className={classes.deleteIcon} />
                      </ButtonBase>
                    </Tooltip>*/}
                  </Grid>
                  <Grid
                    item
                    xs={8}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    container
                  >
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="large"
                        color="primary"
                        className={classes.thickerButton}
                        onClick={() =>
                          this.addSampleElection(actionMovieSampleElection)
                        }
                      >
                        <AddIcon />
                        Add to My Elections
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </div>
        </Grid>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            Are you sure you want to delete your results for "
            {this.state.election.title}"?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              This can't be undone. If you're ready to throw out your previous
              results and start again then feel free to continue.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.clearVotes(this.state.election.id)}
              style={{ color: 'red' }}
            >
              Clear Results
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

LoggedInHome.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoggedInHome);
