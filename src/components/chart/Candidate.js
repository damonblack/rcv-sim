//@flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import MultiBar from './MultiBar';
import type { VoteSegments } from '../../lib/voteTypes';

const styles = {
  loser: { textDecoration: 'line-through' },
  barWrapper: { transition: 'width 2s ease-in-out' }
};

type Props = {
  classes: Object,
  winningCount: number,
  voteSegments: VoteSegments,
  totalVotesForCandidate: number,
  percentageOfWin: number,
  candidate: { id: string, name: string },
  colorMap: Object,
  winner?: boolean,
  loser?: boolean
};

const Candidate = (props: Props) => {
  const {
    classes,
    winningCount,
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
      const percent =
        totalVotesForCandidate > 0 ? value / winningCount * 100 : 0;
      segments.push([colorMap[key], percent]);
    });
    width = percentageOfWin;
  } else {
    width = 1;
  }

  return (
    <div className={classes.barWrapper} key={id}>
      <MultiBar width={width} segments={segments} />
    </div>
  );
};

export default withStyles(styles)(Candidate);
