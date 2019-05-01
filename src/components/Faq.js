// @flow
import React from 'react';
import {Typography} from '@material-ui/core';

import '../styles/baseStyles';

const Faq = () => (
  <div className="faq-container">
    <Typography
      variant="h4"
      className="subtitle"
      style={{'padding-top': '30px', 'padding-bottom': '30px'}}
    >
      Frequently Asked Questions about Ranked Choice Voting (RCV)
    </Typography>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        What is Ranked Choice Voting?
      </Typography>
      <Typography variant="h6" className="sectionText">
        Ranked Choice Voting (RCV) allows voters to rank candidates by
        preference instead of choosing just one.
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        Why change the system?
      </Typography>
      <Typography variant="h6" className="sectionText">
        Ranked Choice Voting is more voter-centric, giving them more choice,
        rather than limiting them to only supporting one candidate. <br />
        <br />
        RCV promotes candidates who are able to obtain broader support than
        plurality elections (the current system), since the winning candidate
        typically has the strongest first-choice support and also receives a
        high number of second and third-place votes.
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        How do I fill out a Ranked Choice ballot?
      </Typography>
      <Typography variant="h6" className="sectionText">
        Ranked Choice Voting is easy! Instead of choosing just one candidate,
        you can rank them all in order of your preference.
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        What if I don’t want to rank all the candidates?
      </Typography>
      <Typography variant="h6" className="sectionText">
        Your vote still counts for your one choice. We encourage voters to rank
        the full range of candidates. If you choose to not rank more candidates,
        you ballot may not be counted in a later round if your top candidates
        are eliminated and the your lower positions are left blank. These are
        called “inactive ballots.”
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        Does my vote get counted if I rank my favorite choice in every position?
      </Typography>
      <Typography variant="h6" className="sectionText">
        Your vote will count only once for that candidate, so it doesn’t help
        you candidate’s chances of winning. If voting goes to later rounds, your
        ballot won’t count once your vote is repeated.
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        Can I give different candidates the same ranking or skip a ranking?
      </Typography>
      <Typography variant="h6" className="sectionText">
        No. Your vote becomes inactive at the first indeterminate or blank
        ranking.
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        How does the tally work?
      </Typography>
      <Typography variant="h6" className="sectionText">
        The first round choices are tallied. If a candidate has a majority of
        votes, they win. If no candidate has a majority, the candidate with the
        fewest votes is eliminated. Those voters have their ballot instantly
        count for their next choice. This process continues until a candidate
        receives a majority of votes, and is declared the winner.
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        Does this get called Instant Runoff Voting?
      </Typography>
      <Typography variant="h6" className="sectionText">
        Yes. For the past 20 years, university studies have been calling it RCV
        because it is more clear to the voters.
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        Does this work in multi-winner races?
      </Typography>
      <Typography variant="h6" className="sectionText">
        Yes. The threshold formula remains the same and the tally steps are the
        same. The tally stops when the final winner has been identified. There
        is a step that goes unused in single-winner races. Proportional
        representation is very attractive to diverse communities because it
        avoid winner-take-all issues.
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        Are there other non-plurality voting methods?
      </Typography>
      <Typography variant="h6" className="sectionText">
        There are many methods of polling opinions, but not all require a
        majority to win. The majority requirement is what makes RCV most
        appropriate to elections - that the consensus of the voters prevails.
        Other polling methods encourage “strategic voting,” which makes those
        methods inappropriate for use in elections.
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        Do voters understand the ballot?
      </Typography>
      <Typography variant="h6" className="sectionText">
        Voters have experience with having back-up plans in real life, and find
        the idea easy to grasp. Fewer ballots are spoiled in RCV races.
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        Does RCV impact turnout?
      </Typography>
      <Typography variant="h6" className="sectionText">
        RCV elections tend to have higher turn out.
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        Do voters like RCV?
      </Typography>
      <Typography variant="h6" className="sectionText">
        Yes. 95% of voters were satisfied with their experience in Santa Fe’s
        2018 election, as surveyed by the University of New Mexico.
      </Typography>
    </div>
    <div className="faq-question-container">
      <Typography variant="h5" className="sectionTitle">
        Why do jurisdictions adopt RCV?
      </Typography>
      <Typography variant="h6" className="sectionText">
        Saves Money:
        <br />
        Runoffs are avoided when votes have already indicated their second
        preference.
        <br />
        <br />
        More Choice:
        <br />
        Candidates have to appeal to people who might initially vote for someone
        else.
        <br />
        <br />
        More Voice:
        <br />
        Voters have a way to express preferences while still voting for their
        first choice.
      </Typography>
    </div>
  </div>
);

export default Faq;
