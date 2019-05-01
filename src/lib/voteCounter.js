// @flow
import type {Vote, Results, Round, Totals, CandidateId} from './voteTypes';
/* eslint-disable no-param-reassign */

const remainingCandidates = (
  candidates: Array<CandidateId>,
  losers: Array<CandidateId>,
) => candidates.filter((c) => !losers.includes(c));

const newRound = (
  candidates: Array<CandidateId>,
  losers: Array<CandidateId>,
): Round => {
  const round = {
    segments: {},
    totals: {},
    assignedVotes: {},
    validVoteCount: 0,
    loser: null,
    winners: [],
    previousLosers: [],
  };
  const loserVotes = losers.map((loser) => [loser, 0]);
  const remaining = remainingCandidates(candidates, losers).map((c) => [c, 0]);
  candidates.forEach((c) => {
    round.totals[c] = 0;
    round.assignedVotes[c] = [];
    const newSegmentMap = new Map([
      [c, 0],
      ...loserVotes,
      ...remaining.filter((s) => s[0] !== c),
    ]);
    round.segments[c] = newSegmentMap; // new Map([[c, 0], ...competitorVotes, ...loserVotes]);
  });
  return round;
};

const resolveVote = (
  vote: Vote,
  candidates: Array<CandidateId>,
): ?CandidateId => {
  let position = 1;
  // For now we're bailing on skipped-rank votes
  while (vote[position]) {
    // find first candidate still in the running
    if (candidates.includes(vote[position])) return vote[position];
    position += 1;
  }
  return null;
};

const getWinners = (
  round: Round,
  candidates: Array<CandidateId>,
  previousWinners: Array<CandidateId>,
  votesToWin: number,
): Array<CandidateId> => {
  return candidates.filter((candidate) => {
    const count = round.totals[candidate];
    return count > votesToWin && !previousWinners.includes(candidate);
  });
};

const getLoser = (
  totals: Totals,
  candidates: Array<CandidateId>,
): CandidateId => {
  let loser = '';
  let min: number;
  candidates.forEach((candidate: CandidateId) => {
    const count = totals[candidate];
    if (min === undefined || count < min) {
      loser = candidate;
      min = count;
    }
  });
  return loser;
};

const nextRound = (
  candidates: Array<CandidateId>,
  votes: Array<Vote>,
  losers: Array<CandidateId>,
  winners: Array<CandidateId>,
  numberOfWinners: number,
): Round => {
  const remainder = remainingCandidates(candidates, losers);
  const round = votes.reduce((nRound: Round, vote: Vote) => {
    const candidate = resolveVote(vote, remainder);

    if (candidate) {
      nRound.assignedVotes[candidate].push(vote);
      const favorite = vote[1];
      const previousCount = nRound.segments[candidate].get(favorite) || 0;
      nRound.segments[candidate].set(favorite, previousCount + 1);
      const total = nRound.totals[candidate] || 0;
      nRound.totals[candidate] = total + 1;
      nRound.validVoteCount += 1;
    }
    return nRound;
  }, newRound(candidates, losers, winners));

  const votesToWin = nextRound.validVoteCount / (numberOfWinners + 1);

  winners.forEach((winner) => {
    const winningTotal = round.totals[winner];
    const percentOver = (winningTotal - votesToWin) / winningTotal;
    round.assignedVotes[winner].forEach((vote) => {
      const newRecipient = resolveVote(
        vote,
        remainingCandidates(candidates, losers.concat(winners)),
      );
      if (newRecipient) {
        round.totals.newRecipient += percentOver;
        round.totals.winner -= percentOver;

        const newSegCount = round.segments[newRecipient].get(vote[1]) || 0;
        round.segments[newRecipient].set(vote[1], newSegCount + percentOver);
        const segCount = round.segments[winner].get(vote[1]) || 0;
        round.segments[winner].set(vote[1], segCount - percentOver);
      }
    });
  });

  round.previousLosers = losers.slice();
  round.previousWinners = winners.slice();
  round.winners = getWinners(
    round,
    candidates,
    round.previousWinners,
    votesToWin,
  );
  if (round.winners.length === 0) {
    round.loser = getLoser(round.totals, remainder);
  }
  return round;
};

export const getResults = (
  votes: Array<any>,
  candidates: Array<CandidateId>,
  numberOfWinners: number = 1,
): Results => {
  const losers: Array<CandidateId> = [];
  const winners: Array<CandidateId> = [];
  const results: Results = {rounds: [], winners: []};

  do {
    const round: Round = nextRound(
      candidates,
      votes,
      losers,
      winners,
      numberOfWinners,
    );
    const {loser} = round;
    results.rounds.push(round);
    if (loser) losers.push(loser);
    winners.push(...round.winners);
  } while (
    winners.length < numberOfWinners &&
    winners.length !== candidates.length
  );

  return results;
};
