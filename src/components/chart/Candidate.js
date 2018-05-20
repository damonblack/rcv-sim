//@flow
import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import MultiBar from './MultiBar';
import type { VoteSegments } from '../../lib/voteTypes';

const styles = {
  loser: { textDecoration: 'line-through' }
};

type Props = {
  classes: Object,
  voteSegments: VoteSegments,
  totalVotesForCandidate: number,
  percentageOfWin: number,
  candidate: { id: string, name: string },
  colorMap: Object
};

const Candidate = (props: Props) => {
  const {
    classes,
    voteSegments,
    totalVotesForCandidate,
    percentageOfWin,
    candidate: { id, name },
    colorMap
  } = props;

  const segments = [];
  let width;
  if (voteSegments) {
    voteSegments.forEach((value, key) => {
      const percent = value / totalVotesForCandidate * 100;
      segments.push([colorMap[key], percent]);
    });
    width = percentageOfWin / 2;
  } else {
    width = 1;
  }

  return (
    <div key={id}>
      <Typography
        className={totalVotesForCandidate === 0 ? classes.loser : ''}
        variant="subheading"
      >
        {name} : {totalVotesForCandidate}
      </Typography>
      <MultiBar width={width} segments={segments} />
    </div>
  );
};

export default withStyles(styles)(Candidate);
