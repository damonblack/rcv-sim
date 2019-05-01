const HOPEFUL = 'hopeful';
const PENDING = 'pending';
const ELECTED = 'elected';
const DEFEATED = 'defeated';

/* eslint-disable no-param-reassign */
const emptySegmentMap = (candidateIds) => {
  const segmentMap = {};
  candidateIds.forEach((c) => {
    segmentMap[c] = 0;
  });
  return segmentMap;
};

const getSegmentMap = (candidate, candidates) => {
  const others = candidates.filter((c) => c.id !== candidate.id);
  const otherTuples = others.map((c) => [c.id, candidate.segmentMap[c.id]]);
  return new Map([
    [candidate.id, candidate.segmentMap[candidate.id]],
    ...otherTuples,
  ]);
};

const recordRound = (results, voteCount) => {
  const round = {
    segments: {},
    totals: {},
    validVoteCount: voteCount,
    winners: [],
    previousLosers: [],
  };

  const candidates = Object.values(results.candidateMap);
  candidates.forEach((candidate) => {
    round.segments[candidate.id] = getSegmentMap(candidate, candidates);
    round.totals[candidate.id] = candidate.total;
    round.winners = candidates
      .filter((c) => c.status === ELECTED || c.status === PENDING)
      .map((c) => c.id);
    round.previousLosers = candidates
      .filter((c) => c.status === DEFEATED)
      .map((c) => c.id);
  });

  results.rounds.push(round);
};

const finishElection = (results) => {
  const candidates = Object.values(results.candidateMap);
  candidates.forEach((candidate) => {
    if (candidate.status === PENDING) {
      candidate.status = ELECTED;
    }
  });
  results.winners = candidates
    .filter((c) => c.status === ELECTED)
    .map((c) => c.id);

  return results;
};

const electPendingWinners = (candidates, quota) => {
  candidates
    .filter((c) => c.status === HOPEFUL)
    .forEach((candidate) => {
      if (candidate.total > quota) {
        candidate.status = PENDING;
        candidate.surplus = candidate.total - quota;
      }
    });
};

const countIsComplete = (results, numberOfWinners) => {
  const candidates = Object.values(results.candidateMap);
  const winnerCount = candidates.filter(
    (c) => c.status === PENDING || c.status === ELECTED,
  ).length;

  return (
    winnerCount === numberOfWinners || candidates.length <= numberOfWinners
  );
};

const getHighestPending = (candidates) => {
  const highestPending = candidates
    .filter((c) => c.status === PENDING)
    .sort((ca, cb) => cb.surplus - ca.surplus)[0];

  return highestPending ? highestPending.id : null;
};

const getNextHopeful = (results, rankings) => {
  let position = 1;
  while (rankings[position]) {
    const candidate = results.candidateMap[rankings[position]];
    if (candidate.status === HOPEFUL) return candidate;
    position += 1;
  }
  return null;
};

const transferSurplus = (results, winner) => {
  const transferMod = winner.surplus / winner.total;
  winner.votes.forEach((vote) => {
    const transferWeight = vote.weight * transferMod;
    winner.segmentMap[vote.rankings[1]] -= transferWeight;
    winner.total -= transferWeight;
    const recipient = getNextHopeful(results, vote.rankings);
    if (recipient) {
      vote.weight = transferWeight;
      recipient.votes.push(vote);
      recipient.total += transferWeight;
      const oldVal = recipient.segmentMap[vote.rankings[1]];
      recipient.segmentMap[vote.rankings[1]] = oldVal + transferWeight;
    }
  });
};

const electWinner = (results, winnerId) => {
  const winner = results.candidateMap[winnerId];
  transferSurplus(results, winner);
  winner.votes = [];
  winner.status = ELECTED;
};

const transferLoser = (results, loser) => {
  loser.votes.forEach((vote) => {
    const recipient = getNextHopeful(results, vote.rankings);
    if (recipient) {
      recipient.votes.push(vote);
      recipient.total += vote.weight;
      recipient.segmentMap[vote.rankings[1]] += vote.weight;
    }
  });
  loser.total = 0;
  loser.segmentMap = emptySegmentMap(Object.keys(results.candidateMap));
};

const defeatLoser = (results) => {
  const hopefuls = Object.values(results.candidateMap).filter(
    (c) => c.status === HOPEFUL,
  );
  const loser = hopefuls.sort((ca, cb) => ca.total - cb.total)[0];
  loser.status = DEFEATED;
  transferLoser(results, loser);
};

export const getResults = (rawVotes, candidateIds, numberOfWinners) => {
  const quota = rawVotes.length / (numberOfWinners + 1) + 0.0001;

  const results = {candidateMap: {}, rounds: []};

  // Seed candidates
  candidateIds.forEach((candidateId) => {
    results.candidateMap[candidateId] = {
      id: candidateId,
      votes: [],
      total: 0,
      surplus: 0,
      segmentMap: emptySegmentMap(candidateIds),
      status: HOPEFUL,
    };
  });

  // initial vote assignment
  rawVotes.forEach((rawVote) => {
    const vote = {
      rankings: rawVote,
      weight: 1,
    };
    const favId = vote.rankings[1];
    if (favId) {
      const candidate = results.candidateMap[favId];
      candidate.votes.push(vote);
      const segment = candidate.segmentMap[favId];
      candidate.segmentMap[favId] = segment + vote.weight;
      candidate.total += vote.weight;
    }
  });

  recordRound(results, rawVotes.length);

  if (countIsComplete(results, numberOfWinners)) {
    return finishElection(results);
  }

  while (!countIsComplete(results, numberOfWinners)) {
    const candidates = Object.values(results.candidateMap);
    electPendingWinners(candidates, quota);
    if (countIsComplete(results, numberOfWinners)) {
      recordRound(results, rawVotes.length);
      return finishElection(results);
    }

    const nextWinner = getHighestPending(candidates);
    if (nextWinner) {
      electWinner(results, nextWinner);
    } else {
      defeatLoser(results);
    }
    recordRound(results, rawVotes.length);
  }

  return results;
};
