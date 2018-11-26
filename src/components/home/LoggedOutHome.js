import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

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
    paddingBottom: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 30
  },
  button: {
    fontWeight: 800,
    fontSize: 23,
    padding: 15,
    textTransform: 'capitalize'
  }
});

class LoggedOutHome extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  signup() {
    this.props.login();
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Typography
          variant="h4"
          className={[classes.bold, classes.greyFont, classes.subtitle]}
        >
          Ranked Choice Voting: A voting method that allows voters to rank
          candidates in order of preference.
        </Typography>
        <Grid
          container
          className={[classes.pageContainer]}
          style={{ width: '90%' }}
        >
          <Grid item xs={12} sm={6} className={classes.leftSide}>
            <Typography variant="h3" className={classes.title}>
              Create an RCV election
            </Typography>
            <Typography variant="h5">
              Choose a movie for a group or pick a restaurant.
            </Typography>
            <Grid
              container
              className={classes.subSectionContainer}
              style={{ 'padding-top': '40px' }}
            >
              <Grid item xs={2} className={classes.imageContainer}>
                <img src={require('../../assets/Pencil.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  Create a Ballot in Minutes
                </Typography>
                <Typography variant="h6" className={classes.sectionText}>
                  Choose a movie for a group or decide on a restaurant. It’s up
                  to you.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={classes.subSectionContainer}>
              <Grid item xs={2} className={classes.imageContainer}>
                <img src={require('../../assets/Envelope.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  Share a Link to Your Ballot
                </Typography>
                <Typography variant="h6" className={classes.sectionText}>
                  Anyone with the Link can Vote!
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={classes.subSectionContainer}>
              <Grid item xs={2} className={classes.imageContainer}>
                <img src={require('../../assets/glasses.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  See each round of results
                </Typography>
                <Typography variant="h6" className={classes.sectionText}>
                  Watch Ranked Choice Voting in action and cheer for the final
                  winner.
                </Typography>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              fullWidth={true}
              onClick={() => this.signup()}
            >
              Sign Up & Create an Election
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.rightSide}>
            Waiting for the video...
          </Grid>
          <Grid item xs={12} sm={6} className={classes.leftSide}>
            <Typography variant="h4" className={classes.title}>
              Why Ranked Choice Voting?
            </Typography>
            <Grid
              container
              className={classes.subSectionContainer}
              style={{ 'padding-top': '40px' }}
            >
              <Grid item xs={2} className={classes.imageContainer}>
                <img src={require('../../assets/DollarSign.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  RCV Saves Money
                </Typography>
                <Typography variant="h6" className={classes.sectionText}>
                  Runoffs are avoided since voters have already selected a
                  second choice.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={classes.subSectionContainer}>
              <Grid item xs={2} className={classes.imageContainer}>
                <img src={require('../../assets/Mug.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  More Positive Campaigns
                </Typography>
                <Typography variant="h6" className={classes.sectionText}>
                  Candidates appeal to people who might consider them a second
                  choice.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={classes.subSectionContainer}>
              <Grid item xs={2} className={classes.imageContainer}>
                <img src={require('../../assets/Mic.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  More Diverse Voices
                </Typography>
                <Typography variant="h6" className={classes.sectionText}>
                  Voters can select their first choice without worriyng about a
                  spoiler.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.rightSide}>
            <Typography variant="h4" className={classes.title}>
              How RCV Works
            </Typography>
            <Grid
              container
              className={classes.subSectionContainer}
              style={{ 'padding-top': '40px' }}
            >
              <Grid item xs={2} className={classes.imageContainer}>
                <img src={require('../../assets/One.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  Step One
                </Typography>
                <Typography variant="h6" className={classes.sectionText}>
                  First choice votes are counted and any candidate winning more
                  than 50% of those votes wins.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={classes.subSectionContainer}>
              <Grid item xs={2} className={classes.imageContainer}>
                <img src={require('../../assets/Two.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  Step Two
                </Typography>
                <Typography variant="h6" className={classes.sectionText}>
                  If no candidate wins a majority of first choice votes, the
                  candidate in last place is eliminated and her votes go to
                  those voters second choices.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={classes.subSectionContainer}>
              <Grid item xs={2} className={classes.imageContainer}>
                <img src={require('../../assets/Three.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  Step Three
                </Typography>
                <Typography variant="h6" className={classes.sectionText}>
                  If no candidate has a majority after the second round, the
                  process repeats until one candidate earns over 50% of the
                  votes.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

LoggedOutHome.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoggedOutHome);
