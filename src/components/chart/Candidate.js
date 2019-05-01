// @flow
import React from 'react';
import {withStyles} from '@material-ui/core/styles';

import MultiBar from './MultiBar';
import type {VoteSegments} from '../../lib/voteTypes';

const styles = {
  loser: {
    textDecoration: 'line-through',
  },
  barWrapper: {
    transition: 'width 2s ease-in-out',
  },
};

type Props = {
  classes: Object,
  graphWidthInVotes: number,
  voteSegments: VoteSegments,
  totalVotesForCandidate: number,
  percentageOfWin: number,
  candidate: {id: string, name: string},
  colorMap: Object,
  winner?: boolean,
  loser?: boolean,
};

const Candidate = (props: Props) => {
  const {
    classes,
    graphWidthInVotes,
    voteSegments,
    totalVotesForCandidate,
    percentageOfWin,
    candidate: {id},
    colorMap,
  } = props;

  const segments = [];
  let width;
  if (voteSegments) {
    voteSegments.forEach((votes, key) => {
      const percent =
        totalVotesForCandidate > 0 ? (votes / graphWidthInVotes) * 100 : 0;
      segments.push({color: colorMap[key], percent, votes});
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
