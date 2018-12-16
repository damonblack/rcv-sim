import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import baseStyles from '../../styles/baseStyles';

const styles = theme => baseStyles;

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
        <Typography variant="h4" className={'bold greyFont subtitle'}>
          Ranked Choice Voting: A voting method that allows voters to rank
          candidates in order of preference.
        </Typography>
        <Grid container className={'pageContainer'} style={{ width: '90%' }}>
          <Grid item xs={12} md={6} className={'leftSide'}>
            <Typography variant="h3" className={'title'}>
              Create an RCV election
            </Typography>
            <Typography variant="h5" className={'title-tagline'}>
              Choose a movie for a group or pick a restaurant.
            </Typography>
            <Grid
              container
              className={'subSectionContainer'}
              style={{ 'padding-top': '40px' }}
            >
              <Grid item xs={2} className={'imageContainer'}>
                <img src={require('../../assets/Pencil.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={'sectionTitle'}>
                  Create a Ballot in Minutes
                </Typography>
                <Typography variant="h6" className={'sectionText'}>
                  Choose a movie for a group or decide on a restaurant. It’s up
                  to you.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={'subSectionContainer'}>
              <Grid item xs={2} className={'imageContainer'}>
                <img src={require('../../assets/Envelope.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={'sectionTitle'}>
                  Share a Link to Your Ballot
                </Typography>
                <Typography variant="h6" className={'sectionText'}>
                  Anyone with the Link can Vote!
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={'subSectionContainer'}>
              <Grid item xs={2} className={'imageContainer'}>
                <img src={require('../../assets/glasses.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={'sectionTitle'}>
                  See each round of results
                </Typography>
                <Typography variant="h6" className={'sectionText'}>
                  Watch Ranked Choice Voting in action and cheer for the final
                  winner.
                </Typography>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="secondary"
              className={'button'}
              fullWidth={true}
              onClick={() => this.signup()}
            >
              Sign Up & Create an Election
            </Button>
          </Grid>
          <Grid item xs={12} md={6} className={'rightSide'}>
            Waiting for the video...
          </Grid>
          <Grid item xs={12} md={6} className={'leftSide'}>
            <Typography variant="h4" className={'title'}>
              Why RCV?
            </Typography>
            <Grid
              container
              className={'subSectionContainer'}
              style={{ 'padding-top': '40px' }}
            >
              <Grid item xs={2} className={'imageContainer'}>
                <img src={require('../../assets/DollarSign.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={'sectionTitle'}>
                  RCV Saves Money
                </Typography>
                <Typography variant="h6" className={'sectionText'}>
                  Runoffs are avoided since voters have already selected a
                  second choice.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={'subSectionContainer'}>
              <Grid item xs={2} className={'imageContainer'}>
                <img src={require('../../assets/Mug.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={'sectionTitle'}>
                  More Positive Campaigns
                </Typography>
                <Typography variant="h6" className={'sectionText'}>
                  Candidates appeal to people who might consider them a second
                  choice.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={'subSectionContainer'}>
              <Grid item xs={2} className={'imageContainer'}>
                <img src={require('../../assets/Mic.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={'sectionTitle'}>
                  More Diverse Voices
                </Typography>
                <Typography variant="h6" className={'sectionText'}>
                  Voters can select their first choice without worriyng about a
                  spoiler.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} className={'rightSide'}>
            <Typography variant="h4" className={'title'}>
              How RCV Works
            </Typography>
            <Grid
              container
              className={'subSectionContainer'}
              style={{ 'padding-top': '40px' }}
            >
              <Grid item xs={2} className={'imageContainer'}>
                <img src={require('../../assets/One.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={'sectionTitle'}>
                  Step One
                </Typography>
                <Typography variant="h6" className={'sectionText'}>
                  First choice votes are counted and any candidate winning more
                  than 50% of those votes wins.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={'subSectionContainer'}>
              <Grid item xs={2} className={'imageContainer'}>
                <img src={require('../../assets/Two.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={'sectionTitle'}>
                  Step Two
                </Typography>
                <Typography variant="h6" className={'sectionText'}>
                  If no candidate wins a majority of first choice votes, the
                  candidate in last place is eliminated and her votes go to
                  those voters second choices.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={'subSectionContainer'}>
              <Grid item xs={2} className={'imageContainer'}>
                <img src={require('../../assets/Three.png')} />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className={'sectionTitle'}>
                  Step Three
                </Typography>
                <Typography variant="h6" className={'sectionText'}>
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
