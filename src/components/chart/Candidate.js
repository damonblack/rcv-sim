import React from 'react';
import { withStyles } from 'material-ui/styles';
import { Typography } from 'material-ui';

import MultiBar from './MultiBar';

const styles = {};

const Candidate = props => {
  const {
    classes,
    voteSegments,
    totalVotesForCandidate,
    percentageOfWin,
    candidate: { id, name },
    colorMap
  } = props;

  const segments = [];
  voteSegments.forEach((value, key) => {
    const percent = value / totalVotesForCandidate * 100;
    segments.push([colorMap[key], percent]);
  });

  return (
    <div key={id}>
      <Typography variant="subheading">
        {name} : {totalVotesForCandidate}
      </Typography>
      <MultiBar width={`${percentageOfWin}%`} segments={segments} />
    </div>
  );
};

export default withStyles(styles)(Candidate);
