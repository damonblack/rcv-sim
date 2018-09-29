//@flow
import type { Vote, Results, Round, Totals, CandidateId } from './voteTypes';

export const getResults = (
  votes: Array<any>,
  candidates: Array<CandidateId>,
  numberOfWinners: number = 1
): Results => {
  const losers: Array<CandidateId> = [];
  const winners: Array<CandidateId> = [];
  const results: Results = { rounds: [], winners: [] };

  do {
    const round: Round = nextRound(
      candidates,
      votes,
      losers,
      winners,
      numberOfWinners
    );
    const loser = round.loser;
    results.rounds.push(round);
    if (loser) losers.push(loser);
    winners.push(...round.winners);
  } while (
    winners.length < numberOfWinners &&
    winners.length !== candidates.length
  );

  return results;
};

const remainingCandidates = (
  candidates: Array<CandidateId>,
  losers: Array<CandidateId>
) => candidates.filter(c => !losers.includes(c));

const nextRound = (
  candidates: Array<CandidateId>,
  votes: Array<Vote>,
  losers: Array<CandidateId>,
  winners: Array<CandidateId>,
  numberOfWinners: number
): Round => {
  const remainder = remainingCandidates(candidates, losers);
  const round = votes.reduce((round: Round, vote: Vote) => {
    const candidate = resolveVote(vote, remainder);

    if (candidate) {
      round.assignedVotes[candidate].push(vote);
      const favorite = vote[1];
      const previousCount = round.segments[candidate].get(favorite) || 0;
      round.segments[candidate].set(favorite, previousCount + 1);
      const total = round.totals[candidate] || 0;
      round.totals[candidate] = total + 1;
      round.validVoteCount = round.validVoteCount + 1;
    }
    return round;
  }, newRound(candidates, losers, winners));

  const votesToWin = round.validVoteCount / (numberOfWinners + 1);

  winners.forEach(winner => {
    const winningTotal = round.totals[winner];
    const percentOver = (winningTotal - votesToWin) / winningTotal;
    round.assignedVotes[winner].forEach(vote => {
      const newRecipient = resolveVote(
        vote,
        remainingCandidates(candidates, losers.concat(winners))
      );
      if (newRecipient) {
        round.totals[newRecipient] = round.totals[newRecipient] + percentOver;
        round.totals[winner] = round.totals[winner] - percentOver;
        console.log('newRecipient', newRecipient);
        console.log('segments', round.segments);
        console.log('vote[1]', vote[1]);

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
    votesToWin
  );
  if (round.winners.length === 0) {
    round.loser = getLoser(round.totals, remainder);
  }
  return round;
};

const newRound = (
  candidates: Array<CandidateId>,
  losers: Array<CandidateId>,
  winners: Array<CandidateId>
): Round => {
  const round = {
    segments: {},
    totals: {},
    assignedVotes: {},
    validVoteCount: 0,
    loser: null,
    winners: [],
    previousLosers: []
  };
  const loserVotes = losers.map(loser => [loser, 0]);
  const remaining = remainingCandidates(candidates, losers).map(c => [c, 0]);
  candidates.forEach(c => {
    round.totals[c] = 0;
    round.assignedVotes[c] = [];
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

const getWinners = (
  round: Round,
  candidates: Array<CandidateId>,
  previousWinners: Array<CandidateId>,
  votesToWin: number
): Array<CandidateId> => {
  return candidates.filter(candidate => {
    const count = round.totals[candidate];
    return count > votesToWin && !previousWinners.includes(candidate);
  });
};

const getLoser = (
  totals: Totals,
  candidates: Array<CandidateId>
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
