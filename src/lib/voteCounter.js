const getBestRemainingChoice = (vote, losers) => {
  let position = 1;

  while(vote[position]) {
    if (!losers.includes(vote[position])) return vote[position];
    position = position + 1;
  }
};

const getTotal = (segments) => (
  Object.values(segments).reduce((total, voteCount) => total + voteCount)
);

const getLoser = (results) => {
  let loser;
  let min;
  Object.keys(results).map((key) => {
    const total = getTotal(results[key])
    if (!min || total < min) {
      loser = key;
      min = total;
    }
  })
  return loser;
}

const getVoteSegments = (votes, losers) => {
  return votes.reduce((counts, vote) => {
    const topChoice = vote[1]; 
    const bestRemainingChoice = getBestRemainingChoice(vote, losers);
    if (bestRemainingChoice) {
      if (!counts[bestRemainingChoice]) counts[bestRemainingChoice] = {};
      if (!counts[bestRemainingChoice][topChoice]) counts[bestRemainingChoice][topChoice] = 0;
      counts[bestRemainingChoice][topChoice] = counts[bestRemainingChoice][topChoice] + 1;
    }
    return counts;
  }, { });
};

const getVoteSegmentsForRound = (votes, round) => {
  const losers = [];
  let thisRound = round;
  let segments = {};
  while(thisRound) {
    segments = getVoteSegments(votes, losers);
    losers.push(getLoser(segments));
    thisRound = thisRound - 1;
  }
  return segments;
}

export const getResultsForRound = (votes, round) => {
  const segments = getVoteSegmentsForRound(votes, round);
  const results = { candidateTotals: {}, segments };
  let overallTotal = 0;
  Object.keys(segments).forEach((key) => {
    const total = getTotal(segments[key]);
    results.candidateTotals[key] = total;
    overallTotal = overallTotal + total;
  });

  results.overallTotal = overallTotal;

  return results;
}

