//@flow

import type {
  Vote,
  VoteSegments,
  Election,
  Round,
  CandidateId
} from './voteTypes';

export const getResults = (
  votes: Array<Vote>,
  candidates: Array<CandidateId>
): Election => {
  const losers: Array<CandidateId> = [];
  const election: Election = [];
  do {
    const remainingCandidates = candidates.filter(c => !losers.includes(c));
    const round = countRound(remainingCandidates, votes, losers);
    const loser = round.loser;
    election.push(round);
    if (loser) losers.push(loser);
  } while (!election.slice(-1)[0].winner);
  //!election.slice(-1)[0].winner);

  return election;
};

const countRound = (
  candidates: Array<CandidateId>,
  votes: Array<Vote>,
  losers: Array<CandidateId>
): Round => {
  const round = votes.reduce((round: Round, vote: Vote) => {
    const candidate = resolveVote(vote, candidates);
    if (candidate) {
      const favorite = vote[1];
      const previousCount = round[candidate].get(favorite) || 0;
      round[candidate].set(favorite, previousCount + 1);
      round.validVoteCount++;
    }
    return round;
  }, emptyRound(candidates, losers));
  round.winner = winner(round, candidates);
  round.loser = loser(round, candidates);
  return round;
};

const emptyRound = (
  candidates: Array<CandidateId>,
  losers: Array<CandidateId>
): Round => {
  const round = { validVoteCount: 0, loser: null, winner: null };
  const loserVotes = losers.map(loser => [loser, 0]);
  candidates.forEach(c => (round[c] = new Map([[c, 0], ...loserVotes])));
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
    const count = candidateCount(round[candidate]);
    return count > goal;
  });
};

const loser = (round: Round, candidates: Array<CandidateId>): CandidateId => {
  let loser = '';
  let min: number;
  candidates.forEach((candidate: CandidateId) => {
    const count = candidateCount(round[candidate]);
    if (!min || count < min) {
      loser = candidate;
      min = count;
    }
  });
  return loser;
};

const candidateCount = (segments: VoteSegments): number => {
  let total = 0;
  segments.forEach(value => (total = total + value));
  return total;
};
