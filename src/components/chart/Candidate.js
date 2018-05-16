//@flow
import React from 'react';
import { Typography } from '@material-ui/core';

import MultiBar from './MultiBar';
import type { VoteSegments } from '../../lib/voteTypes';

type Props = {
  voteSegments: VoteSegments,
  totalVotesForCandidate: number,
  percentageOfWin: number,
  candidate: { id: string, name: string },
  colorMap: Object
};
const Candidate = (props: Props) => {
  const {
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
    width = `${percentageOfWin}%`;
  } else {
    width = '1px';
  }

  return (
    <div key={id}>
      <Typography variant="subheading">
        {name} : {totalVotesForCandidate}
      </Typography>
      <MultiBar width={width} segments={segments} />
    </div>
  );
};

export default Candidate;
