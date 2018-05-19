//@flow
import type { Vote, Results, Round, Totals, CandidateId } from './voteTypes';

export const getResults = (
  votes: Array<any>,
  candidates: Array<CandidateId>
): Results => {
  const losers: Array<CandidateId> = [];
  const results: Results = [];
  do {
    const round = countRound(candidates, votes, losers);
    const loser = round.loser;
    results.push(round);
    if (loser) losers.push(loser);
  } while (!results.slice(-1)[0].winner);

  return results;
};

const remainingCandidates = (
  candidates: Array<CandidateId>,
  losers: Array<CandidateId>
) => candidates.filter(c => !losers.includes(c));

const countRound = (
  candidates: Array<CandidateId>,
  votes: Array<Vote>,
  losers: Array<CandidateId>
): Round => {
  const remainder = remainingCandidates(candidates, losers);
  const round = votes.reduce((round: Round, vote: Vote) => {
    const candidate = resolveVote(vote, remainder);
    if (candidate) {
      const favorite = vote[1];
      const previousCount = round.segments[candidate].get(favorite) || 0;
      round.segments[candidate].set(favorite, previousCount + 1);
      const total = round.totals[candidate] || 0;
      round.totals[candidate] = total + 1;
      round.validVoteCount = round.validVoteCount + 1;
    }
    return round;
  }, emptyRound(candidates, losers));
  round.winner = winner(round, candidates);
  round.loser = loser(round.totals, remainder);
  return round;
};

const emptyRound = (
  candidates: Array<CandidateId>,
  losers: Array<CandidateId>
): Round => {
  const round = {
    segments: {},
    totals: {},
    validVoteCount: 0,
    loser: null,
    winner: null
  };
  const loserVotes = losers.map(loser => [loser, 0]);
  const remaining = remainingCandidates(candidates, losers).map(c => [c, 0]);
  candidates.forEach(c => {
    round.totals[c] = 0;
    const newSegmentMap = new Map([
      [c, 0],
      ...loserVotes,
      ...remaining.filter(s => s[0] !== c)
    ]);
    round.segments[c] = newSegmentMap; //new Map([[c, 0], ...competitorVotes, ...loserVotes]);
  });
  return round;
};

const resolveVote = (
  vote: Vote,
  candidates: Array<CandidateId>
): ?CandidateId => {
  let position = 1;
  //For now we're bailing on skipped-rank votes
  while (vote[position]) {
    //find first candidate still in the running
    if (candidates.includes(vote[position])) return vote[position];
    position = position + 1;
  }
  return null;
};

const winner = (round: Round, candidates: Array<CandidateId>): ?CandidateId => {
  const goal = round.validVoteCount / 2;
  return candidates.find(candidate => {
    const count = round.totals[candidate];
    return count > goal;
  });
};

const loser = (totals: Totals, candidates: Array<CandidateId>): CandidateId => {
  let loser = '';
  let min: number;
  candidates.forEach((candidate: CandidateId) => {
    const count = totals[candidate];
    if (!min || count < min) {
      loser = candidate;
      min = count;
    }
  });
  return loser;
};
