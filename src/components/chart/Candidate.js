import React from 'react';
import { withStyles } from 'material-ui/styles';
import { Typography } from 'material-ui';

import MultiBar from './MultiBar';


const styles = {
}

const Candidate = (props) => {
  const { 
    classes, 
    voteSegments, 
    totalVotesForCandidate,
    percentageOfWin,
    candidate: { id, name }, 
    colorMap
  } = props;

  const segments = Object.keys(voteSegments).map((key) => {
    const percent = voteSegments[key] / totalVotesForCandidate * 100
    return [ colorMap[key], percent ];
  });

  return (
    <div key={id}>
      <Typography variant="subheading">{name} : {totalVotesForCandidate}</Typography>
      <MultiBar width={`${percentageOfWin}%`} segments={segments} />
    </div>
  );
};

export default withStyles(styles)(Candidate);