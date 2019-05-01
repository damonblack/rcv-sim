import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Pencil from '../../assets/Pencil.png';
import Envelope from '../../assets/Envelope.png';
import Glasses from '../../assets/glasses.png';
import DollarSign from '../../assets/DollarSign.png';
import Mug from '../../assets/Mug.png';
import Mic from '../../assets/Mic.png';
import One from '../../assets/One.png';
import Two from '../../assets/Two.png';
import Three from '../../assets/Three.png';

import baseStyles from '../../styles/baseStyles';

class LoggedOutHome extends Component {
  signup() {
    this.props.login();
  }

  render() {
    return (
      <div>
        <Typography variant="h4" className="bold greyFont subtitle">
          Ranked Choice Voting: A voting method that allows voters to rank
          candidates in order of preference.
        </Typography>
        <Grid container className="pageContainer" style={{width: '90%'}}>
          <Grid item xs={12} md={6} className="leftSide">
            <Typography variant="h3" className="title">
              Create an RCV election
            </Typography>
            <Typography variant="h5" className="title-tagline">
              Choose a movie for a group or pick a restaurant.
            </Typography>
            <Grid
              container
              className="subSectionContainer"
              style={{'padding-top': '40px'}}
            >
              <Grid item xs={2} className="imageContainer">
                <img src={Pencil} alt="Edit" />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className="sectionTitle">
                  Create a Ballot in Minutes
                </Typography>
                <Typography variant="h6" className="sectionText">
                  Choose a movie for a group or decide on a restaurant. It’s up
                  to you.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className="subSectionContainer">
              <Grid item xs={2} className="imageContainer">
                <img src={Envelope} alt="envelope" />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className="sectionTitle">
                  Share a Link to Your Ballot
                </Typography>
                <Typography variant="h6" className="sectionText">
                  Anyone with the Link can Vote!
                </Typography>
              </Grid>
            </Grid>
            <Grid container className="subSectionContainer">
              <Grid item xs={2} className="imageContainer">
                <img src={Glasses} alt="Glasses" />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className="sectionTitle">
                  See each round of results
                </Typography>
                <Typography variant="h6" className="sectionText">
                  Watch Ranked Choice Voting in action and cheer for the final
                  winner.
                </Typography>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="secondary"
              className="button"
              fullWidth
              onClick={() => this.signup()}
            >
              Sign Up & Create an Election
            </Button>
          </Grid>
          <Grid item xs={12} md={6} className="rightSide">
            <div className="video-container">
              <iframe
                title="Some video"
                width="560"
                height="315"
                src="https://www.youtube.com/embed/GlZ3LPVLoV0"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6} className="leftSide">
            <Typography variant="h4" className="title">
              Why RCV?
            </Typography>
            <Grid
              container
              className="subSectionContainer"
              style={{'padding-top': '40px'}}
            >
              <Grid item xs={2} className="imageContainer">
                <img src={DollarSign} alt="DollarSign" />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className="sectionTitle">
                  RCV Saves Money
                </Typography>
                <Typography variant="h6" className="sectionText">
                  Runoffs are avoided since voters have already selected a
                  second choice.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className="subSectionContainer">
              <Grid item xs={2} className="imageContainer">
                <img src={Mug} alt="Mug" />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className="sectionTitle">
                  More Positive Campaigns
                </Typography>
                <Typography variant="h6" className="sectionText">
                  Candidates appeal to people who might consider them a second
                  choice.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className="subSectionContainer">
              <Grid item xs={2} className="imageContainer">
                <img src={Mic} alt="Mic" />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className="sectionTitle">
                  More Diverse Voices
                </Typography>
                <Typography variant="h6" className="sectionText">
                  Voters can select their first choice without worriyng about a
                  spoiler.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} className="rightSide">
            <Typography variant="h4" className="title">
              How RCV Works
            </Typography>
            <Grid
              container
              className="subSectionContainer"
              style={{'padding-top': '40px'}}
            >
              <Grid item xs={2} className="imageContainer">
                <img src={One} alt="One" />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className="sectionTitle">
                  Step One
                </Typography>
                <Typography variant="h6" className="sectionText">
                  First choice votes are counted and any candidate winning more
                  than 50% of those votes wins.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className="subSectionContainer">
              <Grid item xs={2} className="imageContainer">
                <img src={Two} alt="Two" />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className="sectionTitle">
                  Step Two
                </Typography>
                <Typography variant="h6" className="sectionText">
                  If no candidate wins a majority of first choice votes, the
                  candidate in last place is eliminated and her votes go to
                  those voters second choices.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className="subSectionContainer">
              <Grid item xs={2} className="imageContainer">
                <img src={Three} alt="Three" />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5" className="sectionTitle">
                  Step Three
                </Typography>
                <Typography variant="h6" className="sectionText">
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

export default withStyles(baseStyles)(LoggedOutHome);
